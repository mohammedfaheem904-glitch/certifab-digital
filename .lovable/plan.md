# Welder Qualification Certificate (WPQ) — Enterprise Upgrade

This is a large, multi-part upgrade. Below is the staged plan. I'll execute it in one pass once you approve, but split into clear phases so it stays reviewable.

## Phase 1 — Database (migration)

Extend `qualifications` and add supporting tables. All RLS = company-scoped (mirrors existing `editors` / `members` policies). All tables get `company_id`, `created_at`, `updated_at`.

**`qualifications` (extend)** — add columns:
- Identity: `wpq_number`, `wps_number`, `pqr_number`, `stamp_number`, `welder_photo_url`, `qr_token` (auto, unique), `revision` (default `Rev 0`), `doc_number`
- Process: `process_type` (Manual/Semi-Auto/Mechanized/Auto), `test_coupon_type`, `welder_test_number`, `code_family` (ASME IX / AWS / EN ISO / AS-NZS / JIS)
- Dates: `qualification_date`, `last_continuity_date`
- Outcome: `result` (Satisfactory/Unsatisfactory), `remarks`, `rejection_reason`, `retest_of_id` (self-FK uuid)
- Status enum extended: Active / Expired / Suspended / Expiring Soon (computed view)

**New table `qualification_variables`** (the QW-4xx matrix)
- `qualification_id`, `variable_key`, `variable_label`, `qualified_with`, `qualified_for`, `code_reference` (QW-402/403/404/405/409), `sort_order`

**New table `qualification_tests`**
- `qualification_id`, `category` (`ndt` | `destructive`), `test_type` (VT/MT/PT/RT/UT/Macro/Root Bend/Face Bend/Side Bend/Fillet Break/Tensile/Nick Break/Hardness/Other), `result` (Acceptable/Not Acceptable/N/A), `report_number`, `inspector_name`, `test_date`, `notes`

**New table `qualification_signatures`**
- `qualification_id`, `role` (QC Engineer/QA-QC Manager/Witness/Examiner/Client Rep), `name`, `signature_data_url` (text), `signed_at`, `actor_id`

**New table `qualification_continuity`**
- `qualification_id`, `activity_date`, `process`, `project_id`, `evidence_weld_id`, `notes`
- Trigger: insert auto-updates parent `last_continuity_date`

**New table `qualification_attachments`**
- `qualification_id`, `filename`, `storage_path`, `mime_type`, `size_bytes`

**Storage bucket**: `qualification-files` (private, RLS by company prefix). Add `welder-photos` public bucket for portrait images.

**Public RPC**: `get_qualification_by_qr(_token text)` — returns sanitized welder/qualification info (no PII beyond name, status, process, code, expiry).

## Phase 2 — Frontend routes/components

**Routes**
- `/app/qualifications` — upgrade list: filters (welder, process, status, expiry, code, position, project), KPI strip, status badges, search.
- `/app/qualifications/new` — multi-step wizard (Header → Identity → Variables matrix → Tests → Result → Signatures → Review).
- `/app/qualifications/$id` — detail editor with all sections + attachments + continuity log + revisions.
- `/app/qualifications/$id/certificate` — print-ready WPQ certificate (A4, company branded, QR).
- `/verify/qualification/$token` — public verification page (mirrors existing `verify.weld.$token` and `verify.instrument.$token`).
- `/app/qualifications/dashboard` — analytics: expiring soon, active welders, process distribution (pie), trends (bar), compliance KPIs.

**Components**
- `QualificationVariablesMatrix.tsx` — editable rows, add/remove, dropdown for code refs.
- `QualificationTestsTable.tsx` — tabbed NDT vs Destructive.
- `SignaturePad.tsx` — canvas-based signature, stored as data URL.
- `WelderPhotoUploader.tsx` — uses existing storage helpers.
- `QrCodeBlock.tsx` — uses `qrcode` lib (add via bun).
- `WelderQualificationCertificate.tsx` — full A4 print layout (replaces minimal `WelderQualificationDocument.tsx`).
- `ContinuityTimeline.tsx` — log entries with 6-month break warnings.

**Hooks/lib**
- `lib/qualification-status.ts` — derive Active/Expiring Soon (≤30d)/Expired/Suspended; continuity break detection (>6mo gap).
- `lib/use-qualification.ts` — React Query hook bundling qualification + variables + tests + signatures + continuity.
- `lib/export-qualification-excel.ts` — uses existing `export.ts` xlsx helper.

**PDF**
- Reuse existing print flow (`window.print()` via `ReportShell`) with a tightened `@media print` stylesheet sized A4 portrait. (Avoids adding heavy PDF libs; mirrors current report pattern.)

## Phase 3 — Cross-cutting

- Audit: attach `write_audit_log` trigger to all new tables.
- Notifications: weekly check (existing `reminder_log` pattern) for `Expiring Soon` and continuity-break.
- Permissions: signatures restricted via `is_editor` + role-specific check; `super_admin` only for "Suspended" status changes.
- i18n keys added under `welder_qualification.*`.
- Mobile: list collapses to cards; matrix becomes vertical key/value on `<md`.

## Out of scope / deferred (call out)
- Real cryptographic signatures (HSM/PKI) — we store hashed signature image + `actor_id` + timestamp, which is the industry-standard "digital signature record" but not a CA-issued PKI signature.
- Email delivery infra (would require enabling email connector). Notifications stored in `notifications` table only for now.

---

Approve and I'll execute Phase 1 (migration) first, then Phase 2 + 3 in code in the same turn.
