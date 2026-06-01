## Problem

Navigating to **User Approvals** (`/app/admin/users`) shows the Admin Console dashboard instead of the User Management page, so the Pending tab and Approve/Reject buttons are never reachable.

Cause: in TanStack Router's flat-file routing, `src/routes/app.admin.tsx` is automatically the **parent layout** of `src/routes/app.admin.users.tsx`. A parent layout must render `<Outlet />` for child routes to appear — but `AdminConsole` doesn't. Result: the child page silently never renders.

## Fix

Convert `app.admin` from a layout-with-content into a normal index page so it stops swallowing its children.

1. **Rename** `src/routes/app.admin.tsx` → `src/routes/app.admin.index.tsx`
   - Update the route id from `createFileRoute("/app/admin")` to `createFileRoute("/app/admin/")` so `/app/admin` still renders the Admin Console.
2. After rename, `/app/admin/users` will correctly resolve to `app.admin.users.tsx` (User Management) with no parent layout interfering.
3. Verify the sidebar links to `/app/admin` and `/app/admin/users` still work, and that the "User Approvals" notification link opens the Pending tab.

No database, RLS, or business-logic changes. No edits to the User Management page itself — it already works once it actually renders.
