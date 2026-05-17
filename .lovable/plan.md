
# Dynamic Intelligent WPS Engine — Implementation Plan

This is a large, multi-phase refactor. To keep quality high and avoid breaking the existing WPS workflow (which already has revisions, approvals, attachments, heat-input calc, soft-delete, audit logging), I'll deliver this in **4 staged phases**, each shippable on its own. Please confirm before I start, and tell me if you want me to ship all 4 in this turn or stop after Phase 1 for review.

---

## Phase 1 — Relational Data Model (DB migration)

Extend the existing `procedures` table (keep it as the WPS header) and add new child tables. No flat JSON blobs.

**Extend `procedures`** with structured header + thermal + technique fields:
- `wps_no`, `pqr_no`, `procedure_type`, `document_no`, `wps_date`
- `groove_type`, `welding_progression`, `pipe_or_plate`, `position_qualified`, `joint_notes`
- `preheat_min_c`, `interpass_max_c`, `preheat_method`, `thermal_notes`
- `technique_string_weave`, `cleaning_method`, `back_gouging`, `peening`, `pass_type` (single/multi), `electrode_type` (single/multi), `automation` (manual/semi/auto), `technique_notes`
- `qr_token` for verification

**New child tables (all with `company_id`, RLS, audit triggers):**
1. `wps_joint_configurations` — multiple joints per WPS, with `sketch_path` (image/SVG)
2. `wps_base_metals` — P-No, Group, To-P-No, To-Group, spec, thickness range, diameter range, groove, pass thickness
3. `wps_filler_metals` — process, SFA, AWS class, brand, F-No, A-No, diameter, qualified thickness, flux class, flux brand, consumable insert, notes
4. `wps_electrical_characteristics` — pass/layer, process, filler class, diameter, polarity, amp range, volt range, travel speed, heat input
5. `wps_signatures` — prepared/reviewed/approved by, signature_data_url, role, date (mirrors `qualification_signatures`)

**Storage bucket:** `wps-sketches` (private, signed URLs) for joint sketches.

**RLS pattern:** `company_id = current_company_id()` for SELECT, `is_editor()` for writes. Reuse the existing `write_audit_log` trigger pattern.

**Public QR verification:** `get_wps_by_qr(_token)` security-definer function (mirrors `get_qualification_by_qr`).

---

## Phase 2 — Editor UI (engineering workspace)

Redesign `src/routes/app.procedures.$procedureId.tsx` with new tabbed sections:
- **Header & Status** (existing)
- **Joint Design** — editable list of joint configs with sketch upload
- **Base Metals** — editable relational table
- **Filler Metals** — editable relational table
- **Electrical Characteristics** — editable pass-by-pass table
- **Thermal & Technique** — structured form
- **Heat Input** (existing)
- **Attachments** (existing)
- **Approvals & Signatures** — extended with signature pad
- **Audit** (existing)

New components in `src/components/procedures/`:
- `JointConfigList.tsx`, `BaseMetalsTable.tsx`, `FillerMetalsTable.tsx`, `ElectricalCharacteristicsTable.tsx`, `WpsSignatureBlock.tsx`

Sticky action bar with Submit/Approve/Print, responsive layout.

---

## Phase 3 — Printable WPS document + QR verification page

- Rebuild `src/components/reports/WpsDocument.tsx` to render the full structured WPS (header, joints, base metals, fillers, electrical table, technique, signatures) in a professional print layout.
- New public route `src/routes/verify.wps.$token.tsx` for QR-based public verification.

---

## Phase 4 — Intelligence Layer foundation

New service `src/lib/wps-intelligence.ts` exposing pure functions:
- `validateWpsCompleteness(wps, children)` → ComplianceFinding[]
- `checkWpsWpqCompatibility(wps, wpq)` → process / F-No / A-No / position / thickness / diameter range checks
- `validateProductionWeld(weld, wps, children)` → heat input, filler, base metal, position
- `scoreWpsCompliance(findings)` → 0–100 with severity weighting

Reuses the existing `ComplianceFinding` / `QualificationValidation` patterns from `src/lib/qualification-validation.ts` for consistency. Hooked into the WPS detail page as a "Compliance" panel, and exposed for future weld-release workflows.

---

## Technical guardrails

- **Backward compatible:** keep existing `procedures` columns (`voltage_min/max`, `current_min/max`, etc.) as deprecated fallbacks so existing rows + heat-input calc keep working. New electrical characteristics table is the source of truth going forward.
- **All migrations forward-only**, no destructive drops.
- **RLS + audit + tenant isolation** preserved on every new table.
- **Types regenerate automatically** after migration; UI components type-check against fresh types.
- **No new edge functions** — all logic in TanStack server fns or client.

---

## What I need from you

1. Confirm to proceed with Phase 1 (DB migration) now. I'll write the migration in a single call and pause for your approval before running it.
2. Tell me whether to continue straight into Phase 2 (UI) after the migration is approved, or stop for review.
3. Optional: any attached WPS template image/PDF I should pull field names from verbatim — your message references one but nothing was attached this turn.
