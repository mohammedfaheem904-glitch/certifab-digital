
# Welding Quality Governance Platform — Expansion Plan

This is a very large scope (15+ subsystems). Building it in one shot would produce hundreds of files and an unreviewable migration. I'll deliver it in **6 phases**, each independently shippable. After each phase you review, then I move on.

If you want a different ordering, or want to drop/merge phases, tell me before I start Phase 1.

---

## Phase 1 — Inspection Lifecycle Foundation

**Backend**
- Extend `inspections`: `workflow_status` enum (Requested → Assigned → In Progress → Pending Review → Accepted → Rejected → NCR Raised → Re-Inspection Required → Closed), `requested_by`, `assigned_to`, `assigned_at`, `started_at`, `completed_at`, `reviewed_by`, `closed_at`, `parent_inspection_id` (for re-inspections), `discipline`, `area`, `line_no`, `spool_no`, `joint_no`, `wps_id`, `welder_id`, `client_requirement_ref`.
- New `inspection_events` table (audit trail, mirrors `ncr_events`).
- New `inspection_checklist_items` table (per-inspection results).
- RLS: company-scoped, `is_editor` for writes, all GRANTs.

**Frontend**
- `/app/inspections` redesigned with status pipeline + filters.
- `/app/inspections/$inspectionId` detail page with workflow stepper, action bar (Assign, Start, Submit for Review, Accept, Reject, Raise NCR, Request Re-Inspection, Close), timeline.
- `InspectionWorkflowStepper`, `InspectionActionBar`, `InspectionTimeline` components.

---

## Phase 2 — Inspection Planning & Dynamic Builder

**Backend**
- `inspection_plans` (batch planning: project, area, scope filters, target dates, assignee).
- `inspection_plan_items` (one row per planned weld/joint).
- `inspection_templates` + `inspection_template_fields` (dynamic per inspection type: checklist, measurement, attachment, comment, pass/fail).
- Seed templates for VT, Dimensional, Fit-Up, Welding Surveillance, Final, RT, UT, PT, MT, PMI, Hardness, Hydrotest Witness.

**Frontend**
- `/app/inspections/plan` — batch planner with weld selector and bulk assign.
- `DynamicInspectionForm` renders from template; used inside execution screen.
- Template admin under `/app/admin/inspection-templates`.

---

## Phase 3 — Defect Intelligence + NCR Workflow Expansion

**Backend**
- `defect_catalog` (category, severity, code_reference, recommended_action) seeded with the 10 standard defects.
- `inspection_findings` (links inspection ↔ defect ↔ location ↔ severity ↔ image).
- Extend `ncrs.status` enum to: Open, Under Investigation, Corrective Action Proposed, Awaiting Approval, Rework Required, Repaired, Re-Inspected, Closed, Accepted As-Is.
- Add `ncrs.disposition`, `ncrs.investigation_notes`, `ncrs.accepted_as_is_justification`.

**Frontend**
- Findings table inside inspection detail (pick from defect catalog).
- NCR detail page rebuilt with workflow stepper + action bar matching new statuses.
- Defect library admin screen.

---

## Phase 4 — RCA + CAPA + Rework

**Backend**
- `ncr_rca` (method: 5-Why | Fishbone | Custom, category, data jsonb).
- `capa_actions` (ncr_id, kind: corrective|preventive, owner, due_date, completed_at, effectiveness_review, status).
- `rework_records` (ncr_id, original_weld_id, repair_method, rework_wps_id, welder_id, re_inspection_id, accepted_at).

**Frontend**
- RCA panel on NCR (5-Why ladder, Fishbone categories, custom textarea).
- CAPA tracker tab with owner/due/effectiveness.
- Rework workflow tab linking weld → repair → rework WPS → welder → re-inspection.

---

## Phase 5 — Traceability + Operational Impact

**Backend**
- View/function `weld_quality_graph(weld_id)` returning linked inspections, findings, NCRs, rework, re-inspections, closure.
- Function `ncr_operational_impact(ncr_id)` → affected welds, spools, projects, blocked releases.

**Frontend**
- `TraceabilityGraph` (interactive) on weld and NCR pages.
- `OperationalImpactPanel` on NCR detail (shows blocked items, banner on affected weld/project pages).

---

## Phase 6 — Analytics, Dashboards, Reports

**Frontend**
- `/app/quality/dashboard` — quality score, inspection backlog, NCR backlog, defect heatmap, project ranking, inspector & welder performance, recurring issues.
- `/app/inspections/dashboard` — pass/rejection/NCR/rework rates, defect trends, inspector workload.
- `/app/ncrs/dashboard` — open/overdue, repeat defects/welders/WPSs/projects, RCA trends.

**Reports (PDF)**
- Inspection Report, NCR Report, CAPA Report, Re-Inspection Report, Closure Report.
- All use existing `ReportShell` (QR token, signatures, revision history, EPC engineering format).

---

## Technical notes
- Every new `public.*` table gets `GRANT … TO authenticated; GRANT ALL … TO service_role;` + RLS with `company_id = current_company_id()` and `is_editor` for writes — same pattern as existing modules.
- Status transitions validated client-side in action bars; server-side via triggers in Phase 1's migration.
- All new routes nested under existing `/app` shell — no auth/router changes.
- No edge functions needed; reports render client-side via existing PDF pipeline.
- Mobile-friendly: stepper + action bars collapse into bottom sheet on small viewports.

---

## What I need from you before starting Phase 1

1. **Confirm phased delivery** (one phase per build turn) vs. a different grouping.
2. **Discipline list** — confirm: Welding, Piping, Structural, Mechanical, Electrical, Civil. Add/remove?
3. **Codes to support out-of-the-box** for defect catalog references — ASME B31.3, AWS D1.1, ASME IX. Add API 1104, ISO 5817, others?
4. **Inspector qualifications** to track on inspection records — ASNT Level II, ISO 9712, CSWIP, AWS CWI. OK?

Once you confirm, I'll switch to build mode and ship Phase 1.
