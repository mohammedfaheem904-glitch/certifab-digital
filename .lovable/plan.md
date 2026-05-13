
# Phase 4 — Production-Ready Enterprise Polish

Scope is large. I'll execute it in waves, each leaving the platform shippable. All work stays multi-tenant (`company_id` + RLS), uses existing `is_editor()` / `current_company_id()` helpers, and writes through `audit_logs` triggers.

---

## Wave 1 — Schema Foundations (one migration)

Extend the data model so the new pages have something real to render.

**`welds` table** — add traceability fields:
`joint_no, spool_no, drawing_ref, line_no, base_material, heat_number, filler_metal, joint_type, inspection_status, qr_token, procedure_id` (FK already present).

**`weld_events`** (new) — timeline of weld lifecycle:
`weld_id, kind (logged|inspected|repaired|approved|rejected|note), actor_id, actor_name, payload jsonb, created_at`.

**`weld_attachments`** (new) — photos, RT films, sketches.

**`ncrs`** (new, promoted from `inspections.ncr_code`) —
`ncr_no, project_id, weld_id, raised_by, severity, status (Open|In Review|CA Pending|Closed|Rejected), title, description, root_cause, corrective_action, preventive_action, due_date, assigned_to, closed_at, closed_by`.

**`ncr_events`** (new) — approval & escalation audit trail.
**`ncr_attachments`** (new).

**`instrument_events`** (new) — maintenance/status/assignment history (kind, payload, actor).

**Triggers** — attach `write_audit_log()` to all new tables; auto-emit `weld_events` rows on weld insert/status change; auto-emit `instrument_events` on assignment/status change.

**RLS** — same pattern as existing tables (company members read, editors write).

---

## Wave 2 — Instrument Detail Page

Route: `/app/instruments/$instrumentId`

- Header: name, asset_id, QR badge (link to `/verify/instrument/$token`), status pill, calibration-due countdown.
- Tabs: **Overview · Calibrations · Attachments · Activity · Assignment**.
- Overview cards: model/serial/manufacturer, assigned project + user, last calibration, next due (color-coded ≤30/≤7/expired).
- Calibrations: timeline + table, "Log calibration" dialog (date, performed_by, next_due, notes, certificate upload via existing `instrument-files` bucket), per-row certificate preview (PDF inline / image lightbox), CSV/Excel export via `exportExcel`.
- Attachments: drag-and-drop `FileUploader` (already exists) wired to `instrument-files/{company_id}/{instrument_id}/`.
- Activity: reads `instrument_events` + `audit_logs` filtered to this record, formatted timeline.
- Assignment panel: super_admin/qa_qc_manager can reassign project/user (writes `instrument_events`).

---

## Wave 3 — Executive Dashboard Redesign

Route: `/app/` (replace current `app.index.tsx`).

- KPI grid (12 tiles, responsive 2/3/4/6 cols): Total welds · Accepted · Rejected · Repair rate · Open NCRs · Active quals · Expiring quals (≤30d) · Calibration due (≤30d) · Inspection completion % · Avg heat input · Compliance score · Welders active.
- Charts (recharts, already a dep via shadcn chart): weld status trend (30d area), NDT type breakdown (donut), qualification expiry funnel (bar), calibration timeline (bar), per-project QA/QC stacked bar, top-5 welders by acceptance rate.
- Skeleton loaders on every tile/chart, empty states with CTA buttons.
- Realtime: subscribe to `welds`, `inspections`, `ncrs`, `notifications` channels — invalidate React Query keys on change.
- Premium styling: subtle gradient surfaces via `--gradient-primary`, semantic tokens only, generous spacing, `tracking-tight` headings.

---

## Wave 4 — Weld Traceability Module

