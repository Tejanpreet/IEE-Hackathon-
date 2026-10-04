# Design spec

Figma reference: https://www.figma.com/design/kRynP1TI5ktxUvZy6fEyYs (page "CorridorWatch v2").
Code is now the source of truth. Figma is reference only.

## Principles (CRAP)
- **Contrast:** one primary (teal) action per view. Risk colours carry meaning only, never decoration.
- **Repetition:** same Button, Badge, Card, Row components everywhere. Section headers always: eyebrow → H2 → one-line sub.
- **Alignment:** 1200px content column (120px side gutters at 1440). 12-column grid, 24px gutters.
- **Proximity:** 8px inside groups, 24px between groups, 96px between sections.

## Colour tokens
Defined in `frontend/src/styles/tokens.css`. Theme is switched by `data-theme="dark|light"` on `<html>`.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg-app` | #0B1220 | #F8FAFC | Page |
| `--bg-surface` | #111C2E | #FFFFFF | Cards, table, panels |
| `--bg-elevated` | #18263A | #F1F5F9 | Hover, active, header rows |
| `--brand-primary` | #14B8A6 | #0F8F78 | Primary button, active state, brand |
| `--brand-on-primary` | #042F2B | #FFFFFF | Text on primary |
| `--action-blue` | #3B82F6 | #2563EB | Links, focus, sweet-gas |
| `--status-warning` | #F59E0B | #D9861A | Medium consequence, crude oil |
| `--status-high` | #E5484D | #D83F45 | High consequence, sour gas, rank up |
| `--status-low` | #8A9BB0 | #64748B | Low consequence |
| `--text-primary` | #F8FAFC | #172033 | Body, headings |
| `--text-secondary` | #94A3B8 | #64748B | Supporting copy |
| `--text-muted` | #64748B | #94A3B8 | Captions, metadata |
| `--border-default` | #263449 | #D8E0EA | All hairlines |

Tints: use `color-mix(in srgb, var(--status-high) 14%, transparent)` for badge backgrounds.

### Incident likelihood scale (map + legend)
Level 5 → 1: `--incident-5` … `--incident-1` (dark blue → pale blue).

## Type (Inter)
| Role | Size/line | Weight | Tracking |
|---|---|---|---|
| Display | 64/70 | 700 | -3% |
| H2 | 32/40 | 700 | -2% |
| H3 | 20/28 | 600 | -1% |
| Body L | 18/28 | 400 | 0 |
| Body | 16/24 | 400 | 0 |
| Small | 14/20 | 400–600 | 0 |
| Caption | 12/16 | 500 | 0 |
| Eyebrow | 12/16 | 600 | +10%, uppercase |

## Spacing & shape
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 (`--space-*`)
- Radius: 6 (badge rank), 8 (controls), 12 (cards), 16 (hero card, CTA), 999 (pills)
- Shadows: only on floating layers (drawer, hero preview card, map controls)

## Components (see frontend/src/components/README.md)
Button (primary / secondary / ghost), Badge (high / medium / low / product), Segmented, SearchInput,
Card, StatTile, SectionHeader, Table rows, Drawer, ThemeToggle.

## Pages
1. **Home** `/`: Nav → Hero (+ preview card) → Stats bar → Priority list (#priority) → Compare (#compare) → Method (#method) → CTA → Footer
2. **About** `/about`: mission, problem, team, CTA
3. **Corridor drawer**: opens over Home from any table row. URL `/?corridor=hardisty` so it's shareable. Esc / scrim / ✕ closes. Prev/Next cycle the current ranking.

## Copy rules
- Sentence case everywhere. Verb-first buttons ("Export list", "View priority list").
- No "please", "simply", "successfully", exclamation marks.
- Product voice: confident, plain, practical. Speak to integrity teams.
- Hero: **"Inspect where it matters most"**.

## Map style
- Base: Google Maps JS API with custom `styles` per theme (`frontend/src/features/map/mapStyles.ts`).
- Must show: roads + highway shields, water, parks, town labels, terrain shading, admin borders.
- Overlays (our data): corridor boundary (teal dashed, 6% fill), pipelines (neutral 2.5px, selected corridor teal 4px),
  incidents (circles coloured by level, size 10–16px, white 1px stroke), click popup.
- Controls: zoom, map/satellite toggle, legend, fullscreen. Hide street view + POIs.
