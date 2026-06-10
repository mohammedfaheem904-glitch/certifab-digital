## Permanent fix plan

### What I found
- The preview is **not currently down globally**: the marketing page renders, `/app` redirects to `/login`, and the hosted backend is healthy.
- The recurring failure is most likely a **frontend boot/routing problem that happens after edits**, not a database outage.
- The main structural risk is in `src/routes/app.tsx`: the protected `/app` route runs `supabase.auth.getSession()` inside TanStack Router `beforeLoad`.
- When preview restarts or hot reload is in a fragile state, that route-level auth call can **throw or stall before the app renders**, which can make the whole preview appear as “Preview has not been built yet,” especially if the preview reopens on `/app` or another protected page.
- The current backend client hardening helped, but it did **not remove the most brittle boot path**: route-level auth/network work before the app is fully mounted.

### Root cause
The recurring issue is most likely caused by a combination of:
1. **Protected-route auth work in `beforeLoad`** (`src/routes/app.tsx`) that can fail during preview rebuild/HMR cycles.
2. **Duplicate startup auth reads** in both the router guard and `AuthProvider`, which increases timing/race fragility after edits.
3. **No dedicated recovery for route/chunk reload failures** after edits, so preview can collapse into the generic unavailable state instead of recovering cleanly.

## Implementation

### 1) Remove network/auth dependency from route boot
- Refactor `src/routes/app.tsx` so `beforeLoad` does **not** call the backend client.
- Make `/app` rendering depend on mounted auth state from `AuthProvider` instead of a route-level async auth fetch.
- Keep protected-page behavior the same: unauthenticated users still end up at `/login`, but only **after the app is mounted safely**.

### 2) Centralize auth bootstrap in one place
- Keep startup session loading inside `src/lib/auth.tsx` only.
- Expose a stable auth readiness state so protected routes can distinguish:
  - booting
  - unauthenticated
  - authenticated
  - bootstrap error / degraded mode
- Make redirects happen from mounted React code, not from router boot code.

### 3) Add a resilient protected-route shell
- Add a small guarded layout/component for `/app` routes that:
  - shows a loading shell while auth initializes
  - redirects to `/login` when auth is known to be absent
  - renders children only when auth is ready
- This prevents preview death during rebuilds when session/client state is temporarily unavailable.

### 4) Add recovery for post-edit preview breakage
- Add app-level handling for route/chunk reload failures so a failed hot update does not leave the preview inaccessible.
- If a route module or lazy chunk fails to load after edits, show a controlled recovery screen with reload action instead of letting preview appear unbuilt.
- Keep this scoped to reliability only.

### 5) Harden root bootstrap further
- Review `src/main.tsx` and root bootstrap so entry mounting never fails harder than necessary.
- Keep config/bootstrap errors visible inside the app UI instead of escaping as blank preview failures.

## Files to change
- `src/routes/app.tsx`
- `src/lib/auth.tsx`
- `src/routes/__root.tsx`
- `src/main.tsx`
- Possibly one small new protected-route/recovery component

## Technical details
- I will specifically remove the `supabase.auth.getSession()` call from route `beforeLoad` in `src/routes/app.tsx`.
- The router will stop doing backend-dependent work during navigation boot.
- `AuthProvider` will become the single source of truth for startup auth state.
- Recovery will target the exact failure mode that happens **mostly after edits**, which matches hot-reload/bootstrap instability rather than a permanent app bug.

## Expected result
After this change:
- edits/rebuilds should no longer be able to take down the preview just because it opens on a protected route
- the app should recover cleanly from auth/bootstrap timing issues
- if a startup failure happens again, users should see a controlled in-app recovery state instead of the generic inaccessible preview message

<presentation-actions>
  <presentation-open-history>View History</presentation-open-history>
</presentation-actions>

<presentation-actions>
<presentation-link url="https://docs.lovable.dev/tips-tricks/troubleshooting">Troubleshooting docs</presentation-link>
</presentation-actions>