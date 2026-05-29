## Goal
Bring the Weld Traceability Log (`/app/welds`) to the same maturity as the pWPS/PQR/WPS modules — add a Dashboard, Trash (soft-delete), bulk export, richer filtration, an explicit eye-icon row action, and a Welder dropdown sourced from the Welders (qualifications) list in the "Log a weld" dialog.

## 1. Database — soft delete for welds
New migration `..._soft_delete_welds.sql`:
- `ALTER TABLE public.welds ADD COLUMN deleted_at timestamptz, deleted_by uuid`.
- Update `members read welds` policy to include `AND deleted_at IS NULL`.
- Add `super_admin reads deleted welds` SELECT policy (mirrors procedures pattern).
- New SECURITY DEFINER functions, mirroring `soft_delete_pwps` / `restore_pwps`:
  - `soft_delete_weld(_id uuid)` — `is_editor` required, writes audit log.
  - `restore_weld(_id uuid)` — `super_admin` required, writes audit log.

## 2. Refactor `src/routes/app.welds.tsx` (list page)
- Add header actions next to "Log Weld":
  - **Dashboard** button → `/app/welds/dashboard`
  - **Trash** button (super_admin only) → `/app/welds/trash`
  - **Export** dropdown (CSV / XLSX) operating on currently filtered + selected rows.
- Toolbar (row 2 under search + existing status/project filters): add **WPS**, **Welder**, **Workflow**, **Result** dropdowns; keep existing project and workflow filters but consolidate; add active-filter chips and "Clear filters" ghost button (same pattern as Procedures filtration from Phase 9).
- Filter options:
  - WPS: distinct `procedure_id` → show `procedures.code`.
  - Welder: distinct `welder_name` from current rows.
  - Workflow: existing `workflow_status` enum list.
  - Result: distinct `status` (`weld_status` enum).
  - Project: existing filter (kept).
- Selection column (checkbox) + select-all-on-page; bulk actions bar shows when ≥1 selected:
  - Export selected (CSV / XLSX via `exportCsv` / `exportExcel`).
  - Move to Trash (calls `soft_delete_weld` RPC per row, then invalidate `welds` query).
- Row "Actions" cell: keep existing open-link icon and add an **Eye** icon (`lucide-react`) tooltip "View weld details" → navigates to `/app/welds/$weldId`. Add a **Trash2** icon "Move to trash" for editors with confirm dialog.
- Result counter `Showing X of Y` in toolbar.

## 3. New routes
- **`src/routes/app.welds.dashboard.tsx`** — KPI strip (total, by workflow, by result, NCR-open count, awaiting inspection), and recharts panels:
  - Workflow distribution (pie/bar).
  - Result distribution (Accepted vs Rejected vs Pending).
  - 12-month weld creation trend.
  - Top welders by weld count.
  - Top WPS by usage.
  Backed by the same `useCompanyRows<Row>("welds")` query the index uses — fully client-side aggregation, matching pWPS/PQR dashboards.
- **`src/routes/app.welds.trash.tsx`** — super_admin only; lists welds with `deleted_at IS NOT NULL`, shows deletion metadata, "Restore" button calling `restore_weld` RPC. Uses a direct supabase query with `deleted_at not is null` (RLS covers it).

## 4. Welder dropdown in "Log a weld" dialog
In `app.welds.tsx`, replace the free-text `welder_name` Input with a `Select` whose options are pulled from the qualifications (Welders) list scoped to the current company:
- Add a `useCompanyRows<{ welder_name: string }>("qualifications", { select: "welder_name" })` query.
- Deduplicate names, sort, render as `SelectItem`s.
- Selected value sets `welder_name` (still a text column — no schema change needed).
- Allow an `"— Other —"` option that reveals a free-text fallback Input for ad-hoc names (so the existing UX is not regressed).

## 5. Technical notes
- All new components reuse existing helpers: `useCompanyRows`, `DataTable` (extend with `selectable` if not present, otherwise wrap with local checkbox column), `exportCsv` / `exportExcel`, `StatusBadge`, `WeldStatusBadge`, `Tooltip`, `Select`, `AlertDialog` for the trash confirm.
- Soft-delete RPCs called via `supabase.rpc("soft_delete_weld", { _id })`.
- Restore RPC via `supabase.rpc("restore_weld", { _id })`.
- No backend filtering — list is already loaded client-side; new filters compose with AND against `data ?? []`.
- Dashboard and Trash pages registered automatically by TanStack file-based routing once the files exist.

## Files to change / create
- `supabase/migrations/..._soft_delete_welds.sql` (new)
- `src/routes/app.welds.tsx` (filters, bulk actions, eye/trash icons, welder dropdown, dashboard/trash links)
- `src/routes/app.welds.dashboard.tsx` (new)
- `src/routes/app.welds.trash.tsx` (new)

## Out of scope
- No changes to the weld detail page (`app.welds.$weldId.tsx`).
- No URL/search-param persistence for the new filters.
- No backfill of `welder_name` against existing qualifications.
