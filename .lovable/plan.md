# Fix WPS detail navigation

## What I’ll change
1. Convert the procedures parent route into a layout route that renders an `Outlet`, matching the working qualifications pattern.
2. Move the current procedures list page into an index child route so `/app/procedures` still shows the table, search, and actions.
3. Keep the existing detail route at `/app/procedures/$procedureId`, so row clicks and the eye icon can render the WPS detail page correctly.
4. Validate the route structure and preview behavior so clicking a row or the eye icon opens the detail page.

## Why this is happening
The current route tree nests `/app/procedures/$procedureId` under `/app/procedures`, but `src/routes/app.procedures.tsx` is implemented as a standalone page instead of a parent layout. In TanStack Router, child routes only render when the parent includes an `Outlet`.

## Technical details
- Replace `src/routes/app.procedures.tsx` with a layout-style route component.
- Create a child index route for the procedures list page (same UI and behavior as today).
- Leave the existing navigation calls intact unless a small cleanup is needed.
- Recheck the generated route structure and preview navigation after the change.

## Expected result
- Clicking a WPS row navigates to `/app/procedures/:procedureId`.
- Clicking the eye icon also opens the same detail page.
- You’ll be able to verify the new WPS tabs, dynamic sections, and compatibility warnings on the detail screen.