# Frontend (React + Vite + TS)

Follow the root CLAUDE.md and docs/DESIGN.md. This file adds frontend specifics.

## Folder map
```
src/
  main.tsx, App.tsx          Router: "/" Home, "/about" About
  styles/tokens.css          ALL colours/spacing/radius. Dark + light themes.
  styles/global.css          Resets, base typography, shared utility classes
  api/types.ts               Contract types (mirror docs/API_CONTRACT.md)
  api/client.ts              fetch wrappers + React hooks (useRanking, useCorridor, ...)
  api/mocks.ts               Mock data used when VITE_USE_MOCKS=true
  hooks/                     useTheme, useScrollTo
  components/                Reusable building blocks (see components/README.md)
  sections/                  Home page sections (Hero, PriorityList, Compare, ...)
  features/drawer/           Corridor drawer + info panel
  features/map/              Google Map, styles, overlays (map-specialist owns this)
  pages/                     HomePage, AboutPage
```

## Conventions
- Function components, named exports, one component per file.
- CSS: one `.css` file next to the component, class names prefixed by component (`.drawer__header`).
- State in URL when shareable (`?corridor=id`, `?weight=3`).
- Format numbers with `toLocaleString()`.
- Enum labels via `src/api/labels.ts`, never inline strings.

## Commands
`npm run dev` · `npm run typecheck` · `npm run build`
