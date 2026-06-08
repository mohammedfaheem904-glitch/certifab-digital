# Fix: NCR detail pages not opening

## Root cause

`src/routes/app.ncrs.tsx` is acting as the **parent** of `app.ncrs.$ncrId.tsx` and `app.ncrs.trash.tsx` (per `routeTree.gen.ts` lines 189–193). Because dot-segments create parent/child relationships in TanStack file routing, the parent must render `<Outlet />` for children to mount.

Currently `app.ncrs.tsx` renders the full list page (`NcrsPage`) with no `<Outlet />`. Result: navigating to `/app/ncrs/<id>` matches the child route, but the parent keeps showing the list and the detail never renders.

Other modules in this project already follow the correct split (e.g. `app.welds.tsx` layout + `app.welds.index.tsx` leaf, same for pqrs/procedures/projects/pwps/qualifications).

## Fix

1. **Rename** `src/routes/app.ncrs.tsx` → `src/routes/app.ncrs.index.tsx` and update its `createFileRoute("/app/ncrs")` to `createFileRoute("/app/ncrs/")` (the index leaf).
2. **Create** a new minimal `src/routes/app.ncrs.tsx` layout:
   ```tsx
   import { createFileRoute, Outlet } from "@tanstack/react-router";
   export const Route = createFileRoute("/app/ncrs")({
     component: () => <Outlet />,
   });
   ```
3. Let the TanStack Router Vite plugin regenerate `routeTree.gen.ts` automatically.

No business logic, UI, or styling changes. Only the routing shell.

## Verification

- `/app/ncrs` still shows the list (now served by `app.ncrs.index.tsx`).
- Clicking a row navigates to `/app/ncrs/<id>` and renders `NcrDetail`.
- `/app/ncrs/trash` continues to work.
