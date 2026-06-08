# NCR Operational UX — Phase 4 Plan

No new tables. Reuse existing: `ncrs`, `ncr_events`, `capa_actions`, `rework_jobs`, `inspection_defects`, `inspections`.

## 1. NCR Workflow Stepper
New component `src/components/ncr/NcrWorkflowStepper.tsx`. 8 stages mapped from `ncrs.status` + presence of `capa_actions` / `rework_jobs` rows. Each stage shows: state (done/current/pending), actor (from latest related `ncr_events.actor_user_id` → profile name), timestamp. Mount at top of `app.ncrs.$ncrId.tsx`.

## 2. NCR Sticky Action Bar
New component `src/components/ncr/NcrActionBar.tsx`. Sticky bottom bar (or top under header). Buttons enabled based on current status + role (`is_editor`). Each action is a serverFn in `src/lib/ncr-workflow.functions.ts`:
- `startInvestigation` → status='under_investigation'
- `proposeCorrectiveAction` → opens CAPA dialog, inserts capa_actions, status='corrective_action_proposed'
- `approveCorrectiveAction` → status='awaiting_approval'→'approved' (sets approved_by/approved_at)
- `assignRework` → inserts rework_jobs row, status='rework_required'
- `markReworkComplete` → updates rework_jobs.status='completed', ncrs.status='repaired'
- `requestReInspection` → status='re_inspection_required'
- `closeNcr` → status='closed', closed_at=now

All serverFns: `requireSupabaseAuth`, validate current status → next via state machine, insert into `ncr_events` (event_type, payload, actor_user_id, occurred_at).

## 3. Defect → NCR Traceability
Update defect cards in `app.inspections.$inspectionId.tsx` defect list. Show badge: defect status, linked NCR number+status (via `ncr_defect_links`), buttons: "Open NCR" (if exists, links to `/app/ncrs/$ncrId`), "Create NCR" (if not). Visual connector line/arrow using tailwind.

## 4. CAPA Management UX
On NCR detail, new `CapaSection` showing 3 columns: Open / Overdue / Completed (computed from `due_date`, `status`). Each card: owner (profile), due date, status badge, evidence link (`completion_evidence_url`), effectiveness review field. Aging indicator: colored dot (green <7d, amber 7-30d overdue, red >30d). Inline edit via serverFn.

## 5. Rework Workflow UX
New `ReworkSection`: lists rework_jobs for NCR. Shows assigned welder (profile), repair WPS (link to pwps), repair date, status, re-inspection status. Readiness banner: "Ready for re-inspection" when status='completed' and no re-inspection yet.

## 6. Re-Inspection UX
New `ReInspectionSection` + dialog. Pass / Fail / Conditional Acceptance buttons. On submit: inserts ncr_events of type 're_inspection_result' with payload {result, inspector, comments, attachments[]}. Uses existing `ncr_attachments` for files.

## 7. Governance Banner
`src/components/ncr/GovernanceBanner.tsx` — coloured top banner on NCR list + detail showing aggregate state: open blocking release, capa overdue, re-inspection required, ready for closure.

## 8. Quality Dashboard Exposure
New route `src/routes/app.quality.dashboard.tsx`. KPI cards via single serverFn `getQualityKpis` returning counts. Each card links to filtered list (e.g. `/app/ncrs?status=awaiting_approval`). Add nav entry in app shell.

## 9. Audit Timeline
`NcrAuditTimeline` component — reads `ncr_events` for the NCR ordered by occurred_at, renders vertical timeline with icon per event_type (created, investigation_started, capa_added, capa_completed, rework_started, rework_completed, re_inspection, closed).

## 10. Status Vocabulary Migration?
Existing `ncrs.status` enum likely has fewer values. Will check schema first; if missing values (`under_investigation`, `corrective_action_proposed`, `awaiting_approval`, `rework_required`, `repaired`, `re_inspection_required`), add via ALTER TYPE ADD VALUE migration. This is the only DB change (no new tables).

## Files
- New: `src/components/ncr/{NcrWorkflowStepper,NcrActionBar,GovernanceBanner,CapaSection,ReworkSection,ReInspectionSection,NcrAuditTimeline,DefectNcrCard}.tsx`
- New: `src/lib/ncr-workflow.functions.ts`, `src/lib/quality-kpis.functions.ts`
- New route: `src/routes/app.quality.dashboard.tsx`
- Edit: `src/routes/app.ncrs.$ncrId.tsx`, `src/routes/app.ncrs.tsx`, `src/routes/app.inspections.$inspectionId.tsx`, app shell nav
- Migration: extend `ncr_status` enum if needed; add event_type values

## Out of scope (explicit)
No new tables, no advanced analytics, no PDFs.
