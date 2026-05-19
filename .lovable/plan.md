# Operational UX & End-to-End Workflow

Goal: shift from hidden backend intelligence to **visible, connected, operational UX**. Every change below produces something the user can see and click.

---

## Phase 1 — Weld Workflow Engine (status system + transitions)

**Pages changed**
- `src/routes/app.welds.tsx` (list) — new status badges, quick-action column, sticky bulk action bar.
- `src/routes/app.welds.$weldId.tsx` (detail) — new top-of-page **Workflow Stepper** + **Action Bar**.

**New components**
- `src/components/welds/WeldWorkflowStepper.tsx` — horizontal stepper: Draft → Pending Validation → Awaiting Inspection → NCR Open (conditional) → Ready for Release → Approved / Rejected / Blocked. Click a stage to jump; current/blocked/done states color-coded.
- `src/components/welds/WeldStatusBadge.tsx` — semantic badge per workflow status (replaces ad-hoc badges).
- `src/components/welds/WeldActionBar.tsx` — sticky action bar with context-aware buttons (Submit for validation, Approve, Reject, Release, Reopen) wired to allowed transitions; uses existing `WeldComplianceCheck` to gate Approve.
- `src/components/welds/WeldTimeline.tsx` — reads `weld_events` and renders an activity timeline.

**Database (small, additive)**
- Add `workflow_status` enum + column to `welds` (derived initial value from existing `status`). Add `released_at`, `released_by`, `blocked_reason`. RLS unchanged (inherits welds policies). Audit + event logging via existing `emit_weld_event` trigger.

**What the user sees immediately**
- Each weld now has a visible workflow stage stepper and an Approve/Reject/Release action bar.
- Timeline of every state change with actor + timestamp.

---

## Phase 2 — Interactive Compliance Center & Traceability Graph

**Pages changed**
- `src/routes/app.welds.$weldId.tsx` — new tabs: **Compliance Center**, **Traceability**.

**New components**
- `src/components/welds/ComplianceCenter.tsx` — single canvas combining: WPQ status, WPS compatibility (reuse `evaluateWeldCompatibility`), inspection completion (from `inspections` rows for this weld), calibration validity of any linked instruments, open NCR impact, release-readiness verdict. Each tile shows status icon, score, and a **"Fix this"** deeplink to the source record.
- `src/components/welds/TraceabilityGraph.tsx` — clickable relationship cards laid out as:
  ```text
  Weld → WPS → WPQ → Welder
            ↘ Inspections → NCRs
            ↘ Instruments (calibration)
  ```
  SVG connectors, hover highlights the path, each card navigates to the source route.
- `src/components/welds/ReleaseReadinessGauge.tsx` — circular progress with blocking-issues list.

**What the user sees immediately**
- One screen that answers "can I release this weld?" with a colored gauge and 5–8 status tiles.
- Visual graph of every related record, one click away.

---

## Phase 3 — Operational Dashboard Redesign

**Pages changed**
- `src/routes/app.index.tsx` — full redesign.

**New components**
- `src/components/dashboard/KpiTile.tsx` — KPI tile (label, value, delta, sparkline).
- `src/components/dashboard/ReleaseReadinessPanel.tsx` — production welds grouped by workflow stage, with counts and quick filter links.
- `src/components/dashboard/ExpiringQualificationsPanel.tsx` — list of qualifications expiring in 30/60/90 days.
- `src/components/dashboard/OpenNcrPanel.tsx` — open NCRs by severity, click → NCR detail.
- `src/components/dashboard/InspectionProgressPanel.tsx` — inspection throughput chart (uses existing inspections data).
- `src/components/dashboard/ComplianceScorecard.tsx` — overall % readiness across active projects.
- `src/components/dashboard/OperationalAlerts.tsx` — calibration overdue, qualifications expired, NCRs past due.

Mobile responsiveness: 1-col on `<md`, 2-col `md`, 3-col `xl`. All tiles use design-system tokens, semantic colors.

**What the user sees immediately**
- New executive-style dashboard with live KPIs, release-readiness, expiring items, and alerts — replaces the current minimal index.

---

## Phase 4 — Faster Operational Actions & Polish

**Pages changed**
- `src/components/AppLayout.tsx` — add global search (⌘K) palette: search welds, qualifications, WPS, NCRs, projects; navigate on Enter.
- All list routes (welds, qualifications, procedures, ncrs, instruments) — add row hover quick-action icons (Open, Edit, Status change, Delete) consistent with WPQ/WPS pattern already shipped.
- All detail routes — adopt sticky action bar pattern from `WeldActionBar`.

**New components**
- `src/components/GlobalSearch.tsx` — `cmd+k` palette built on shadcn `Command`.
- `src/components/QuickActionButton.tsx` — shared tooltip icon button used by every list.

**What the user sees immediately**
- `⌘K` global search anywhere.
- Hover any row → consistent quick-action icons.
- Every detail page has a sticky action bar at top.

---

## Technical notes (for review)

- All new SQL is additive; existing RLS, audit triggers, tenant isolation untouched.
- Workflow transitions enforced client-side first; a follow-up DB trigger can lock illegal transitions in a later phase.
- Reuses `wps-intelligence.ts`, `weld-matching.ts`, `qualification-validation.ts` — no new intelligence libraries.
- All components built on shadcn primitives + design tokens in `src/styles.css`; no hardcoded colors.

## Delivery order

I propose shipping in this exact phase order (1 → 4) with one user checkpoint after each phase, so you can react to the visible UX before the next phase builds on it.

**Please confirm I should start with Phase 1** (Weld Workflow Engine — stepper, status system, action bar, timeline, small additive migration). After Phase 1 ships I'll pause for your review before Phase 2.
