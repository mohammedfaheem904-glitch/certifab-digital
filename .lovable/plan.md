## Fix: "Unsupported provider: missing OAuth secret" on Google sign-in

### Root cause
`src/routes/login.tsx` calls `supabase.auth.signInWithOAuth({ provider: "google" })` directly. The Cloud Dev auth environment (used by the preview) has no Google OAuth client secret configured for that raw Supabase flow, so the `/authorize` endpoint returns 400. Auth logs confirm: repeated `"missing OAuth secret"` on `/authorize` from the preview host.

The correct path on Lovable Cloud is the **managed Google OAuth** flow via `lovable.auth.signInWithOAuth("google", ...)`. The `src/integrations/lovable/index.ts` broker is already present in the project, but the login page isn't using it.

### Plan

1. **Enable managed Google provider** via `configure_social_auth` (`providers: ["google"]`). This wires up the Cloud-managed Google OAuth client for both Dev and Production environments — no client ID/secret needed from the user.

2. **Switch the login page to the managed broker.** In `src/routes/login.tsx` `handleGoogle`:
   - Replace `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo, queryParams } })` with `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + dest, extraParams: { prompt: "select_account" } })`.
   - Handle the result shape: if `result.error` → toast + unset busy; if `result.redirected` → return (browser is navigating to Google); otherwise tokens are already set on the Supabase session, so `window.location.assign(dest)`.
   - Add `import { lovable } from "@/integrations/lovable";`.

3. **Verify** by clicking "Continue with Google" on the preview — flow should redirect to Google's account picker instead of returning the 400.

### Notes
- No DB or schema changes.
- No secrets to request from the user — managed OAuth handles credentials.
- If you later want to use your own Google Cloud OAuth client (for branding), that's configured in Cloud → Users → Auth Settings → Google; no code change needed.
