# CorridorWatch

Risk-ranked pipeline corridors for integrity teams. IEEE YP Industry Hackathon 2026 · Case 10.

## Quick start

**1. Frontend** (works on its own with mock data)
```bash
cd frontend
cp .env.example .env.local      # add VITE_GOOGLE_MAPS_API_KEY for the live map
npm install
npm run dev                     # http://localhost:5173
```

**2. Backend** (optional until the risk engine is wired)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000            # API docs: http://localhost:8000/docs
python -m app.smoke                                  # checks every endpoint
```
Then set `VITE_USE_MOCKS=false` in `frontend/.env.local` and restart `npm run dev`.

## Working with Claude Code
Open this folder in VS Code and run `claude` in the terminal (or use the extension).
It reads `CLAUDE.md` automatically, which points it at the roadmap, design spec and API contract.

- `/next-task map` — claim and do the next map task
- `/design-check` — review your changes against the design spec
- `/sync-contract` — make sure frontend types, backend schemas and mocks agree
- Subagents: `ui-builder`, `map-specialist`, `api-integrator`, `design-reviewer`

Parallel sessions: one git worktree per task.
```bash
git worktree add ../cw-map -b map-clustering
cd ../cw-map && claude
```

## Google Maps key
Google Cloud Console → APIs & Services → enable **Maps JavaScript API** → Credentials → create API key →
restrict to **HTTP referrers** `http://localhost:5173/*` (+ your demo domain) and to the Maps JavaScript API.

## Docs
- `docs/DESIGN.md` — tokens, type, spacing, copy rules
- `docs/API_CONTRACT.md` — endpoints and JSON shapes
- `docs/ROADMAP.md` — what's done and what's next
- `docs/DECISIONS.md` — settled choices
- Figma reference: https://www.figma.com/design/kRynP1TI5ktxUvZy6fEyYs
