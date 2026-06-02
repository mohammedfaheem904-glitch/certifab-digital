# Fix: View (eye) icon on Welds list doesn't open the record

## Root cause

`src/routes/app.welds.tsx` is registered as the route for `/app/welds` and also acts as the parent for child routes like `app.welds.$weldId.tsx` and `app.welds.dashboard.tsx`. It renders the welds list directly and never renders an `<Outlet />`.

Result: when the eye icon calls `nav({ to: "/app/welds/$weldId", params: { weldId: r.id } })`, the URL changes and the detail route matches, but the parent (the list) keeps rendering and the detail page never appears. The user perceives the button as broken. This is the same pattern we already fixed for `app.admin`.

## Fix

Convert `app.welds.tsx` into a proper index route, identical to how `app.admin.index.tsx` was structured:

1. Rename `src/routes/app.welds.tsx` → `src/routes/app.welds.index.tsx`.
2. In the renamed file, change
   `createFileRoute("/app/welds")` → `createFileRoute("/app/welds/")`
   so it registers as the index of the `/app/welds` segment instead of a layout that swallows children.
3. Regenerate / update `src/routeTree.gen.ts` to reflect the new index route id and remove the old `/app/welds` layout entry, so `/app/welds/$weldId`, `/app/welds/dashboard`, and `/app/welds/trash` resolve to their own files.

No other files need to change — the eye button's `nav(...)` call, the detail route, and all existing links keep working.

## Validation

- From `/app/welds`, click the eye (or external-link) icon on a row → the weld detail page renders.
- `/app/welds/dashboard` and `/app/welds/trash` still load correctly.
- Direct navigation to `/app/welds` still shows the list.
