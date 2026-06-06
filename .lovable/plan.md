## SPA Routing Fix for Hostinger Deployment

Add canonical SPA fallback configuration files to `public/` so they are copied into `dist/` by Vite on every build, then verify the GitHub Actions workflow ships them to the `production` branch consumed by Hostinger.

### Files to add

1. **`public/.htaccess`** — canonical Apache rewrite for Hostinger. Routes all non-file/non-directory requests to `/index.html`. Adds long-cache headers for `/assets/*` (hashed) and `no-cache` for `index.html` so deploys take effect immediately.

   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>

   <IfModule mod_headers.c>
     <FilesMatch "\.(js|css|woff2?|ttf|otf|png|jpg|jpeg|svg|webp|ico)$">
       Header set Cache-Control "public, max-age=31536000, immutable"
     </FilesMatch>
     <FilesMatch "^index\.html$">
       Header set Cache-Control "no-cache, no-store, must-revalidate"
     </FilesMatch>
   </IfModule>
   ```

2. **`public/404.html`** — static fallback that immediately redirects to `/` preserving the original path in the hash, for hosts that don't honor `.htaccess`. Lightweight HTML with `<script>location.replace('/' + location.pathname.slice(1))</script>` plus a manual link.

3. **`public/_redirects`** — Netlify/Cloudflare Pages portability:
   ```
   /*    /index.html   200
   ```

4. **`vercel.json`** — Vercel portability:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```

### Workflow update

Update `.github/workflows/deploy-production.yml`: remove the inline `.htaccess` generation step (now redundant since `public/.htaccess` is copied automatically into `dist/`). Keep the `peaceiris/actions-gh-pages` publish step. This ensures the committed `public/.htaccess` is the single source of truth.

### README update

Replace the existing Hostinger section with a clear flow describing:
- Auto-deploy via GitHub → `production` branch → Hostinger Git auto-deploy
- That `.htaccess`, `_redirects`, `404.html` are committed under `public/` and shipped on every build
- Note about Hostinger File Manager hiding dotfiles (toggle "Show hidden files")

### Verification

After implementation:
1. Run `npm run build` and confirm `dist/.htaccess`, `dist/404.html`, `dist/_redirects` are present.
2. Confirm `vercel.json` sits at repo root.
3. Once pushed, the GitHub Action runs and publishes the `production` branch including `.htaccess`. Hostinger pulls the branch and the SPA fallback takes effect.
4. Direct access to `/app`, `/login`, `/signup`, `/verify/instrument/<token>`, etc., returns `200` with the SPA shell, which then matches the route via TanStack Router.

### Notes

- No application code changes required — auth guards, route definitions, and `basename` are already correct.
- No commit/push commands are run by the agent; the GitHub integration auto-syncs.
