# API contract

Base URL: `/api` (Vite proxies to `http://localhost:8000` in dev).
Mirrors: `frontend/src/api/types.ts` and `backend/app/schemas.py`. Change all three together.

## Enums
- `product`: `"crude_oil" | "sour_gas" | "sweet_gas"`
- `consequence`: `"high" | "medium" | "low"`
- `level` (incident likelihood): `1 | 2 | 3 | 4 | 5`

## `GET /api/ranking?weight=3&limit=15`
`weight` = multiplier for high-consequence (2, 3 or 5). Medium is ×2, low ×1.
```json
{
  "weight": 3,
  "generated_at": "2026-09-25T00:00:00Z",
  "total_incidents": 2034,
  "dropped_undated": 12,
  "total_corridors": 128,
  "top5_overlap_with_count_only": 1,
  "rows": [
    {
      "id": "hardisty",
      "rank": 1,
      "corridor": "Hardisty",
      "product": "crude_oil",
      "incidents": 24,
      "consequence": "high",
      "score": 72,
      "count_rank": 7,
      "centroid": { "lat": 52.676, "lng": -111.307 }
    }
  ]
}
```

## `GET /api/corridor/{id}?weight=3`
```json
{
  "id": "hardisty",
  "rank": 1,
  "corridor": "Hardisty",
  "product": "crude_oil",
  "consequence": "high",
  "incidents": 24,
  "score": 72,
  "count_rank": 7,
  "summary": "Hardisty is a major crude-oil hub...",
  "centroid": { "lat": 52.676, "lng": -111.307 },
  "boundary": [{ "lat": 52.9, "lng": -111.7 }],
  "by_level": { "5": 3, "4": 5, "3": 6, "2": 6, "1": 4 },
  "recent": [
    { "id": "INC2026-0318", "date": "2026-03-14", "type": "Crude oil release", "level": 5, "volume_m3": 2.1 }
  ]
}
```

## `GET /api/corridor/{id}/incidents`
```json
[
  { "id": "INC2026-0318", "lat": 52.70, "lng": -111.25, "level": 5, "date": "2026-03-14",
    "type": "Crude oil release", "volume_m3": 2.1, "inspected": false }
]
```

## `GET /api/pipelines?corridor={id}`
```json
[
  { "id": "p1", "name": "Crude mainline", "product": "crude_oil",
    "path": [{ "lat": 52.6, "lng": -111.9 }, { "lat": 52.68, "lng": -111.3 }] }
]
```

## Errors
`404 {"detail": "Corridor not found"}`. Frontend shows an inline message with a retry button.
