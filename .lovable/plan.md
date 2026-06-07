## Goal

Make "Continue with Google" work on `https://dwm.weldyard.com` (Hostinger-hosted SPA) by replacing the Lovable broker with native Supabase OAuth. The Lovable broker requires `/~oauth/*` paths served by Lovable infrastructure, which does not exist on Hostinger — that's why the callback 404s.

## Code changes

### 1. `src/routes/login.tsx`
- Remove `import { lovable } from "@/integrations/lovable";`.
- Rewrite `handleGoogle` to use the Supabase client directly:
  ```ts
  const handleGoogle = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + dest,
        queryParams: { access_type: "offline", prompt: "select_account" },
      },
    });
    if (error) {
      toast.error(error.message);
      setBusy(false);
    }
    // On success, browser redirects to Google; no further client work needed.
  };
  ```
- No other changes needed — Supabase auto-detects the auth tokens in the URL hash on return, the existing `onAuthStateChange` listener in `src/lib/auth.tsx` picks up the session, and the `useEffect` redirect to `dest` fires.

### 2. No changes to
- `src/routes/__root.tsx`, `src/routes/app.tsx`, `src/lib/auth.tsx` — auth gate already reads from `supabase.auth.getSession()` / `onAuthStateChange`, which works identically for native OAuth.
- `src/routes/signup.tsx`, `src/routes/accept-invite.tsx` — neither uses the broker (verified by grep).
- `src/integrations/lovable/` — left in place but unused (safe to delete later; not in this change to minimize diff).
- SPA fallback files (`.htaccess`, `_redirects`, `404.html`) — already correct; will rewrite Supabase's hash-based return URL to `index.html`, the SPA mounts, Supabase parses the hash, session is set.

### 3. Commit
The repo auto-syncs to GitHub via the Lovable integration; no manual git command is run.

## What you (the user) must configure after the push

### A. Supabase dashboard
1. **Authentication → Providers → Google**: toggle **Enabled** ON.
2. Paste your **Google Client ID** and **Client Secret** (from step B below).
3. Copy the **Callback URL** shown by Supabase. It is:
   ```
   https://tmmlnvisgignekhqwfqn.supabase.co/auth/v1/callback
   ```
   You will paste this into Google Cloud in step B.
4. **Authentication → URL Configuration**:
   - **Site URL**: `https://dwm.weldyard.com`
   - **Additional Redirect URLs** (add all of these, one per line):
     ```
     https://dwm.weldyard.com/**
     https://dwm.weldyard.com/app
     http://localhost:8080/**
     ```
   The `/**` wildcard lets Supabase return users to `/app`, `/accept-invite`, or any deep link they tried to access before signing in.

### B. Google Cloud Console
1. Go to **APIs & Services → Credentials** in your Google Cloud project (create one if you don't have it).
2. Click **Create Credentials → OAuth client ID → Web application**.
3. **Authorized JavaScript origins**:
   ```
   https://dwm.weldyard.com
   https://tmmlnvisgignekhqwfqn.supabase.co
   http://localhost:8080
   ```
4. **Authorized redirect URIs** — this is the **only callback URL Google needs**:
   ```
   https://tmmlnvisgignekhqwfqn.supabase.co/auth/v1/callback
   ```
   (Do NOT add `dwm.weldyard.com/...` here — Google redirects to Supabase, Supabase redirects to your domain.)
5. Under **OAuth consent screen**: publish the app (or add your email as a test user) and ensure the `openid`, `email`, `profile` scopes are listed.
6. Copy the generated **Client ID** and **Client Secret** into Supabase (step A.2).

### C. Environment variables
**None.** The Supabase URL and publishable key already in `.env` (and in GitHub Actions secrets) are all that's needed. No new secrets.

## How the new flow works (end to end)

1. User clicks **Continue with Google** on `https://dwm.weldyard.com/login`.
2. `supabase.auth.signInWithOAuth` redirects the browser to:
   `https://tmmlnvisgignekhqwfqn.supabase.co/auth/v1/authorize?provider=google&redirect_to=https://dwm.weldyard.com/app`
3. Supabase redirects to Google's consent screen.
4. Google redirects back to `https://tmmlnvisgignekhqwfqn.supabase.co/auth/v1/callback?code=...`.
5. Supabase exchanges the code, then 302s the browser to `https://dwm.weldyard.com/app#access_token=...&refresh_token=...`.
6. Hostinger's `.htaccess` serves `index.html` for `/app`, the SPA boots, `supabase-js` reads the URL hash, stores the session in `localStorage`, fires `onAuthStateChange("SIGNED_IN")`, and the existing auth gate lets the user into `/app`.

No `/~oauth/*` paths involved — fully compatible with any static host.

## Verification checklist (after you configure Google + Supabase)

- [ ] Visit `https://dwm.weldyard.com/login`, click **Continue with Google**, complete Google consent, land on `/app` signed in.
- [ ] Hard-refresh `https://dwm.weldyard.com/app` — stays signed in (session persisted in `localStorage`).
- [ ] Sign out, then visit `https://dwm.weldyard.com/app` — redirected to `/login`.
- [ ] Invite acceptance link still works: `https://dwm.weldyard.com/accept-invite?token=...` after Google sign-in.

## Out of scope

- Deleting `src/integrations/lovable/` and the `@lovable.dev/cloud-auth-js` dependency (left in place; not referenced after this change). Can be cleaned up in a separate pass if you want.
- Apple / Microsoft sign-in (not currently used in the UI).
