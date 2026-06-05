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

### Hostinger (shared hosting)

1. Run `npm run build` locally (or use the GitHub Actions workflow below).
2. Upload **everything inside `dist/`** to your domain's `public_html/` folder via File Manager or FTP.
3. Make sure `.htaccess` is present at the root of `public_html/` so SPA routes work on refresh:

   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

   The included GitHub Actions workflow writes this file automatically when it publishes to the `production` branch.

### Automated deploy via GitHub → Hostinger

`.github/workflows/deploy-production.yml` builds the app on every push to `main` and pushes the static `dist/` (plus the `.htaccess` SPA fallback) to the `production` branch.

In Hostinger:
1. **hPanel → Git** → connect this repository.
2. Set the branch to `production`.
3. Set the install path to `public_html` (or your subdomain folder).
4. Enable **Auto Deployment**.

In GitHub repository settings → **Secrets and variables → Actions**, add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### Vercel / Netlify / Cloudflare Pages

These hosts auto-detect Vite. Just:

1. Connect the repo.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add the three `VITE_SUPABASE_*` environment variables.
5. Add an SPA rewrite rule (`/* → /index.html` 200). Both Vercel and Netlify do this automatically for Vite projects; on Cloudflare Pages add a `_redirects` file in `public/` with `/* /index.html 200`.

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
