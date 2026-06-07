## Project Workflow — Lifecycle, Approvals, Traceability

Bring Projects up to the same workflow rigor as Welds/PQRs: a real state machine, approver-gated transitions, full event log, stage timestamps, and a stepper + action bar + timeline on the details page.

### 1. State machine

Stages (linear):
```
Draft → Planning → Approved → In Progress → Closed
                      │            │
                      │            └── On Hold ⇄ In Progress
                      │
                      └── Rejected (branch)
                                   Cancelled (branch, from any non-terminal)
```

Allowed transitions:
- **Draft → Planning** — editor ("Submit for review")
- **Planning → Approved** — super_admin OR qa_qc_manager (sign-off, required)
- **Planning → Rejected** — super_admin OR qa_qc_manager (reason required)
- **Approved → In Progress** — editor ("Kick off")
- **In Progress → On Hold** — editor (reason required)
- **On Hold → In Progress** — editor ("Resume")
- **In Progress → Closed** — super_admin OR qa_qc_manager (sign-off, required; comment optional)
- **Any non-terminal → Cancelled** — super_admin (reason required)
- **Rejected / Cancelled → Draft** — super_admin (reopen)

### 2. Database (single migration)

**Enum**
- New `project_workflow_status` enum with: `Draft`, `Planning`, `Approved`, `In Progress`, `On Hold`, `Closed`, `Rejected`, `Cancelled`.

**`projects` table — new columns**
- `workflow_status project_workflow_status NOT NULL DEFAULT 'Draft'`
- Stage timestamps: `submitted_at`, `approved_at`, `approved_by`, `started_at`, `held_at`, `resumed_at`, `closed_at`, `closed_by`, `rejected_at`, `rejected_by`, `cancelled_at`, `cancelled_by`
- Reason fields: `hold_reason text`, `rejection_reason text`, `cancellation_reason text`
- Backfill: existing rows → `workflow_status` derived from current `status` (`Active`→`In Progress`, `On Hold`→`On Hold`, `Completed`→`Closed`, `Cancelled`→`Cancelled`, else `Draft`).

**New `project_events` table** (mirrors `weld_events` / `instrument_events`)
- Columns: `id`, `company_id`, `project_id`, `kind text` (`created`, `workflow_transition`, `comment`), `actor_id`, `actor_name`, `payload jsonb` (`{from, to, reason, comment}`), `created_at`.
- GRANT `SELECT, INSERT` to `authenticated`; `ALL` to `service_role`.
- RLS:
  - `members read project_events` — `company_id = current_company_id()`
  - `editors insert project_events` — `company_id = current_company_id() AND is_editor(auth.uid())`

**Trigger** `emit_project_workflow_event` on `projects` (mirror of `emit_weld_event`) — inserts into `project_events` on `workflow_status` change.

**RPC `transition_project(_id uuid, _to project_workflow_status, _reason text, _comment text)`** — single security-definer entry point that:
1. Loads project + verifies company.
2. Validates current → target is in the allowed transition table.
3. Enforces role per transition (editor / super_admin / qa_qc_manager).
4. Requires reason where stated (Hold, Reject, Cancel).
5. Updates `workflow_status` + the matching timestamp/actor columns + reason field.
6. Returns void. Trigger writes the event row; RPC also inserts an explicit `audit_logs` entry.

**Closure guardrail (inside `transition_project`):** when target is `Closed`, block if `EXISTS (SELECT 1 FROM ncrs WHERE project_id = _id AND status NOT IN ('Closed','Cancelled'))` or any non-released welds tied to the project — return descriptive error.

**Notifications (inside RPC):**
- On `Draft → Planning` → notify all `super_admin` + `qa_qc_manager` of the company.
- On `Planning → Approved/Rejected`, `In Progress → Closed`, `→ Cancelled` → notify the project creator (or, if absent, all super_admins).

### 3. Frontend

**New file `src/lib/project-workflow.ts`** (mirrors `src/lib/weld-workflow.ts`):
- `ProjectWorkflowStatus` union, `STAGES`, `BRANCH_STATES`, `STATUS_TONE`, `allowedTransitions(status, role)` returning `{ to, label, variant, requires, needsReason, needsApproverRole }[]`.

**New component `src/components/projects/ProjectWorkflowStepper.tsx`** — visual stepper (Draft → Planning → Approved → In Progress → Closed), with On Hold/Rejected/Cancelled rendered as branch chips. Same look as `WeldWorkflowStepper`.

**New component `src/components/projects/ProjectActionBar.tsx`** — renders allowed-transition buttons for the current user/role, opens a confirm dialog (with reason/comment field when required), calls `supabase.rpc("transition_project", ...)`, toasts result, invalidates queries.

**New component `src/components/projects/ProjectTimeline.tsx`** — fetches `project_events` for the project, renders chronological list (icon per `kind`, from→to, actor, comment, time).

**Edit `src/routes/app.projects.$projectId.tsx`** — add:
- Workflow stepper at top (under header).
- Action bar with role-aware buttons.
- New "Timeline" section using `ProjectTimeline`.
- Display `workflow_status` (new `WorkflowBadge` using `STATUS_TONE`) alongside the existing legacy `StatusBadge`.

**Edit `src/routes/app.projects.index.tsx`** — add Workflow Status column + filter (separate from existing legacy Status; keep both during transition). Update KPI strip: Draft / Planning / In Progress / On Hold / Closed.

**Edit `src/routes/app.projects.dashboard.tsx`** — replace status pie with workflow_status pie; add "Awaiting approval" KPI (Planning count) and "On hold" KPI.

### 4. Out of scope

- Editing project fields inline (existing create-only flow stays).
- Per-stage SLA timers or auto-escalations.
- Reassigning project ownership.
- Touching `project_status` enum or removing the legacy `status` column (kept for back-compat; workflow drives state from now on).

### 5. Technical notes

- Reuse `is_editor()` and `has_role(auth.uid(), 'qa_qc_manager')` / `'super_admin'` for gating inside the RPC.
- All transitions go through the single RPC — no direct UPDATEs from the client, so RLS for project UPDATE stays unchanged.
- Event log + audit_logs both written for full traceability.
- No new packages.
