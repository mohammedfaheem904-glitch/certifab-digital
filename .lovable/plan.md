## Goal
Upgrade the **Fleet & Equipment** chapter to match the QA/QC Instruments experience.

## 1. Database migration (`equipment` table)
Add columns:
- `name text` (defaults to `model` if blank)
- `category text not null default 'Other'`
- `serial_number text`
- `manufacturer text`
- `notes text`
- `qr_token text` (auto generated, like instruments)
- `deleted_at timestamptz`, `deleted_by uuid`

Add sibling table `equipment_calibrations` mirroring `instrument_calibrations` (equipment_id, calibrated_on, next_due, performed_by, certificate_path, notes) with GRANTs + RLS (members read, editors insert/delete, company-scoped).

Update RLS on `equipment`:
- `members read equipment` → require `deleted_at IS NULL`
- New policy `super_admin reads deleted equipment`

Add RPCs `soft_delete_equipment(id)` and `restore_equipment(id)` (SECURITY DEFINER, company-scoped, editor / super_admin checks).

Reuse existing `instrument-certificates` storage bucket (or add an `equipment-certificates` bucket if separation preferred — will reuse to keep scope tight).

## 2. Route restructure
Convert `src/routes/app.equipment.tsx` into a layout-only route rendering `<Outlet />`, then add:
- `src/routes/app.equipment.index.tsx` — list page (current UI rebuilt with new features)
- `src/routes/app.equipment.dashboard.tsx` — stats dashboard (mirrors `app.instruments` dashboard pattern: totals, active, due-soon, overdue, by-category chart, upcoming calibrations table)
- `src/routes/app.equipment.$equipmentId.tsx` — details page (asset info, calibration history list with certificate links, QR token)
- `src/routes/app.equipment.trash.tsx` — soft-deleted list with Restore + permanent delete (super_admin only)

## 3. Index page features
- **Search** input across asset_id / name / model / serial / manufacturer
- **Filters**: Category, Status, Calibration Due (Overdue / 30d / 90d / OK / None) — same chips as Instruments
- **Bulk select** via row checkboxes → "Export selected (xlsx)" and "Move to trash" actions
- **Per-row icons**: Eye (navigate to details), Trash (soft delete)
- **Stats strip**: Active / Due soon / Overdue counts + link to Dashboard and Trash
- Real-time updates via existing `useCompanyRows({ realtime: true })`

## 4. Register Machine dialog (enhanced)
Fields:
- Asset ID, Name, Category (select from CATEGORIES list), Model, Manufacturer, Serial number, Calibration due, Status, Notes
- **Quantity** (1–50): inserts N rows, suffixing Asset ID `-01`, `-02`, …
- **Calibration certificate** file input (PDF/image): uploads to storage and creates an `equipment_calibrations` record per inserted equipment row

## 5. Navigation
Add sidebar/links to `/app/equipment/dashboard` and `/app/equipment/trash` from the list page header (matches Instruments layout).

## 6. Out of scope
- No changes to other chapters
- No new permissions roles beyond existing editor / super_admin
- Reusing instrument styling/components — no new shadcn primitives needed

## Technical notes
- Soft-delete RPCs return updated row; client invalidates `["equipment", company_id]`
- Bulk trash uses RPC in a loop (small batches) for audit logging via `equipment` triggers if present; otherwise direct UPDATE with `deleted_at = now()`
- Certificate uploads use signed URLs via existing `src/lib/storage.ts`
- Excel export reuses `src/lib/export.ts#exportExcel`
