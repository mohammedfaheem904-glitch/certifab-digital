## Root cause

`dwm.weldyard.com` is your **published** (production) build. The fix we made earlier — switching `handleGoogle` in `src/routes/login.tsx` from raw `supabase.auth.signInWithOAuth("google", …)` to the Lovable-managed broker `lovable.auth.signInWithOAuth("google", …)` — only updated the **preview** bundle. The production bundle behind `dwm.weldyard.com` is still the old code that calls Supabase Auth directly with no Google client secret, which is exactly the 400 `"Unsupported provider: missing OAuth secret"` you're seeing.

Managed Google provider is already enabled on the backend (a single `configure_social_auth` call enables it for both Dev and Production). Backend status is healthy. The only remaining step is to ship the new frontend code to production.

## Plan

1. **Republish the app.** Click Publish → Update. This deploys the current preview (which has the `lovable.auth.signInWithOAuth("google", …)` code) to `certifab-digital.lovable.app` and to your custom domain `dwm.weldyard.com`.
2. **Hard-refresh `dwm.weldyard.com`** (Cmd/Ctrl + Shift + R) so the browser drops the cached old `login` chunk.
3. **Verify** by clicking "Continue with Google" on `https://dwm.weldyard.com/login`. You should be sent to Google's account chooser and bounced back signed in — no more 400.

No code, schema, or auth-config changes are needed in this step. If after republish + hard refresh the error still appears, capture the failing request URL from DevTools → Network and share it; that tells us whether the new bundle actually loaded.

<presentation-actions>
<presentation-open-publish>Publish your app</presentation-open-publish>
</presentation-actions>
