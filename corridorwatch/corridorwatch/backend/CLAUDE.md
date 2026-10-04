# Backend (FastAPI)

Follow the root CLAUDE.md and docs/API_CONTRACT.md. This file adds backend specifics.

## Layout
```
app/main.py                 Routes (thin: validate params, call services, return schemas)
app/schemas.py              Pydantic models = API contract
app/services/ranking.py     Score formula + ranking + corridor detail (single source of the formula)
app/adapters/risk_engine.py THE ONLY bridge to the teammate's risk scripts
app/data/mock.py            Placeholder data used when RISK_ENGINE_PATH is empty
app/smoke.py                `python -m app.smoke` hits every endpoint
```

## Plugging in the teammate's risk scripts
Their repo stays as-is (their Next.js map is untouched). We only import their Python.
1. Put their repo next to this one, or add it as a submodule: `git submodule add <their-repo-url> vendor/risk-engine`.
2. In `backend/.env` set `RISK_ENGINE_PATH=../vendor/risk-engine` (or wherever their Python package lives).
3. Done: `adapters/risk_engine.py` imports their `map_likelihood`, `likelihood` and `consequence` modules from `vendor/risk-engine` (submodule of github.com/wmakino/pipeline-incident-risk). **Never edit or write inside `vendor/risk-engine`**: import only (bytecode writes are disabled for that import). If their code blocks something, raise it with the team instead of patching it.
4. Copy any keys their scripts need into `backend/.env` (names in `.env.example`). Never into the frontend.
5. `python -m app.smoke` → should print `Data source: live`.
6. Frontend: set `VITE_USE_MOCKS=false` in `frontend/.env.local`.

If their scripts are slow, cache results in the adapter (`functools.lru_cache` or write a JSON snapshot on startup).

## Rules
- Routes stay thin. Logic goes in `services/`, data access in `adapters/`.
- Never print or log secrets. Never read `.env` in Claude Code sessions; use `.env.example`.
- Contract changes: update `docs/API_CONTRACT.md`, `schemas.py`, `frontend/src/api/types.ts` and both mocks together.

## Commands
```
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000           # docs at http://localhost:8000/docs
python -m app.smoke
```
