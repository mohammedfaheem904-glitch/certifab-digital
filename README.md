# Weld Yard — Digital Welding Management System

Cloud-based welding QA/QC management platform. This is a **pure single-page React application** (Vite + TanStack Router + Supabase) that can be deployed to any static host: Hostinger, Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3 + CloudFront, etc.

There is **no server runtime requirement** — all backend logic lives in Supabase (Lovable Cloud), accessed directly from the browser through Row-Level Security policies.

---

## Tech stack

- React 19 + TypeScript
- Vite 7 (bundler)
- TanStack Router (file-based routing)
- TanStack Query (server state)
- Tailwind CSS v4
- shadcn/ui + Radix primitives
- Supabase JS client (auth, database, storage)

---

## Local development

```bash
# 1. Install dependencies
npm install            # or: bun install / pnpm install / yarn

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase project credentials

# 3. Run the dev server
npm run dev
# → http://localhost:8080
```

## Production build

```bash
npm run build
```

Output goes to `./dist/`. It contains:
- `index.html`
- `assets/*.js` (hashed)
- `assets/*.css` (hashed)
- Static images and fonts

Verify locally:

```bash
npm run preview
```

---

## Deployment

### SPA fallback (critical for direct route access)

This is a single-page app. Without a host-level fallback, URLs like `/app`, `/login`, or `/verify/instrument/<token>` return 404 when opened directly or refreshed. The following files are committed under `public/` and are copied into `dist/` on every build:

| File | Host | Purpose |
| --- | --- | --- |
| `public/.htaccess` | Apache / Hostinger / LiteSpeed | Rewrites all non-asset URLs to `/index.html` + cache headers |
| `public/_redirects` | Netlify / Cloudflare Pages | `/* /index.html 200` SPA rewrite |
| `public/404.html` | Generic static hosts | JS fallback that redirects to `/` preserving the path |
| `vercel.json` (repo root) | Vercel | SPA rewrite rule |

Do not delete these. The CI workflow fails if `.htaccess`, `_redirects`, or `404.html` are missing from the build output.

### Hostinger (GitHub auto-deploy)

`.github/workflows/deploy-production.yml` builds on every push to `main` and publishes `dist/` (including `.htaccess`) to the `production` branch.

In Hostinger:
1. **hPanel → Git** → connect this repository.
2. Branch: `production`. Install path: `public_html` (or your subdomain folder).
3. Enable **Auto Deployment**.

In GitHub → **Settings → Secrets and variables → Actions**, add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

If you ever inspect `public_html/` via Hostinger File Manager, enable **Show hidden files** to see `.htaccess`. If it is missing, the `production` branch is stale — re-run the Action.

### Vercel / Netlify / Cloudflare Pages

1. Connect the repo.
2. Build: `npm run build` • Output: `dist`
3. Add the three `VITE_SUPABASE_*` env vars.
4. SPA rewrites are already configured via `vercel.json` / `public/_redirects`.



---

## Environment variables

All three are **client-side, publishable values** (the Supabase anon key is meant to be public; security comes from Row-Level Security policies on the database).

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon / publishable key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project reference id |

There are **no server-side secrets** in this repo. Service-role keys are not used by the application code.

---

## Database

The Supabase schema is checked in under `supabase/migrations/`. To bootstrap a new Supabase project:

1. Create a new project in Supabase.
2. Install the [Supabase CLI](https://supabase.com/docs/guides/cli).
3. `supabase link --project-ref YOUR_REF`
4. `supabase db push`

Update `.env` with the new project's URL / publishable key and rebuild.

---

## Project structure

```
src/
  routes/             # File-based routes (TanStack Router)
  components/         # Shared React components + shadcn/ui
  lib/                # Hooks, helpers, business logic
  integrations/
    supabase/         # Supabase client + generated types
    lovable/          # Google OAuth broker (optional)
  styles.css          # Tailwind v4 entry + design tokens
  main.tsx            # SPA bootstrap
  router.tsx          # TanStack Router setup
index.html            # Static HTML shell
vite.config.ts        # Build configuration
```

---

## License

Proprietary. © Weld Yard.