- `/app/welds` — upgraded list: sticky header, column filters (project, welder, WPS, status, date range), saved-search bar, bulk select → bulk approve/reject/export, advanced search box (joint/spool/drawing/heat#).
- `/app/welds/$weldId` — detail page:
  - Identity panel (weld no, joint, spool, drawing, line, QR badge).
  - Traceability chain: Project → Drawing → Line → Spool → Joint → Weld → WPS → Welder → Base material/heat → Filler → Inspections → NCRs.
  - Tabs: **Overview · Inspections · Repairs · Attachments · Timeline · Approvals**.
  - Photo gallery with lightbox.
  - Public QR route: `/verify/weld/$token` (anon read, masked PII).
- Updated `NewRecordDialog` defaults for welds to capture new fields.

---

## Wave 5 — NCR Management Workflow

- `/app/ncrs` — list with KPI strip (open/overdue/critical), filters, bulk export.
- `/app/ncrs/$ncrId` — workflow detail:
  - Status stepper: Draft → Open → Root Cause → CA/PA → Review → Closed.
  - Sections: Description · Root Cause · Corrective Action · Preventive Action · Approvals · Attachments · Audit Trail.
  - Role-gated transitions (inspector raises, qa_qc_manager reviews, super_admin closes).
  - Due-date tracking with overdue badge; notification on assignment + 24h-before-due (extends existing `notifications` table; no new cron — fired from triggers + existing daily job).
- Migrate existing `inspections.ncr_code` references — link inspection rows to new `ncrs` table where present.

---

## Wave 6 — UX & Enterprise Polish

- New shared `<DataTable>` primitive: sticky header, sortable columns, row selection, bulk action toolbar, column visibility, density toggle, CSV export. Adopt across welds/ncrs/qualifications/instruments/procedures (replace current ad-hoc tables).
- New `<FilterBar>` (search + facet chips + date range).
- `AppLayout` polish: collapsible sidebar with module groups (Operations / Quality / Assets / Admin), breadcrumb in header, command palette (`⌘K`) routing.
- Page transitions via `motion` (subtle 150ms fade).
- Tighten typography scale in `styles.css` (display/h1/h2/body), add `--shadow-elegant` use on cards.

---

## Wave 7 — Demo Seed Expansion

Extend `src/lib/seed.ts`:
- 4 fabrication/EPC projects with realistic clients, locations, line counts.
- 80 welds across projects with full traceability fields, mixed statuses, ~12% repair rate.
- 30 inspections (RT/UT/MT/PT/VT mix), 8 NCRs at various workflow stages (2 overdue, 1 critical-escalated).
- 25 qualifications (3 expiring 30d, 2 expiring 7d, 1 expired).
- 18 instruments + 40 calibration history records (5 due ≤30d).
- Pre-populated notifications for the seeded user (3 unread).
- Idempotent guard already in place.

---

## Technical Notes

- All routes use TanStack Start file routing (`src/routes/...`). Loaders prefetch via React Query `queryClient.ensureQueryData`.
- Realtime via existing `supabase.channel(...)` pattern; cleanup on unmount.
- Charts via `recharts` (already pulled in by shadcn `chart.tsx`).
- File previews: PDF in `<iframe>` with signed URL from `instrument-files` / `weld-attachments` bucket; images in shadcn dialog lightbox.
- New storage bucket: `weld-attachments` (private, RLS by company prefix).
- No new env/secrets required.
- Audit triggers cover all new tables — no app-side audit code.

---

## Out of Scope (deferred, called out)

- AI welding analytics, IoT/real-time machine telemetry, predictive QA, ERP connectors — architecture is ready (clean schema, server functions, RLS) but no implementation this phase.
- Custom email-domain wiring for new event types — existing transactional pipeline is reused; new email templates can be added in a follow-up once the domain is verified.

---

## Execution Order

1. Migration (Wave 1) — **requires your approval before I run it**.
2. Waves 2–6 implemented in code in a single follow-up.
3. Wave 7 seed update + demo verification.

Reply **approve** to run the migration and proceed, or tell me which waves to drop/reorder.
