## Plan

1. Capture the current preview/build failure from the platform-facing side.
   - Inspect the latest preview/dev-server logs and compare them with the live preview state.
   - Confirm whether the failure is a real compile/build error, a stale preview status, or an intermittent orchestration issue.
   - Deliver the exact failing log lines if a failure is present.

2. Remove structural causes of non-deterministic preview behavior.
   - Revert unsupported manual changes in the auto-generated backend client and move any resilience/fallback handling into app-owned files instead.
   - Re-check the router/tooling versions and generated-route alignment so preview rebuilds stay deterministic after edits.
   - Verify that dependency resolution uses one consistent lockfile/toolchain path.

3. Execute a clean rebuild path and validate stability.
   - Clear generated preview artifacts/cache paths that can preserve stale route or module state.
   - Reinstall dependencies from a single source of truth and restart the preview cleanly.
   - Verify `/` and `/app` load after the clean rebuild and after a follow-up edit-triggered refresh.

4. Implement the permanent corrective action.
   - Keep only the minimum runtime recovery UI needed for chunk/update failures.
   - Ensure preview boot no longer depends on edited generated files or brittle startup behavior.
   - Document the exact root cause and the hardening change so this does not recur.

## What I’ve already confirmed

- The live preview host is currently serving the app from my side.
- The document, main entry, router files, and route modules are returning `200`.
- I do not currently see a browser runtime error matching the platform placeholder state.
- That means the remaining likely causes are preview-pipeline drift, stale generated artifacts, unsupported edits to generated integration code, or platform-side status desync rather than a simple in-app crash.

## Technical details

- Primary files to inspect/fix:
  - `package.json`
  - `vite.config.ts`
  - `src/routeTree.gen.ts`
  - `src/router.tsx`
  - `src/routes/__root.tsx`
  - `src/main.tsx`
  - `src/lib/auth.tsx`
  - `src/integrations/supabase/client.ts` (auto-generated; should not contain custom logic)
- Permanent success criteria:
  - Preview generates reliably after edits
  - No recurring “Preview has not been built yet” state for normal rebuilds
  - Clean rebuild completes without hidden dependency/codegen drift
  - Preview remains accessible after validation reloads