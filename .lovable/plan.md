
## Scope
Enhance the **QA/QC Instruments** chapter (`/app/instruments`) with six features.

## Changes

### 1. Database migration (small)
Add to `public.instruments`:
- `deleted_at timestamptz null`
- `deleted_by uuid null`

Update the `members read instruments` RLS policy to require `deleted_at IS NULL` (mirrors the `pwps` / `procedures` pattern), and add a `super_admin reads deleted instruments` policy so trash is visible to admins only (same pattern used elsewhere). No new tables.

### 2. Register Instrument dialog (`app.instruments.tsx`)
- Add **Quantity** field (numeric, default 1). When > 1, the insert is repeated N times, appending `-1`, `-2`, … to the entered Asset ID so each row stays unique.
- Add **Calibration certificate** file input (PDF/image). After the instrument insert, upload the file to the `instrument-files` bucket at `{company_id}/{instrumentId}/cert-initial-{filename}` and create an `instrument_calibrations` row referencing it (uses today as `calibrated_on` and the entered `calibration_due` as `next_due`). If quantity > 1, the same certificate is attached to each created instrument.

### 3. Filter bar (`app.instruments.tsx`)
Replace the current single category dropdown with a filter row:
- Category (existing)
- Status (Active / Maintenance / Retired — from `instrument_status` enum)
- Calibration due window (All / Overdue / Due in 30d / Due in 90d / OK)
- Keep the search input
- "Reset filters" button

### 4. Bulk export + bulk actions
- Add a checkbox column to the instruments table plus a header "select all (filtered)" checkbox.
- When any row is selected, show an action bar with **Export selected** (Excel via existing `exportExcel`) and **Move to Trash**.
- Keep an "Export all (filtered)" button next to the filter bar for the no-selection case.

### 5. Per-row actions
Add an actions column with:
- 👁 **Eye icon** → navigates to `/app/instruments/$instrumentId` (the existing detail route).
- 🗑 **Trash icon** → soft-deletes the row (sets `deleted_at = now()`, `deleted_by = auth.uid()`), with a confirm toast.

### 6. Trash route (`app.instruments.trash.tsx`, new)
Mirrors `app.pwps.trash.tsx`:
- Lists instruments where `deleted_at IS NOT NULL` (visible to super_admin via the new RLS policy).
- Per-row **Restore** (clears `deleted_at`/`deleted_by`) and **Delete permanently** (hard delete).
- Add a "Trash" link in the page header of `app.instruments.tsx`.

## Files touched
- migration: add soft-delete columns + RLS update on `instruments`
- `src/routes/app.instruments.tsx` — register dialog, filters, bulk actions, row actions, trash link
- `src/routes/app.instruments.$instrumentId.tsx` — no change required (eye icon links to it)
- `src/routes/app.instruments.trash.tsx` — new

## Out of scope
- Editing existing instruments inline (separate request).
- Bulk edit of category/status.
