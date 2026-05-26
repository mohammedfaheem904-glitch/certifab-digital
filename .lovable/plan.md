# Welding Procedure Qualification & Governance System

This is a major strategic evolution — far beyond a single build turn. I'm proposing a phased plan so each phase ships working, testable value rather than a half-wired megastructure. Please confirm scope (or pick a starting phase) before I begin.

## Lifecycle the system will enforce

```text
pWPS ─► Test Coupon ─► Welding Execution ─► NDT / Mechanical Tests
       ─► PQR Evaluation ─► Engineering Validation ─► WPS Approval ─► Production Release
```

A pWPS cannot become a production WPS until PQR tests pass, engineering validation succeeds, and approvals are signed.

---

## Phase 1 — Data foundation (DB + traceability)

New tables (all tenant-scoped via `company_id`, RLS mirroring `procedures`):

- `pwps` — preliminary procedures (status: Draft, Under Qualification, Testing, Pending Validation, Qualified, Rejected, Converted)
- `pqrs` — qualification records, links `pwps_id`, resulting `wps_id`
- `test_coupons` — coupon ID, pwps_id, material, P-No/Group, thickness, dia, process, welder, position, joint, backing, heat#, fillers, date, project
- `welding_execution_records` — planned vs actual amps/volts/travel/heat input/pass/interpass/polarity/consumables/gas/sequence, linked to coupon
- `ndt_tests` — type (RT/UT/PT/MT/VT), result, criteria, technician, equipment_id (→ instruments), report attachment, findings
- `mechanical_tests` — type (Tensile/Bend/Impact/Hardness/Macro/Fracture), specimen, dims, results JSON, min req, pass/fail, lab ref
- `pqr_findings` — engine-generated validation findings (severity, code ref, message, affected variable)
- `procedure_links` — generic edges between pwps/pqr/wps/wpq/coupon/ndt/mech/weld/ncr for traceability graph

Extend `procedures` with `pwps_id`, `pqr_id` FKs so an approved WPS knows its lineage.

## Phase 2 — pWPS module

- Route group `/app/pwps` (index, $id detail, new) reusing the existing WPS builder workspace pattern
- Status state machine in `src/lib/pwps-workflow.ts`
- Conversion action "Promote to WPS" — gated by `qualified` status + signed PQR

## Phase 3 — Coupon + execution capture

- `/app/coupons` list + builder
- Execution record sub-form with planned-vs-actual diff highlighting and live heat-input calc (reuse `HeatInputCalculator`)

## Phase 4 — NDT + Mechanical test engine

- Tabbed test workspace inside the PQR detail page
- Per-test-type schemas (Zod) with acceptance criteria per code family
- Attachment uploads to new `pqr-attachments` bucket
- Equipment linkage pulls calibration status from `instruments`

## Phase 5 — Qualification Intelligence Engine

New `src/lib/pqr-engine.ts` extending existing `qualification-intelligence.ts`:

- Inputs: coupon + execution + NDT + mechanical results + code family
- Applies ASME IX (QW-403/404/405/406/451/452) and ISO 15614 / 9606 rules
- Outputs:
  - pass/fail per essential variable
  - qualified ranges (thickness, diameter, position, backing, polarity, process)
  - findings list with code references
  - remediation guidance on failure
- Pure functions, fully unit-testable

## Phase 6 — Approval workflow + WPS auto-generation

- On PQR pass + signatures: server fn creates approved `procedures` row, copies qualified ranges, links PQR, opens revision history
- On fail: blocks promotion, surfaces failed variables and required retests
- Notification fan-out via existing `notifications` table

## Phase 7 — Operational intelligence

- Background evaluation (server fn): when PQR expires / fails / is withdrawn, compute affected WPSs, welds, projects → write `notifications` + dashboard alerts
- Reuse `OperationalAlertStrip` pattern

## Phase 8 — Dashboards + PDFs

- `/app/pqr/dashboard` — KPIs (qualification status, pass/fail trend, expiring, bottlenecks, engineering risk)
- Industrial A4 PDF documents for pWPS, PQR, WPS via the existing `ReportShell` (revision block, signatures, QR, multi-page tables, NDT/mechanical appendices, branding)

---

## Technical approach

- **Stack:** TanStack Start server functions for all writes, RLS on every new table, `is_editor()` for mutations, `super_admin` for promote-to-WPS
- **State machines:** colocated in `src/lib/*-workflow.ts` mirroring `weld-workflow.ts`
- **Engine isolation:** pure TS in `src/lib/pqr-engine.ts` + `qualification-intelligence.ts` — no DB, fully testable
- **UI reuse:** `WpsBuilderWorkspace`, `DynamicSectionTables`, `SignaturePad`, `ReportShell`, `QrCodeBlock` already cover ~60% of the surface

---

## Scope & sequencing question

This is roughly **8–12 build turns** of work. To keep momentum I propose shipping **Phase 1 + Phase 2** first (data model + pWPS module with status workflow, no engine yet) so you can immediately enter pWPS records and we validate the schema before layering the engine on top.

**Please confirm:**
1. Start with Phase 1+2 (recommended), or jump to a different phase?
2. Code families to support first: ASME IX only, or ASME IX + ISO 15614/9606 from day one?
3. Should the existing `qualifications` (WPQ) tables be reused/extended, or kept separate from the new PQR tables?
