# Decisions log

Append-only. Format: date · decision · why. Don't relitigate these without a new entry.

- 2026-10-03 · **React + Vite + TypeScript** frontend · fast dev server, types catch contract drift.
- 2026-10-03 · **FastAPI** backend wrapping the team's Python risk scripts · heavy work stays in Python; auto docs at `/docs`.
- 2026-10-03 · **Teammate's Next.js map stays untouched** · their Python scripts are reused via `backend/app/adapters/risk_engine.py`; no rewrite.
- 2026-10-03 · **Google Maps JS API** via `@vis.gl/react-google-maps` with legacy `styles` (no Map ID) · lets us theme dark/light in code without Cloud Console styling.
- 2026-10-03 · **Theme via CSS variables + `data-theme`** · one component tree serves both themes.
- 2026-10-03 · **Palette** · dark: #0B1220 / #111C2E / #18263A, teal #14B8A6; light: #F8FAFC / #FFFFFF / #F1F5F9, teal #0F8F78. Risk colours are semantic only.
- 2026-10-03 · **Score** = incidents × weight(consequence); high = user weight (2/3/5), medium = 2, low = 1. Undated rows dropped.
- 2026-10-03 · **Mock fallback** · frontend works without backend (`VITE_USE_MOCKS=true`) so UI and data work can run in parallel.
- 2026-10-03 · **Drawer state in URL** (`?corridor=id`) · shareable, back button closes it.
- 2026-10-03 · **No CSS framework** · plain CSS modules-by-convention with tokens; fewer deps, full control.
- 2026-10-03 · **Live data = teammate's engine as a read-only submodule** (`vendor/risk-engine`) · Alberta rows, all years, from their CER file; incident `level` = their likelihood 1–5; `inspected` = not "never inspected"; corridor = nearest populated centre with province suffixes stripped.
- 2026-10-03 · **Corridor consequence = worst incident** · their per-incident consequence 4–5 → high, 2–3 → medium, 1/none → low; the corridor takes its max. One serious incident is never hidden by many minor ones. `ranking.py` formula unchanged.
- 2026-10-03 · **Live pipelines empty, boundary = padded incident hull** · placeholders until the pipeline-geometry and corridor-boundary roadmap tasks.
- 2026-10-03 · **Hero copy** "Inspect where it matters most" (may change later).
