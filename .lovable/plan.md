
# Make the repo Hostinger-deployable (static SPA)

## Audit findings

- **No server functions in use.** `rg createServerFn` returns 0 hits. Only Supabase server helpers exist (`client.server.ts`, `auth-middleware.ts`, `auth-attacher.ts`) and they are never imported by route/component code.
- **No server routes** under `src/routes/api/`.
- All data access already runs through the browser Supabase client with RLS — safe to ship as a pure SPA.
- Current build pipeline: `vite build` → TanStack Start plugin → SSR bundle for Cloudflare Workers (`.output/`, `wrangler.jsonc`, `src/server.ts`). This is **incompatible** with Hostinger shared hosting (no Node/Workers runtime).
- Existing `.github/workflows/deploy-production.yml` already attempts to copy `dist/` to a `production` branch with SPA `.htaccess` fallback — but `dist/` is not what the current Vite config emits in TanStack Start mode, so the deploy is silently broken.
- Lovable Cloud (Supabase) stays as the backend — `VITE_SUPABASE_*` keys are publishable and safe in client bundles.

## Changes

### 1. Switch to pure SPA build
- Replace `@lovable.dev/vite-tanstack-config` build pipeline with a standard Vite + React SPA config, keeping TanStack Router (file-based routing works in SPA mode too via `@tanstack/router-plugin/vite`).
- Rewrite `vite.config.ts`:
  - `@vitejs/plugin-react`
  - `@tanstack/router-plugin/vite` (SPA mode — generates `routeTree.gen.ts`)
  - `@tailwindcss/vite`
  - `vite-tsconfig-paths`
  - `build.outDir: 'dist'`
- Replace `src/router.tsx` SSR-aware setup with a plain `createRouter` + `RouterProvider` SPA entry.
- Add `index.html` at project root with `<div id="root">` and `<script type="module" src="/src/main.tsx">`.
- Create `src/main.tsx` (ReactDOM root + RouterProvider + AuthProvider chain that currently lives in `__root.tsx`).
- Strip SSR-only pieces from `src/routes/__root.tsx`: remove `HeadContent`, `Scripts`, `shellComponent`, `createRootRouteWithContext`'s SSR `head()` → migrate page titles to per-route `useEffect(() => { document.title = ... }, [])` (or react-helmet-async if user prefers later).

### 2. Remove Cloudflare / Workers infrastructure
- Delete: `wrangler.jsonc`, `src/server.ts`, `src/start.ts`, `src/lib/error-page.ts`, `src/lib/error-capture.ts`.
- Remove deps: `@cloudflare/vite-plugin`, `@tanstack/react-start`, `@tanstack/router-plugin` stays (needed for routing), `nitro`, `@lovable.dev/vite-tanstack-config`.
- Add deps: `@tanstack/router-plugin`, `@tanstack/react-router` already present.
- Keep `@lovable.dev/cloud-auth-js` only if user uses Google OAuth broker; otherwise drop. (Will verify in build step.)
- Delete unused server-only Supabase helpers: `src/integrations/supabase/client.server.ts`, `auth-middleware.ts`, `auth-attacher.ts` (none are imported).

### 3. Environment & config
- Add `.env.example` listing the three required client vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`.
- Add `README.md` section: clone → `npm install` → copy `.env.example` to `.env` → `npm run build` → upload `dist/` to Hostinger `public_html/`.
- Ensure `tsconfig.json` and `tsconfig.node.json` are valid for SPA mode (`moduleResolution: "bundler"`).

### 4. GitHub Actions cleanup
- Keep `.github/workflows/deploy-production.yml`. It already:
  - Installs with `bun install --frozen-lockfile`
  - Runs `bun run build`
  - Detects `dist/`
  - Writes Hostinger-compatible `.htaccess` (SPA fallback)
  - Pushes to `production` branch
- Verify it still works after the SPA switch (it will, since `dist/` is now the actual output).
- Delete the second workflow `.github/workflows/deploy.yml` (GitHub Pages deploy uses `npm ci` against a `bun.lock` repo — currently broken and conflicts).

### 5. Validation
- Run `rm -rf node_modules dist .output && npm install && npm run build`.
- Confirm `dist/index.html`, `dist/assets/*.js`, `dist/assets/*.css` exist.
- Spot-check `dist/index.html` references hashed assets with absolute `/assets/...` paths (Hostinger root deploy compatible).
- Run `npm run preview` and verify `/`, `/app`, `/login`, `/verify/instrument/:token` all load and refresh-without-404.

## Out of scope
- No feature changes, no UI changes, no database changes.
- No migration off Lovable Cloud / Supabase.
- No Lovable badge or branding removal beyond what's needed for build.
- No CI deploy directly to Hostinger via FTP — the existing `production` branch + Hostinger Git deployment flow stays.

## Risk
- After this, the project no longer runs in Lovable's preview the same way (Lovable's editor expects TanStack Start). The app continues to function in dev (`npm run dev` → Vite SPA), and Lovable Cloud (Supabase) still works because client keys are publishable. If you need Lovable preview to keep working too, say so before I implement — that would require a hybrid setup.
