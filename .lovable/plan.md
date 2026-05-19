# Frontend Activation & Operational Exposure Phase

A lot of intelligence already exists in code (`wps-intelligence.ts`, `weld-matching.ts`, `weld-readiness.ts`, `weld-workflow.ts`, `qualification-validation.ts`, `qualification-intelligence.ts`, `qualification-status.ts`, `notifications.ts`, audit logs, `procedure_revisions`, `procedure_approvals`, `weld_events`, `instrument_events`, `ncr_events`) but most of it is only wired into the Weld detail page. This phase exposes that intelligence everywhere else the user works.

---

## Backend-to-Frontend Gap Audit

Already built, NOT yet visible enough:

| Capability | Where it lives | Where it's missing |
|---|---|---|
| Qualification validation findings | `qualification-validation.ts` | Qualification detail + list (no findings panel / risk badge) |
| Continuity / expiry intelligence | `qualification-status.ts` | List rows, dashboard, welder picker on welds |
| WPS compliance / essential variables | `wps-intelligence.ts`, `WpsCompliancePanel` | Procedures list (no compliance score column), dashboard |
| WPS ↔ Weld usage | welds.procedure_id | WPS detail has no "Used by" production welds tab |
| Welder ↔ Production welds | welds.welder_name | Qualification detail has no production-weld history |
| Revision / approval history | `procedure_revisions`, `procedure_approvals` | Not visible from list, no contextual "last approved" chip |
| Audit logs | `audit_logs` table | No contextual "recent activity" anywhere outside `/app/audit` |
| NCR ↔ Weld impact | ncrs.weld_id | NCR list/detail has no linked-weld card or readiness impact |
| Inspection ↔ Weld / NCR | inspections.weld_id | Inspection list has no traceability column or NCR shortcut |
| Instrument calibration impact | `instruments.calibration_due` | Only surfaces inside Compliance Center — not on instrument list as risk |
| Notifications / alerts | `notifications.ts` | Bell exists but dashboard has no operational alert strip |
| Workflow stepper/action bar | `weld-workflow.ts` | Only on weld detail — list doesn't show stepper progress hint |

---

## Phase A — Dashboard Operationalization (`app.index.tsx`)

Rebuild the home dashboard around live KPIs already computable from the DB:

- **Alert strip** — expiring qualifications (≤30d), expired calibrations, open NCRs, blocked welds, pending approvals. Each is a clickable card → filtered list route.
- **Readiness KPI tiles** — % welds ready for release, % qualifications active, % instruments in-calibration, open NCR count, average readiness score (sampled).
- **Operational bottlenecks** — "Awaiting Inspection" count, "Ready for Release" awaiting approval count, NCRs overdue.
- **Recent activity feed** — last 10 entries from `audit_logs` + `weld_events` (cross-entity).
- **Coverage panels** — qualification coverage by process, WPS approval status mix.

## Phase B — Qualification Intelligence Exposure

- **List (`app.qualifications.index.tsx`)**: add Status / Continuity / Expiry-risk badges using `deriveQualStatus` + `continuityBroken/Warning`. Add filter pills (Expired, Expiring, Continuity broken, Suspended).
- **Detail (`app.qualifications.$qualId.tsx`)**: add **Qualification Findings panel** (reuse same pattern as Compliance Center — Critical/Warning/Info collapsibles) driven by `qualification-validation.ts`. Add **Production Welds** tab listing welds matched by welder_name (relational visibility, deep-link to weld). Add **Continuity Risk** banner when broken/warning.

## Phase C — WPS / Procedure Operationalization

- **Procedures list (`app.procedures.tsx`)**: add Approval status chip, Revision chip, Compliance score column (cheap: re-uses `WpsCompliancePanel` logic at a summary level), QR / Verify shortcut, hover quick-actions (Open, Sign, Compare revisions).
- **Procedure detail**: add **"Used by" tab** showing production welds referencing this WPS with their workflow status — direct relationship visibility WPS ↔ Welds. Add a top **Status & Approval banner** (revision, last approved, signers count) so users see the engineering state without scrolling.

## Phase D — NCR / Inspection Traceability

- **NCRs list**: add linked-weld / inspection columns + severity heatmap chip.
- **NCR detail**: add relationship cards (Weld, Inspection, raised by, assigned to) + impact note ("This NCR is blocking release readiness for weld X").
- **Inspections list**: linked-weld column, NCR shortcut when severity = reject, inspector/date.
- **Inspection row → weld**: hover quick-action "Open weld" using same `QuickActionButton` pattern as welds list.

## Phase E — Instruments Risk Exposure

- **Instruments list (`app.instruments.tsx`)**: calibration risk badge (Expired / Due soon / OK), days-until column, filter pills. Row → opens detail.
- **Detail**: add "Welds potentially affected" hint when expired (welds inspected with this instrument's category in the last 90 days — best-effort, advisory).

## Phase F — Cross-cutting UX activation

- **Reusable** `<RecentActivityCard entity="welds|procedures|qualifications" id={...} />` reading from `audit_logs` + entity-specific event tables — drop into each detail route so audit becomes contextual, not just `/app/audit`.
- **Reusable** `<RelationshipCard />` primitive (icon, label, value, deep-link button) consumed by NCR detail, inspection detail, qualification detail, procedure detail.
- **Reusable** `<RiskBadge level="ok|warn|fail" />` + `<DaysUntilChip />` reused across qualifications, procedures, instruments.

---

## Technical notes

- 100% frontend & query work — **no migrations**. All data is already in tables with RLS.
- New components live under `src/components/{dashboard,common,qualifications,procedures,ncrs,inspections,instruments}/`.
- No new intelligence libraries — reuses existing `*-intelligence.ts`, `*-validation.ts`, `*-status.ts`, `*-readiness.ts`, `weld-workflow.ts`.
- Design tokens only — no raw colors, follows `src/styles.css`.
- Each phase ships independently and is small enough to QA visually.

---

## Visible-completion checklist (per phase)

For every phase delivery I will report:
1. **What users will notice** — concrete UI changes.
2. **Pages changed** — file list.
3. **Workflows now operational** — e.g. "click an alert on dashboard → land on filtered welds list".
4. **Backend capabilities now exposed** — e.g. "qualification validation findings now visible on qualification detail".

---

## Proposed delivery order

Phase A → B → C → D → E → F, with a user checkpoint after each.

**Confirm and I'll start with Phase A (Dashboard Operationalization).**
