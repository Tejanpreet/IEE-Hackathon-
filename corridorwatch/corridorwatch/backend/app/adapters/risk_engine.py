"""The ONE place the teammate's risk scripts plug in.

Every route calls these five functions. With RISK_ENGINE_PATH blank they return mock data; set it
(e.g. ../vendor/risk-engine) and the `_live_*` functions score the teammate's CER file with their
likelihood.py / consequence.py / map_likelihood.py. Their repo is imported only, never written to.

Shapes (plain dicts, validated later by app/schemas.py):
  corridors()        -> [{id, corridor, product, incidents, consequence, centroid:{lat,lng}}]
                        `incidents` = DATED incident count; `consequence` = high|medium|low
  totals()           -> {total_incidents, dropped_undated, total_corridors, generated_at}
  incidents(id)      -> [{id, lat, lng, level 1-5, date YYYY-MM-DD, type, volume_m3|None, inspected}]
  boundary(id)       -> [{lat, lng}, ...]  polygon around the corridor
  pipelines(id)      -> [{id, name, product, path:[{lat,lng}]}]
"""
from __future__ import annotations

import importlib
import math
import os
import re
import sys
from collections import Counter, defaultdict
from functools import lru_cache
from pathlib import Path
from types import SimpleNamespace

from app.data import mock

ENGINE_PATH = os.getenv("RISK_ENGINE_PATH", "").strip()
LIVE = bool(ENGINE_PATH)

CSV_NAME = "data/pipeline-incidents-comprehensive-data.csv"
PROVINCE = "Alberta"
NAME_FIXES = {
    "Grand Prairie": "Grande Prairie",
    "Smokey Lake": "Smoky Lake",
    "The community of Bonanza is 4.4 kMs from this location": "Bonanza",
}
# "Edson, AB", "Athabasca,AB", "Lodgepole ,AB", "Suffield, Albereta" → bare town name
PROVINCE_SUFFIX = re.compile(r"\s*,?\s*(AB|Alta\.?|Albe?re?ta)\s*$", re.IGNORECASE)


def _engine_dir() -> Path:
    path = Path(ENGINE_PATH)
    return path if path.is_absolute() else (Path(__file__).resolve().parents[2] / path).resolve()


@lru_cache(maxsize=1)
def _engine():
    """Import the teammate's modules once. Their repo is read-only: no .pyc files are written into it."""
    sys.path.insert(0, str(_engine_dir()))
    prev, sys.dont_write_bytecode = sys.dont_write_bytecode, True
    try:
        return SimpleNamespace(
            loader=importlib.import_module("map_likelihood"),
            likelihood=importlib.import_module("likelihood"),
            consequence=importlib.import_module("consequence"),
        )
    finally:
        sys.dont_write_bytecode = prev


def _slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def _product(substance: str) -> str | None:
    s = substance.lower()
    if not s or s == "not applicable":
        return None
    if "sour" in s:
        return "sour_gas"
    if any(k in s for k in ("crude", "oil", "diesel", "condensate")):
        return "crude_oil"
    return "sweet_gas"


def _bucket(level: int | None) -> str:
    """Teammate consequence 1-5 → contract label. Corridor label uses its worst incident (DECISIONS)."""
    return "high" if (level or 0) >= 4 else "medium" if (level or 0) >= 2 else "low"


