# Rumah Amal Salman Garut — Prototype

A lightweight admin/member dashboard prototype for Rumah Amal Salman (Garut) built with React, TypeScript and Vite. This README explains how to run locally, build for production, and deploy (e.g., to Vercel).

**Status:** Prototype — demo / local testing

**Tech stack:** React + TypeScript, Vite, Recharts, Lucide icons

**Quick Links**
- Local dev server: `npm run dev`
- Production build: `npm run build` → `dist/`

**Prerequisites**
- Node.js 18+ (LTS recommended)
- npm (comes with Node)

**Getting started (local)**

1. Install dependencies

```powershell
npm install
```

2. Run the dev server

```powershell
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173` or next available port).

3. Build for production

```powershell
npm run build
```

4. Preview the production build locally

```powershell
npm run preview
```

**Vercel / Production notes**
- Build command: `npm run build`
- Output directory: `dist`
- Commit `package-lock.json` so Vercel installs the same resolved versions you tested locally.
- Make sure `react` and `react-dom` are the same major version (this repo targets React 18). If Vercel shows peer dependency warnings like `ERESOLVE overriding peer dependency`, align `react` and `react-dom` (for example: `npm install react@^18 react-dom@^18`).

**Common runtime / deployment troubleshooting**
- Blank screen after deploy: check browser DevTools Console for runtime errors. Common root causes in this project:
  - An `importmap` in `index.html` pointing to a CDN React version different from the local one. Remove CDN importmaps to let Vite bundle React from `node_modules`.
  - Missing `/index.css` (project expects `index.css`). Ensure it's present and imported in `index.tsx`.
  - TypeScript build error (e.g., unused imports) — fix locally and rebuild.

**What’s included in this prototype**
- Simulated login + demo accounts
- Event management UI and charts (uses `recharts`)
- Members page with role-based UI differences
- `DataContext` providing mock data and localStorage session simulation

**Recommended next steps to make production-ready**
- Replace mock data with a backend (API or managed DB)
- Add real authentication (OAuth / JWT)
- Add unit/integration tests and CI checks
- Add type-safe API layer (optional: tRPC or OpenAPI client)

**Git / push tips**
- If the remote contains commits you don't have locally, integrate first:

```powershell
git fetch origin
git pull --rebase origin main
# resolve conflicts if any
git push -u origin main
```

Or, if you intentionally want to overwrite remote (destructive):

```powershell
git push -u origin main --force
```

**Environment & secrets**
- If you enable real features (e.g., `@google/genai`) store keys in environment variables and configure them in Vercel instead of committing them.

**Contributing**
- Tidy up `tsconfig.json` and add linting and tests.
- Extract components and pages into smaller modules for reuse.

**License**
- No license included. Add a `LICENSE` file if you plan to open-source.