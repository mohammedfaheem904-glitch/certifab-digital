## Problem

`src/routes/app.instruments.tsx` contains the instruments list UI, but it also serves as the parent layout for the child routes:
- `src/routes/app.instruments.$instrumentId.tsx` (detail)
- `src/routes/app.instruments.trash.tsx` (trash)

Because the parent route renders the list directly and never renders `<Outlet />`, navigating to `/app/instruments/<id>` keeps showing the list page — the child route matches but has nowhere to mount. That's why clicking the Eye icon (and the asset_id link) appears to "do nothing".

## Fix

Convert `app.instruments.tsx` into a true layout, and move the list UI to an index leaf so it still renders at `/app/instruments`.

1. Create `src/routes/app.instruments.index.tsx` containing the current list component (the entire body of `app.instruments.tsx`), registered at `createFileRoute("/app/instruments/")`.
2. Replace `src/routes/app.instruments.tsx` with a minimal layout route that just renders `<Outlet />`.

No other files need to change. The Eye icon's `useNavigate({ to: "/app/instruments/$instrumentId", params: { instrumentId: r.id } })` and the asset_id `<Link>` will both work once the child route can mount.