@lru_cache(maxsize=1)
def _load() -> dict:
    """Score every located Alberta incident with the teammate's engine, then group by nearest town."""
    import pandas as pd

    eng = _engine()
    csv = _engine_dir() / CSV_NAME
    rows = [r for r in eng.loader.load_cer_incidents(csv) if r.province == PROVINCE]
    scored = {s.incident_id: s for s in eng.likelihood.score_incidents([r.incident for r in rows])}
    extra = (
        pd.read_csv(csv, encoding="cp1252", dtype=str, keep_default_na=False)
        .set_index("Incident Number")[["Incident Types", "Substance", "Substance carried"]]
        .to_dict(orient="index")
    )

    by_corridor: dict[str, list[dict]] = defaultdict(list)
    names: dict[str, str] = {}
    for r in rows:
        s = scored[r.incident.incident_id]
        if s.coordinates_missing:
            continue
        name = PROVINCE_SUFFIX.sub("", r.nearest_populated_centre).strip()
        name = NAME_FIXES.get(name, name)
        cid = _slug(name)
        names[cid] = name
        x = extra[r.incident.incident_id]
        by_corridor[cid].append({
            "id": r.incident.incident_id,
            "lat": r.incident.latitude,
            "lng": r.incident.longitude,
            "level": s.likelihood,
            "date": r.incident.reported.isoformat(),
            "type": x["Incident Types"].split(",")[0].strip() or "Unspecified",
            "volume_m3": eng.consequence.parse_volume(r.approximate_volume),
            "inspected": not s.never_inspected,
            "_consequence": eng.consequence.consequence_level(
                r.release_type, r.approximate_volume, r.population_density,
                r.what_happened_category, r.why_it_happened_category,
            ),
            "_product": _product(x["Substance carried"]) or _product(x["Substance"]),
        })

    corridors = []
    for cid, incs in by_corridor.items():
        products = Counter(i["_product"] for i in incs if i["_product"])
        corridors.append({
            "id": cid,
            "corridor": names[cid],
            "product": products.most_common(1)[0][0] if products else "sweet_gas",
            "incidents": len(incs),
            "consequence": _bucket(max((i["_consequence"] or 0) for i in incs)),
            "centroid": {
                "lat": sum(i["lat"] for i in incs) / len(incs),
                "lng": sum(i["lng"] for i in incs) / len(incs),
            },
        })
    return {
        "corridors": corridors,
        "incidents": {cid: [{k: v for k, v in i.items() if not k.startswith("_")} for i in incs]
                      for cid, incs in by_corridor.items()},
        "as_of": eng.likelihood.AS_OF.isoformat(),
    }


def _hull(points: list[tuple[float, float]]) -> list[tuple[float, float]]:
    """Convex hull (monotone chain) of (lng, lat) points, counter-clockwise."""
    pts = sorted(set(points))
    if len(pts) < 3:
        return pts

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]


# ---------- Live data from the teammate's engine (vendor/risk-engine) ----------

def _live_corridors() -> list[dict]:
    return _load()["corridors"]


def _live_totals() -> dict:
    data = _load()
    return {
        "total_incidents": sum(c["incidents"] for c in data["corridors"]),
        "dropped_undated": 0,  # their loader requires a Reported Date on every row
        "total_corridors": len(data["corridors"]),
        "generated_at": f"{data['as_of']}T00:00:00Z",
    }


def _live_incidents(cid: str) -> list[dict]:
    return _load()["incidents"].get(cid, [])


def _live_boundary(cid: str) -> list[dict]:
    """Padded hull of the corridor's incidents. Placeholder until the 'real corridor boundaries' task."""
    c = next((c for c in _live_corridors() if c["id"] == cid), None)
    if not c:
        return []
    lat, lng = c["centroid"]["lat"], c["centroid"]["lng"]
    hull = _hull([(i["lng"], i["lat"]) for i in _live_incidents(cid)])
    if len(hull) < 3:
        return [
            {"lat": lat + math.sin(a) * 0.08, "lng": lng + math.cos(a) * 0.13}
            for a in (k / 24 * 2 * math.pi for k in range(24))
        ]
    pad = 0.05
    out = []
    for x, y in hull:
        dx, dy = x - lng, y - lat
        d = math.hypot(dx, dy) or 1.0
        out.append({"lat": y + dy / d * pad, "lng": x + dx / d * pad})
    return out


def _live_pipelines(cid: str) -> list[dict]:
    # Empty until the "Real pipeline geometry (CER pipeline systems layer)" roadmap task.
    return []


# ---------- Public API used by routes (don't change signatures) ----------

def corridors() -> list[dict]:
    return _live_corridors() if LIVE else mock.corridors()


def totals() -> dict:
    return _live_totals() if LIVE else mock.TOTALS


def incidents(cid: str) -> list[dict]:
    return _live_incidents(cid) if LIVE else mock.incidents(cid)


def boundary(cid: str) -> list[dict]:
    return _live_boundary(cid) if LIVE else mock.boundary(cid)


def pipelines(cid: str) -> list[dict]:
    return _live_pipelines(cid) if LIVE else mock.pipelines(cid)


def summary(cid: str) -> str | None:
    return None if LIVE else mock.summary(cid)
