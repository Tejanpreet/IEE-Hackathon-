# Roadmap

Legend: `[ ]` open · `[~] (who/branch)` in progress · `[x]` done
Claim a task by editing its box before you start. One task per agent at a time.

## Done (scaffold)
- [x] Repo structure, CLAUDE.md files, docs, `.claude/` agents + commands
- [x] Design tokens (dark + light) in `frontend/src/styles/tokens.css`
- [x] Theme toggle (persists to localStorage, respects system preference)
- [x] Nav with smooth-scroll to #priority, #compare, #method; About route
- [x] Hero, stats bar, priority list (search, product filter, weight ×2/×3/×5), compare, method, CTA, footer
- [x] Corridor drawer: header, Prev/Next, info panel, URL state `?corridor=id`, Esc to close
- [x] Google Map: themed styles, corridor boundary, pipelines, incident markers, popup, legend, map/satellite toggle
- [x] API client with mock fallback (`VITE_USE_MOCKS=true`)
- [x] FastAPI backend with all contract endpoints (mock data) + adapter stub for teammate scripts
- [x] About page

## Next: data (owner: api-integrator)
- [x] Connect `backend/app/adapters/risk_engine.py` to the teammate's risk scripts (see backend/CLAUDE.md)
- [ ] Replace mock incidents with real CER incident rows (lat/lng, level, date, type)
- [ ] Real pipeline geometry (CER pipeline systems layer) for `/api/pipelines`
- [ ] Real corridor boundaries (buffer around nearest-town grouping)
- [ ] Set `VITE_USE_MOCKS=false` and verify every screen

## Next: map (owner: map-specialist, files: frontend/src/features/map/)
- [ ] Marker clustering at low zoom (`@googlemaps/markerclusterer`)
- [ ] Filter incidents by level from the info panel
- [ ] "Fit to corridor" button

## Next: UI polish (owner: ui-builder)
- [ ] Loading skeletons for table and drawer
- [ ] Empty state for search with no results
- [ ] Export CSV button wired (client-side from ranking rows)
- [ ] Responsive pass (≥1024px is the target; don't break 768px)
- [ ] Team section on About: real names + roles

## Next: quality (owner: design-reviewer)
- [ ] Contrast check both themes (WCAG AA for text)
- [ ] Keyboard: table rows focusable, drawer traps focus
- [ ] Copy pass against DESIGN.md copy rules

## Demo prep
- [ ] Restrict Google Maps key to localhost + demo domain
- [ ] Deploy frontend (Vercel) + backend (Render/Fly/Railway)
- [ ] 3 talking points: Hardisty ▲6, Medicine Hat ▼10, Edson ▼7
