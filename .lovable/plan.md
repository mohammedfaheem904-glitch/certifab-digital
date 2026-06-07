## Projects module — full upgrade

Bring Projects up to parity with Instruments/PQRs: dashboard, filters/search, bulk export, soft-delete trash, and a details view opened via an eye icon. Same UX patterns already used elsewhere in the app — no new libraries.

### 1. Database (migration)

Projects table currently has no soft-delete fields. Add:
- `deleted_at timestamptz`, `deleted_by uuid` on `public.projects`
- RPCs `soft_delete_project(_id uuid)` and `restore_project(_id uuid)` (security definer, editor-only, scoped to `current_company_id()`)
- Update RLS `company members read projects` to also require `deleted_at IS NULL`
- Add policy `super_admin reads deleted projects` (mirrors instruments)

### 2. Routing restructure

Convert the single `src/routes/app.projects.tsx` page into a layout + children, matching `app.instruments.*`:

- `app.projects.tsx` → layout: `() => <Outlet />`
- `app.projects.index.tsx` → main list (new behavior below)
- `app.projects.dashboard.tsx` → KPIs + charts
- `app.projects.$projectId.tsx` → details view
- `app.projects.trash.tsx` → soft-deleted projects (super_admin)

### 3. Projects list (`app.projects.index.tsx`)

- **Search**: code, name, client, location, description
- **Filters**: Client (distinct), Location (distinct), Status (`Active`, `On Hold`, `Completed`, `Archived` — from existing `project_status` enum), with Reset
- **Bulk export**: checkboxes per row + "select all filtered"; Export Excel (all filtered) and Export selected
- **Row actions**: eye icon → details, trash icon → soft-delete (confirm + toast)
- **KPI strip**: Total / Active / On Hold / Completed (filtered counts)
- **Header**: "Dashboard" button (→ `/app/projects/dashboard`), "Trash" button (→ `/app/projects/trash`), keep existing `NewRecordDialog` "New Project"

### 4. Projects dashboard (`app.projects.dashboard.tsx`)

Mirror PQR dashboard layout:
- KPIs: Total, Active, On Hold, Completed, Archived, Clients (distinct count)
- Pie: Status distribution
- Pie: Top clients
- Bar: Projects created — last 12 months
- Table: Recently created (10)

### 5. Project details (`app.projects.$projectId.tsx`)

Read-only project overview:
- Header: code, name, status badge, back link
- Cards: client, location, description, dates, created/updated
- Related counts (read-only): welds, inspections, NCRs, instruments assigned (count queries scoped by `project_id`/`assigned_project_id`)
- Soft-delete button (editors)

### 6. Trash (`app.projects.trash.tsx`)

Mirror `app.instruments.trash.tsx`: list soft-deleted projects, Restore + permanent Delete (super_admin only).

### Technical notes

- Reuse `useCompanyRows("projects")` for the list; filter `deleted_at IS NULL` happens in RLS after migration.
- Reuse `exportExcel` from `@/lib/export`.
- Reuse `StatusBadge`, `ModulePage`, shadcn `Select`, `Checkbox`, `Button`, `Dialog`.
- No changes to `NewRecordDialog` or its quota wiring.
- Sidebar nav unchanged (existing "Projects" link goes to `/app/projects`, which resolves to the index child).

### Out of scope

- Editing projects inline (kept as-is; only create + soft-delete in this pass).
- Changing project_status enum values.
- Per-project welds/inspection list views (only counts on details).
