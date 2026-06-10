## Goal
Prevent the recurring "Preview has not been built yet" state by removing the frontend startup paths that can take the whole preview down after edits/rebuilds.

## What I found
- The project preview is loading right now on my side, so the issue is not a permanent outage.
- The hosted backend is healthy.
- The current app boot path is fragile:
  - `src/integrations/supabase/client.ts` can throw during startup if env/config resolution fails.
  - `src/lib/auth.tsx` initializes auth immediately at app boot, so a client/init failure can blank the whole preview.
  - There is no dedicated app-level fallback for configuration/bootstrap failures, so the preview can appear "not built" instead of showing a useful error state.
- I did **not** find evidence that `.env` is being ignored in this repo, so I will not use that as the assumed root cause here.

## Implementation plan
1. **Harden backend client initialization**
   - Refactor the browser client bootstrap so it never crashes the entire app during preview startup.
   - Remove unsafe browser-side env access patterns and replace them with a single safe config reader.
   - Make the client report a structured configuration error instead of throwing at import/use time.

2. **Make auth startup resilient**
   - Update the auth provider to handle client/session initialization failures gracefully.
   - Prevent boot-time exceptions from propagating into a full preview failure.
   - Preserve normal sign-in behavior when configuration is valid.

3. **Add a stable recovery UI for bootstrap failures**
   - Show a clear in-app error screen when configuration/bootstrap fails, instead of letting the preview die.
   - Keep this scoped to startup/runtime reliability only.

4. **Add lightweight diagnostics for future recurrence**
   - Add targeted console/error logging around client creation and auth boot.
   - This makes future failures visible in preview tools instead of surfacing only as the generic preview message.

5. **Validate against the recurrence pattern**
   - Verify the app still opens after repeated frontend changes/reloads.
   - Confirm the landing page and auth flow still render.
   - Confirm that, if configuration is ever missing again, the app shows a controlled error state rather than collapsing the preview.

## Technical details
- Files likely involved:
  - `src/integrations/supabase/client.ts`
  - `src/lib/auth.tsx`
  - `src/routes/__root.tsx` or a small new bootstrap/config error component
- Scope intentionally excluded:
  - No database schema changes
  - No auth-provider reconfiguration unless a separate issue is found
  - No unrelated UI/content edits

## Expected result
After this fix, small edits should no longer be able to knock the whole preview into an unrecoverable "not built yet" state. If startup configuration ever breaks again, the app should stay accessible and show a controlled error instead of failing invisibly.