## Current findings

- **Current status from my side:** the preview host is responding right now, `/` loads, and `/app` redirects to `/login` instead of crashing.
- **Hosted backend status:** healthy.
- **Latest available preview-server log in the sandbox:**

```text
[stderr] $ vite --port "8080"
[stdout]
[stdout]   VITE v7.3.5  ready in 1558 ms
[stdout]
[stdout]   ➜  Local:   http://localhost:8080/
[stdout]   ➜  Network: http://10.32.78.54:8080/
```

- **Current preview network evidence:** the document, `src/main.tsx`, router files, and route modules are returning `200` from the preview host.
- **Environment-variable evidence:** the public backend env values exist in `.env`, and `.gitignore` is **not** excluding `.env`.
- **Most likely root cause:** **frontend dependency/codegen drift**, not a backend outage and not currently a missing-env failure.

## Best diagnosis so far

The strongest structural issue is a **TanStack Router version mismatch / drift** in the preview toolchain:

- `package.json`
  - `@tanstack/react-router`: `^1.168.25`
  - `@tanstack/router-plugin`: `^1.167.28`
- `bun.lock` currently resolves different versions again:
  - `@tanstack/react-router@1.170.12`
  - `@tanstack/router-plugin@1.168.15`
  - plugin internals also reference older generator pieces

That kind of mismatch can cause intermittent **route codegen / HMR / dynamic-module loading failures after edits**, which matches your symptom pattern much better than an infrastructure problem.

## What I will do

1. **Normalize the router build toolchain**
   - Pin `@tanstack/react-router` and `@tanstack/router-plugin` to the same compatible release family.
   - Regenerate/refresh route artifacts so runtime and generated files agree.

2. **Remove dependency graph drift**
   - Make one lockfile the source of truth for this project.
   - Eliminate stale dependency resolution that can cause preview builds to behave differently across rebuilds.

3. **Execute a clean rebuild**
   - Clear generated preview/build caches and stale install artifacts.
   - Reinstall dependencies cleanly.
   - Restart the preview from a clean state.

4. **Re-validate the exact failure surfaces**
   - Check `/` and `/app` after rebuild.
   - Confirm there are no router/module/chunk errors in preview logs.
   - Verify the preview remains accessible after an edit-triggered reload.

5. **Keep the reliability guards already added**
   - Preserve the app-side recovery screens and resilient auth bootstrap changes already made.
   - Only change what is necessary for the recurring preview-build issue.

## What this likely means

- **Code compilation:** no active compile error is visible in the current available log.
- **Missing environment variables:** **not the leading cause** from current evidence.
- **Dependency issues:** **most likely yes**.
- **Cache corruption / stale generated artifacts:** **very plausible secondary factor**.
- **Lovable-side infrastructure problem:** **not supported by the current evidence** because the preview host and backend are both responding from my side.

## Validation I will provide after implementation

- The exact clean-rebuild result.
- The post-fix preview status.
- The concrete corrective change made.
- Whether the issue was fully reproducible as dependency/codegen drift, cache staleness, or something else discovered during the rebuild.

## Technical details

- Files likely involved:
  - `package.json`
  - `bun.lock` / `package-lock.json`
  - `vite.config.ts`
  - `src/routeTree.gen.ts`
  - router/bootstrap files already hardened earlier
- Success criteria:
  - preview opens reliably
  - no generic “Preview has not been built yet” state after routine edits
  - router-generated code and installed versions stay aligned