# Actionable UX & Operational Guidance Phase

Transform the platform from "showing data" into actively telling users **what to do next, why, and with one click how**. This is a large, cross-cutting initiative — I'll ship it in vertical slices so you can review each one in the UI before the next ships.

## Foundations (Slice 0 — shared engine + primitives)

A single `recommendations` engine drives every module. All UI consumes the same shape so badges, banners, dashboards, and detail pages stay in lockstep.

**`src/lib/recommendations.ts`** — pure functions per entity:
- `recommendForWeld(weld, wps, wpq, inspections, ncrs, instruments, role)`
- `recommendForQualification(q, continuity, welds, role)`
- `recommendForWps(wps, welds, approvals, role)`
- `recommendForNcr(ncr, weld, inspection, role)`
- `recommendForInspection(insp, weld, ncrs, role)`
- `recommendForInstrument(inst, calibrations, role)`

Returns:
```ts
type Recommendation = {
  id: string;
  severity: "critical" | "warning" | "info" | "ok";
  title: string;             // "Renew welder qualification"
  why: string;               // rule + clause + measured fact
  rule?: string;             // "ASME IX QW-452"
  impact: string;            // operational consequence
  remediation: string;       // narrative how-to
  action?: {                 // one-click
    label: string;
    kind: "navigate" | "open-dialog" | "mutation";
    to?: string; search?: Record<string,string>;
    dialog?: "assign-welder"|"pick-wps"|"create-ncr"|"create-inspection"|"request-approval"|"request-calibration";
    payload?: Record<string,unknown>;
  };
  roles?: string[];          // who should act
};
```

Reuses existing intelligence (`weld-readiness.ts`, `weld-matching.ts`, `qualification-validation.ts`, `qualification-status.ts`, `wps-intelligence.ts`) — no duplicate rules, just wraps them into actionable items.

**Shared UI primitives** under `src/components/common/`:
- `<OperationalBanner verdict severity title summary action />` — the 🔴🟠🟢🔵 strip
- `<RecommendedActionsCard recommendations role />` — grouped, prioritised, with one-click buttons
- `<ExplainabilityRow why rule impact remediation />` — collapsible "Why this matters"
- `<SeverityBadge level />` + `<RiskScoreRing value />`
- `<QuickActionDialogs />` — assign welder, pick compatible WPS, create NCR/inspection, request approval/calibration

## Slice 1 — Welds (most operational module)

- Top of `app.welds.$weldId.tsx`: `OperationalBanner` driven by `evaluateReleaseReadiness`.
- `RecommendedActionsCard` between banner and tabs.
- Every finding in `ComplianceCenter` gains the explainability row + one-click remediation.
- Welds list: severity-coloured row + "Next action" column.

## Slice 2 — Qualifications

- Detail banner (Active / Expiring / Expired / Continuity broken) with renew / log-continuity actions.
- Findings panel uses explainability (currently raw text).
- List: risk badge + next-action chip.

## Slice 3 — WPS / Procedures

- Detail banner (Draft / In Review / Approved / Superseded) with request-approval / sign actions.
- Recommendations: missing essential variables, incompatible welds, expiring revision.
- List: compliance score + next-action chip.

## Slice 4 — NCRs & Inspections

- NCR banner: severity + days-open + blocking-weld count + close/assign actions.
- Inspection banner: failed → "Create NCR" one-click; open → "Close inspection".
- Cross-links to the affected weld with readiness impact.

## Slice 5 — Instruments / Calibration

- Banner: In-tolerance / Due-soon / Expired with "Request recalibration" one-click.
- List: risk badge + days-until + affected-welds hint.

## Slice 6 — Decision-Oriented Dashboard

Rebuild `app.index.tsx` around the recommendation engine:
- **Action Queue** (top): top N critical recommendations across all entities, role-filtered, each a one-click row.
- **Risk lanes**: Highest-Risk Welds · Expiring Quals · Blocked Production · Pending Approvals · Open NCR Priorities · Calibration Risks · Release Bottlenecks.
- Keep the existing alert strip but make every tile deep-link into a pre-filtered list (already partially built).

## Slice 7 — Role-aware filtering + polish

- Hook `useUserRole()` so recommendations are filtered to what the current user can actually act on.
- Audit every page for the "What is wrong / Why / Severity / Next / Who / Blocks release" checklist.

---

### Technical notes
- 100% frontend — **no DB migrations**. All inputs already exist in tenant tables.
- Pure functions; covered by unit-style invariants in the engine.
- Design tokens only — semantic colours via `src/styles.css` (`--success`, `--warning`, `--destructive`, `--info`).
- Each slice ships independently and is small enough to QA visually.

### Delivery order
Slice 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7, with a checkpoint after each.

**Confirm and I'll start with Slice 0 (engine + primitives) and Slice 1 (Welds) in the same delivery so you immediately see it in action on a weld detail page.**
