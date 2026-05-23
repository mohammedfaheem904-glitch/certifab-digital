# Dynamic WPS Builder — Transformation Plan

Scope is large. Proposing a phased rollout so each phase is shippable and reviewable. Confirm the phasing before I start, or tell me to compress/expand.

## Phase 1 — Relational schema foundation

New tables (all tenant-scoped via `company_id`, RLS mirroring `procedures`):

- `wps_joints` — groove, joint design, backing, progression, sketch ref, notes (per WPS, many)
- `wps_positions` — position, qualified range
- `wps_preheat_entries` — temp ranges, method, interpass, applicability
- `wps_techniques` — string/weave, cleaning, back gouging, peening, pass type, electrode mode, automation
- `wps_shielding_gases` — process FK, gas type, composition, flow rate, purge gas
- `wps_pwht` — temp, hold time, heating/cooling rate, applicability
- `wps_signatures` — role, name, signed_at, signature_data_url (mirrors qualification_signatures)
- `wps_notes` — categorized notes (engineering, QA, field)
- `wps_variables` — code_reference, group, variable_key, label, category (essential / supplementary / non-essential), qualified_value, actual_range

Existing tables kept and extended where needed: `wps_base_metals`, `wps_filler_metals`, `wps_electrical_characteristics`, `procedure_approvals`, `procedure_revisions`, `procedure_attachments`.

Each table: audit trigger, editors CRUD policy, members read policy.

## Phase 2 — Dynamic form engine

- New `src/lib/wps-schema.ts` — declarative section/field registry keyed by `(process, code_family, joint_type, pipe_or_plate, automation)`.
- New `src/lib/wps-rules.ts` — show/hide + required logic (e.g. GTAW → tungsten + purge gas; SMAW hides gas; multi-process groups fields per process).
- New `src/components/procedures/builder/` — generic `<DynamicSection>`, `<DynamicField>`, `<ProcessTabs>` that render from the schema rather than hardcoded JSX.
- Process-aware variable generator that seeds `wps_variables` from ASME IX QW-250 tables for the selected process.

## Phase 3 — Engineering intelligence layer

Extend `src/lib/wps-intelligence.ts`:

- Variable dependency graph (e.g. polarity ↔ process ↔ filler class)
- Parameter compatibility validator (filler F-No ↔ base metal P-No matrix)
- Parameter drift detection vs supporting PQR
- Readiness score (already present, extend with new categories)
- Production impact severity classification
- Compliance findings surface in `WpsCompliancePanel` (already exists)

## Phase 4 — Build WPS Workspace

Rework `src/routes/app.procedures.$procedureId.tsx`:

- Multi-step stepper (Header → Joints → Base metals → Fillers → Electrical → Thermal → Technique → Variables → Sign-off)
- Autosave (debounced mutation per section)
- Draft/Review/Approved workflow already exists — wire to stepper
- Live readiness gauge in sidebar (mirrors weld workspace)
- "Duplicate as revision" and "Import from previous WPS" actions
- Guidance strip per step

## Phase 5 — WPS Dashboard

New route `src/routes/app.procedures.dashboard.tsx`:

- KPI cards: Active / Draft / Approved / Rejected / Expiring
- Approval bottleneck list (submitted >N days)
- Parameter drift alerts (from intelligence layer)
- Most-used WPSs (join on `welds.procedure_id`)
- Process distribution chart (recharts)
- Readiness score histogram

Sidebar link added; tab on procedures index.

## Phase 6 — Professional PDF export

Extend `src/components/reports/WpsDocument.tsx`:

- Print modes: Client / Internal QA / Full Technical / Approval (variant prop)
- Repeatable thead/tfoot for multi-page tables
- Joint sketches rendered from `wps-sketches` storage bucket
- Watermark layer (DRAFT / CONTROLLED / FOR APPROVAL)
- QR verification block (already wired via `get_wps_by_qr`)
- Excel export via `xlsx` (new dep) — flat rows per relational table

Action menu on WPS detail: "Export → PDF (Client/Internal/Technical/Approval) / Excel".

## Phase 7 — Discoverability

- Spotlight tip on first dashboard visit
- Command palette entries: "New WPS", "Open WPS Dashboard", "Duplicate WPS"
- Smart empty states with CTA
- NEW pill on Dashboard + Builder menu items
- Contextual operational banner when drift detected

## Technical notes

- All server-side reads/writes go through `createServerFn` (`requireSupabaseAuth`) — no direct supabase calls from new components beyond existing patterns.
- Schema-driven renderer keeps section components <150 lines.
- Phase 1 migration is a single SQL migration with all tables + RLS + triggers.
- Phase 6 needs `bun add xlsx`.
- Existing eye-icon navigation already fixed; Phase 4 supersedes that detail page.

## Suggested delivery order

I recommend shipping **Phase 1 + Phase 2 (schema + dynamic engine)** first as one PR — it's the foundation everything else builds on. Then Phase 4 (workspace), then 3/5/6/7 in parallel-able chunks.

**Reply with one of:**
1. "Approved, start Phase 1+2" — I begin with the migration and form engine
2. "Do it all in sequence" — I execute every phase end-to-end (long single run)
3. Edits to scope/phasing
