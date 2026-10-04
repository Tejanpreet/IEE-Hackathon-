"""Placeholder data. Used when RISK_ENGINE_PATH is not set. Same corridors as frontend/src/api/mocks.ts."""
import math
import random

# id, name, product, incidents (dated), consequence, lat, lng
CORRIDORS = [
    ("hardisty", "Hardisty", "crude_oil", 24, "high", 52.676, -111.307),
    ("drayton-valley", "Drayton Valley", "sour_gas", 22, "high", 53.222, -114.977),
    ("fort-mcmurray", "Fort McMurray", "crude_oil", 20, "high", 56.726, -111.381),
    ("rocky-mountain-house", "Rocky Mountain House", "sour_gas", 18, "high", 52.375, -114.922),
    ("grande-prairie", "Grande Prairie", "sour_gas", 26, "medium", 55.171, -118.795),
    ("whitecourt", "Whitecourt", "crude_oil", 25, "medium", 54.142, -115.683),
    ("cold-lake", "Cold Lake", "crude_oil", 15, "high", 54.464, -110.182),
    ("edson", "Edson", "sweet_gas", 41, "low", 53.582, -116.437),
    ("swan-hills", "Swan Hills", "sour_gas", 13, "high", 54.711, -115.401),
    ("hinton", "Hinton", "sweet_gas", 37, "low", 53.400, -117.585),
    ("lloydminster", "Lloydminster", "crude_oil", 17, "medium", 53.278, -110.005),
    ("brooks", "Brooks", "sweet_gas", 32, "low", 50.565, -111.898),
    ("red-deer", "Red Deer", "crude_oil", 15, "medium", 52.269, -113.811),
    ("medicine-hat", "Medicine Hat", "sweet_gas", 28, "low", 50.041, -110.677),
    ("fox-creek", "Fox Creek", "sour_gas", 13, "medium", 54.401, -116.808),
]

SUMMARIES = {
    "hardisty": "Hardisty is a major crude-oil hub. It has fewer incidents than Edson, but any failure here is high consequence.",
    "edson": "Edson has the most incidents of any corridor, but they are mostly small sweet-gas releases.",
    "medicine-hat": "Medicine Hat sees frequent sweet-gas events. Busy, but rarely severe.",
}

TYPES = [
    "Crude oil release", "Valve leak at pump station", "Pressure exceedance", "Corrosion pinhole",
    "Fire at meter station", "Gas release", "Third-party damage",
]


def corridors() -> list[dict]:
    return [
        {"id": i, "corridor": n, "product": p, "incidents": c, "consequence": q, "centroid": {"lat": la, "lng": ln}}
        for i, n, p, c, q, la, ln in CORRIDORS
    ]


def _find(cid: str) -> dict | None:
    return next((c for c in corridors() if c["id"] == cid), None)


def incidents(cid: str) -> list[dict]:
    c = _find(cid)
    if not c:
        return []
    r = random.Random(cid)
    out = []
    for i in range(c["incidents"]):
        x = r.random()
        level = 5 if x < 0.12 else 4 if x < 0.3 else 3 if x < 0.55 else 2 if x < 0.8 else 1
        year = 2026 - r.randint(0, 7)
        month = r.randint(1, 8 if year == 2026 else 12)  # data ends 2026-09-25
        out.append({
            "id": f"INC{year}-{100 + i * 7:04d}",
            "lat": c["centroid"]["lat"] + (r.random() - 0.5) * 0.36,
            "lng": c["centroid"]["lng"] + (r.random() - 0.5) * 0.6,
            "level": level,
            "date": f"{year}-{month:02d}-{r.randint(1, 27):02d}",
            "type": r.choice(TYPES),
            "volume_m3": round(r.random() * 5, 1) if r.random() > 0.4 else None,
            "inspected": r.random() > 0.6,
        })
    return out


def boundary(cid: str) -> list[dict]:
    c = _find(cid)
    if not c:
        return []
    lat, lng = c["centroid"]["lat"], c["centroid"]["lng"]
    pts = []
    for i in range(24):
        a = i / 24 * 2 * math.pi
        w = 1 + 0.12 * math.sin(a * 3)
        pts.append({"lat": lat + math.sin(a) * 0.22 * w, "lng": lng + math.cos(a) * 0.36 * w})
    return pts


def pipelines(cid: str) -> list[dict]:
    c = _find(cid)
    if not c:
        return []
    lat, lng = c["centroid"]["lat"], c["centroid"]["lng"]

    def line(a1, o1, a2, o2):
        return [
            {"lat": lat + a1, "lng": lng + o1}, {"lat": lat + a1 * 0.4, "lng": lng + o1 * 0.5},
            {"lat": lat, "lng": lng},
            {"lat": lat + a2 * 0.5, "lng": lng + o2 * 0.4}, {"lat": lat + a2, "lng": lng + o2},
        ]

    return [
        {"id": f"{cid}-p1", "name": "Mainline", "product": c["product"], "path": line(-0.2, -0.9, 0.25, 0.9)},
        {"id": f"{cid}-p2", "name": "Lateral north", "product": c["product"], "path": line(0.6, -0.15, -0.5, 0.2)},
        {"id": f"{cid}-p3", "name": "Gathering line", "product": "sweet_gas", "path": line(0.35, 0.7, -0.4, -0.6)},
    ]


def summary(cid: str) -> str | None:
    return SUMMARIES.get(cid)


TOTALS = {"total_incidents": 2034, "dropped_undated": 12, "total_corridors": 128, "generated_at": "2026-09-25T00:00:00Z"}
