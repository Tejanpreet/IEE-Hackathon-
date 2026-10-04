# CorridorWatch

Risk-ranked pipeline corridors for integrity teams. Ranks Alberta pipeline corridors by
**likelihood × consequence** so crews inspect the riskiest stretches first, not just the noisiest.
Built for the IEEE YP Industry Hackathon 2026 (Case 10).

## Read these first (every session)
- @docs/ROADMAP.md: what's done, what's claimed, what's next. **Claim a task before you start.**
- @docs/DECISIONS.md: settled choices. Don't re-debate them.
- @docs/DESIGN.md: tokens, type, spacing, components, copy rules.
- @docs/API_CONTRACT.md: the only interface between frontend and backend.

## Layout
```
frontend/   React 18 + Vite + TypeScript. See frontend/CLAUDE.md
backend/    FastAPI. Wraps the team's Python risk scripts. See backend/CLAUDE.md
docs/       Specs. Source of truth for design + API.
.claude/    Subagents, slash commands, settings, hooks.
```

## Commands
| Task | Command |
|---|---|
| Frontend dev | `cd frontend && npm run dev` (http://localhost:5173) |
| Frontend checks | `cd frontend && npm run typecheck && npm run build` |
| Backend dev | `cd backend && uvicorn app.main:app --reload --port 8000` |
| Backend smoke test | `cd backend && python -m app.smoke` |

## Working rules
1. **Start ritual:** read ROADMAP → pick one unchecked task → change it to `[~] (agent/branch)` → work → mark `[x]`.
2. **Reuse before you build.** Check `frontend/src/components/README.md` before creating a component. Update it when you add one.
3. **Contract first.** Any API change → edit `docs/API_CONTRACT.md` + `frontend/src/api/types.ts` + `backend/app/schemas.py` in the same change.
4. **Tokens only.** No raw hex in components. Use CSS variables from `frontend/src/styles/tokens.css`.
5. **Secrets never reach the frontend.** Backend keys live in `backend/.env`. The only frontend key is the restricted Google Maps browser key.
6. **Never read or print `.env` files.** Use `.env.example` to learn variable names.
7. **Small, finished slices.** A task is done when typecheck + build pass and the UI works in both themes.
8. **Log decisions.** If you make a non-obvious choice, append it to `docs/DECISIONS.md`.

## Parallel agents
- One task = one branch = one git worktree (`git worktree add ../cw-<task> -b <task>`).
- Respect file ownership in ROADMAP (e.g. map work only touches `frontend/src/features/map/`).
- Shared files (`tokens.css`, `api/types.ts`, `API_CONTRACT.md`) change only in their own small PR.

## Disclaimer to keep in the UI
CorridorWatch ranks historical incident hotspots. It doesn't certify any pipe as safe and isn't a repair design.
