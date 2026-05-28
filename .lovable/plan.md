# Add Dashboard, Bulk Export, Trash, and Filtration to pWPS & PQR

Mirror the patterns already used by the Qualifications (WPQ) module so both Preliminary WPS and PQR modules feel consistent with the rest of the app.

## 1. Dashboard pages

New routes:
- `src/routes/app.pwps.dashboard.tsx` — `/app/pwps/dashboard`
- `src/routes/app.pqrs.dashboard.tsx` — `/app/pqrs/dashboard`

Each dashboard shows:
- KPI strip: Total, Draft, In Review / Pending Validation, Qualified / Passed, Rejected / Failed, Converted (pWPS) or Resulting WPS created (PQR).
- Status distribution (pie/donut).
- Code family / Process distribution (pie).
- Activity trend (bar) — records created per month over the last 12 months.
- "Needs attention" table — pWPS sitting in review > N days, PQR with `Pending` overall result, etc.
- Link back to the list and a primary "New pWPS" / "New PQR" CTA.

Reuse `useCompanyRows`, `recharts`, and the `Kpi` card pattern from `app.qualifications.dashboard.tsx`.

## 2. Filtration system

Extend the list pages (`app.pwps.index.tsx`, `app.pqrs.index.tsx`):
- Keep the existing text search.
- Add dropdown filters in a filter bar:
  - pWPS: Status, Code family, Process, Position.
  - PQR: Status, Overall Result, Code family, Linked pWPS.
- Filters combine (AND) with search; state lives in URL search params via TanStack Router `validateSearch` so filters are shareable and survive refresh.
- "Clear filters" button when any filter is active.
- Show active filter chips above the table.

## 3. Bulk Export

On both list pages:
- Add a checkbox column (header + per-row) with a `selected` Set state.
- Toolbar bar appears when any row is selected: "N selected", "Export CSV", "Export XLSX", "Move to Trash" (editors only), "Clear".
- Export uses existing `exportCsv` / `exportExcel` from `src/lib/export.ts` and exports the currently filtered + selected rows with a flat column set (number, title, status, code, process, dates, etc.).
- If nothing is selected, the toolbar offers "Export all filtered" as a fallback action under a small dropdown.

## 4. Trash with "move to trash" icon

Soft-delete already exists at the schema level (`deleted_at`, `deleted_by` on `pwps` and `pqrs`), but there are no RPCs yet.

Database migration (new file) adds 4 SECURITY DEFINER functions mirroring `soft_delete_qualification` / `restore_qualification`:
- `soft_delete_pwps(_id uuid)` — editor-only, tenant-scoped, sets `deleted_at`/`deleted_by`, writes an audit_logs row.
- `restore_pwps(_id uuid)` — super_admin-only, clears `deleted_at`/`deleted_by`, writes an audit_logs row.
- `soft_delete_pqr(_id uuid)` — editor-only.
- `restore_pqr(_id uuid)` — super_admin-only.

UI changes:
- Add a trash icon button in each list row's Actions column (`Move to trash`) that calls the soft-delete RPC after a confirm, then invalidates the list query.
- Bulk "Move to Trash" action runs the RPC for every selected id in parallel.
- New routes:
  - `src/routes/app.pwps.trash.tsx` — `/app/pwps/trash`
  - `src/routes/app.pqrs.trash.tsx` — `/app/pqrs/trash`
  - Both mirror `app.qualifications.trash.tsx`: super_admin only, lists `deleted_at IS NOT NULL` rows, with Restore and permanent Delete buttons.
- Add a "Trash" link in the list-page header next to the dashboard link.

## 5. Navigation wiring

On the existing pWPS and PQR list pages, add a small toolbar in the page header (next to the `New pWPS` / `New PQR` button):
- "Dashboard" → `/app/pwps/dashboard` or `/app/pqrs/dashboard`
- "Trash" → `/app/pwps/trash` or `/app/pqrs/trash` (visible only to super_admin)

## Technical notes

- New files only — no edits to `routeTree.gen.ts` (regenerated automatically).
- All queries continue to use `company_id = current_company_id()` via existing RLS; no policy changes needed.
- Realtime invalidation already handled by `useCompanyRows` when `realtime: true`.
- Permanent delete in trash uses the existing `editors delete pwps` / `editors delete pqrs` RLS policies (no new policy needed; super_admin is an editor).

## Files

Created:
- `src/routes/app.pwps.dashboard.tsx`
- `src/routes/app.pwps.trash.tsx`
- `src/routes/app.pqrs.dashboard.tsx`
- `src/routes/app.pqrs.trash.tsx`
- `supabase/migrations/<timestamp>_pwps_pqr_soft_delete_rpcs.sql`
- `src/components/common/BulkActionsBar.tsx` (shared selection toolbar)
- `src/components/common/FilterBar.tsx` (shared filter dropdowns + chips)

Edited:
- `src/routes/app.pwps.index.tsx` — filters, selection, bulk actions, trash icon, header links.
- `src/routes/app.pqrs.index.tsx` — same.
