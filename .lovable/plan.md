## Problem

Clicking any report on `/app/reports` navigates the URL to `/app/reports/welds` (etc.) but the page content does not change.

## Root Cause

`src/routes/app.reports.tsx` is registered as the layout route for `/app/reports/*`. In TanStack Router, a layout route component must render an `<Outlet />` for child routes (`app.reports.$slug.tsx`) to display. Instead, this file renders the report category list directly and has no `<Outlet />`, so visiting `/app/reports/welds` still shows the parent's category list and the child route never mounts.

## Fix

Convert the category list into a proper index route so it only renders at `/app/reports`, and leave child routes free to render at `/app/reports/$slug`:

1. Rename `src/routes/app.reports.tsx` → `src/routes/app.reports.index.tsx` and update its route id from `/app/reports` to `/app/reports/`. The list UI stays exactly the same.
2. No other files need changes — `app.reports.$slug.tsx` already exists and works; the generated route tree will pick up the rename automatically on next build.

After the change:
- `/app/reports` → category list (index route)
- `/app/reports/welds`, `/qualifications`, etc. → individual report pages render correctly.

## Verification

- Build passes (`bun run build`).
- Manually click each of the 6 report cards and confirm the corresponding report page loads.
