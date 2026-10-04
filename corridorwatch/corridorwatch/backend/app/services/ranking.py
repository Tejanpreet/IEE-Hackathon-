"""Risk score = incidents × consequence weight. The single source of the formula."""
from __future__ import annotations

from app.adapters import risk_engine


def consequence_weight(consequence: str, high_weight: int) -> int:
    return high_weight if consequence == "high" else 2 if consequence == "medium" else 1


def _count_ranks(rows: list[dict]) -> dict[str, int]:
    ordered = sorted(rows, key=lambda r: (-r["incidents"], r["corridor"]))
    return {r["id"]: i + 1 for i, r in enumerate(ordered)}


def rank(weight: int, limit: int | None = None) -> dict:
    base = risk_engine.corridors()
    count_rank = _count_ranks(base)
    scored = [
        {**c, "score": c["incidents"] * consequence_weight(c["consequence"], weight), "count_rank": count_rank[c["id"]]}
        for c in base
    ]
    scored.sort(key=lambda r: (-r["score"], -r["incidents"]))
    for i, r in enumerate(scored):
        r["rank"] = i + 1
    top5 = {r["id"] for r in scored[:5]}
    overlap = sum(1 for cid, cr in count_rank.items() if cr <= 5 and cid in top5)
    return {
        **risk_engine.totals(),
        "weight": weight,
        "top5_overlap_with_count_only": overlap,
        "rows": scored[:limit] if limit else scored,
    }


def corridor_detail(cid: str, weight: int) -> dict | None:
    row = next((r for r in rank(weight)["rows"] if r["id"] == cid), None)
    if not row:
        return None
    incs = risk_engine.incidents(cid)
    by_level = {str(l): 0 for l in range(1, 6)}
    for i in incs:
        by_level[str(i["level"])] += 1
    recent = sorted(incs, key=lambda i: i["date"], reverse=True)[:3]
    return {
        **row,
        "summary": risk_engine.summary(cid)
        or f"{row['corridor']} ranks #{row['rank']} once consequence is weighted, versus #{row['count_rank']} on incident count alone.",
        "boundary": risk_engine.boundary(cid),
        "by_level": by_level,
        "recent": [{k: i[k] for k in ("id", "date", "type", "level", "volume_m3")} for i in recent],
    }
