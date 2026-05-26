## Goal

Close the loop between `pWPS → PQR → WPS`. When a PQR is marked **Passed** and signed, the system auto-creates a Draft WPS in the Procedures module (linked back to its pWPS + PQR). A welding engineer still manually approves it before it becomes Active. The Procedures list separates **All / Qualified / Legacy** so qualified items are easy to find.

---

## 1. PQR detail — Pass & Sign

In `src/routes/app.pqrs.$pqrId.tsx` (created in this phase, mirrors pWPS detail):
- Tabs: Overview · Coupons · NDT · Mechanical · Findings · Signatures
- Header action **Mark as Passed** (enabled when all required NDT + mechanical tests have `result = Passed` and no unresolved blocker findings)
- On click: opens `SignaturePad` dialog → writes `pqrs.overall_result = 'Passed'`, `status = 'Approved'`, `qualification_date = today`, `evaluator_id/name = current user`, inserts `qualification_signatures`-style row (reuse pattern), then triggers promotion (step 2).
- Also exposes **Mark as Failed** which sets `overall_result = 'Failed'`, `status = 'Rejected'`, and surfaces remediation note to the linked pWPS.

## 2. Auto-promote: PQR Passed → Draft WPS

New server function `src/lib/pqr-promotion.functions.ts`:
- Input: `pqrId`
- Guards: PQR must be `overall_result = 'Passed'`, must have `pwps_id`, must not already have `resulting_wps_id`, caller must be `is_editor`.
- Reads the linked `pwps` row + the `pqr` row.
- Inserts into `procedures` with:
  - `status = 'Draft'`, `revision = 'Rev 0'`
  - `procedure_type = 'WPS'`
  - `code` / `wps_no` = derived (`WPS-` + pwps_no, collision-safe with suffix)
  - `pqr_no` = pqr's `pqr_no`
  - `pwps_id`, `pqr_id` FKs populated
  - All welding variables (process, joint, base/filler, position, preheat/interpass, ranges, gas, pwht, technique) copied from pWPS
  - Qualified ranges from `pqrs.qualified_ranges` JSONB override pWPS ranges where present (thickness, diameter, heat input, position envelope)
  - `notes` seeded with `"Auto-generated from {pwps_no} qualified by {pqr_no} on {date}"`
- Updates `pqrs.resulting_wps_id`, `pwps.converted_to_procedure_id`, `pwps.converted_at`, `pwps.status = 'Converted'`.
- Inserts a `procedure_links` row (`source_type='pqr', target_type='procedure', relationship='qualified_by'`).
- Sends in-app notification to all `welding_engineer` + `qa_qc_manager` in the company: *"New qualified WPS draft ready for approval."*
- Returns the new `procedure.id` so the UI can navigate to it.

Called automatically from the PQR Pass action; also exposed as a manual **"Promote to WPS"** button on the pWPS detail and PQR detail headers (idempotent — re-clicking returns the existing WPS id).

## 3. Manual approval inside Procedures

No new workflow code needed — reuses the existing `procedures.status` flow (Draft → Submitted → Approved) and `WpsBuilderWorkspace` / `WpsSignatureBlock`. The auto-created draft simply shows up there, pre-filled, ready for the engineer to review and approve.

Small additions to `src/routes/app.procedures.$procedureId.tsx`:
- If `proc.pqr_id` is set, show a **"Qualification lineage"** strip at the top: `pWPS-001 → PQR-001 (Passed, 26 May 2026) → this WPS`, each segment a link.
- Approval is blocked (with explanatory tooltip) if the linked PQR is later set back to non-Passed.

## 4. Procedures list — All / Qualified / Legacy tabs

Edit `src/routes/app.procedures.index.tsx`:
- Add `Tabs` above the table: **All** (default) · **Qualified** (`pqr_id IS NOT NULL`) · **Legacy** (`pqr_id IS NULL`).
- Each row in Qualified shows a `Badge` "Qualified by PQR-xxx" linking to the PQR.
- Header KPI strip: counts per tab + "Pending approval" count (Draft WPSs with a `pqr_id`).
- "New WPS" button stays, but adds a hint *"Tip: production WPSs are normally created automatically from a passed PQR."*

## 5. Navigation + sidebar

`src/components/AppLayout.tsx`: add **PQR** entry between "Preliminary WPS" and "Procedures" so the lifecycle reads `pWPS → PQR → Procedures` in the sidebar.

## 6. Files to add / edit

Add:
- `src/routes/app.pqrs.tsx` (layout)
- `src/routes/app.pqrs.index.tsx` (list)
- `src/routes/app.pqrs.$pqrId.tsx` (detail + pass/fail/sign + tabs scaffold)
- `src/lib/pqr-promotion.functions.ts` (server fn)
- `src/lib/pqr-promotion.ts` (pure helpers: range merge, code derivation)
- `src/components/procedures/QualificationLineageStrip.tsx`

Edit:
- `src/routes/app.procedures.index.tsx` (tabs + badges + KPIs)
- `src/routes/app.procedures.$procedureId.tsx` (lineage strip, approval guard)
- `src/routes/app.pwps.$pwpsId.tsx` (add "Promote to WPS" button when qualified)
- `src/components/AppLayout.tsx` (sidebar PQR entry)

## 7. Out of scope (kept for later phases)

- Full PQR Coupons / NDT / Mechanical builders — this turn ships the **detail shell + Pass/Fail/Sign + promotion**; deep test editors come in the next phase.
- PQR qualification engine variable-by-variable evaluation (the auto-promotion just copies qualified_ranges JSON as-is for now).
- PDF export of the qualified WPS lineage report.

Reply **"go"** to implement, or tell me what to adjust.