# Component index

Check here before creating anything. Add a line when you create a component.

## Primitives — `components/ui.tsx` (+ `ui.css`)
| Component | Use |
|---|---|
| `Button` | `variant` primary / secondary / ghost, `size` md / sm, `icon`. One primary per view. |
| `Badge` | Tinted pill. `color` = a CSS var. |
| `ConsequenceBadge` | High / Medium / Low with semantic colour. |
| `Dot` | Small colour dot (product, level). |
| `ProductLabel` | Dot + product name. |
| `Segmented` | Toggle group (filters, weight, theme, map type). |
| `SearchInput` | Search field with icon. |
| `RankChip` | Rank number square; top 3 get the high-risk tint. `size="lg"` for drawer header. |
| `SectionHeader` | Eyebrow → H2 → sub. Use for every section. |
| `Logo` | Mark + wordmark. |
| `StatTile` | Value + label tile (drawer). |
| `InlineError` | Error message + retry. |
| `shiftLabel()` | Helper: "▲ 6 from #7" text + colour. |

## Layout — `components/`
| Component | Use |
|---|---|
| `Nav` | Sticky top nav, section links, theme toggle. |
| `Footer` | Site footer. |

## Sections — `sections/` (Home page)
`Hero`, `StatsBar`, `PriorityList`, `CompareSection`, `MethodSection`, `CtaBand`

## Features
| Component | Use |
|---|---|
| `features/drawer/CorridorDrawer` | Side drawer: header, info panel, map. Driven by `?corridor=id`. |
| `features/map/CorridorMap` | Google Map with corridor overlays. Falls back to a notice if no API key. |
| `features/map/MapLegend` | Legend overlay. |
