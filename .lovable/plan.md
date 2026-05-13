# Phase 3 — Enterprise Operations & Reporting

This phase is large. To keep quality high, I'll ship it in **two waves** within this loop, prioritizing the items with the highest operational impact. Document management improvements and per-project folder trees are deferred to a follow-up (you previously chose "per-record attachments only" — keeping that scope honest).

---

## Wave 1 — Foundations (ship first)

### 1. Email infrastructure with `system@weldyard.com`
- Set up Lovable Emails on the `weldyard.com` sender domain (DNS dialog if not yet configured).
- Scaffold transactional templates branded "Weld Yard":
  - `qualification-expiry` (30/7/0-day reminders)
  - `procedure-approval-request` (WPS sent for review)
  - `procedure-approval-decision` (approved / rejected)
  - `ncr-raised` (new NCR with severity)
  - `instrument-calibration-due` (30/7/0-day)
- All sends go through `sendTransactionalEmail` helper; idempotency keys per event.

### 2. Notifications Center (in-app)
- New table `notifications` (company_id, user_id, kind, title, body, link, read_at).
- Bell icon in `AppLayout` with unread count, dropdown list, "mark all read", deep-link to source record.
- Realtime subscription on `notifications` filtered by user.
- DB triggers / cron jobs that produce notifications mirror the email events above.

### 3. Cron-driven reminders
- pg_cron daily job at 06:00 UTC scanning `qualifications` and the new `instruments` table; inserts notifications + enqueues emails for 30/7/0-day windows (idempotent via `email_send_log` message_id + a `reminder_sent_log` table).

### 4. Global Audit Log page (`/app/audit`)
- New route reading `audit_logs` with filters: module (table_name), user (actor_id), date range, action.
- CSV/Excel export of filtered rows.
- Diff viewer (before / after JSON) in a side sheet.

### 5. Roles & Team Management UI (`/app/settings/team`)
- Replace the static settings table with live data from `profiles` + `user_roles`.
- Super-admin actions:
  - Invite user by email (Supabase admin invite via server fn using service role).
  - Assign / revoke roles (multi-select of the 6 app roles).
  - Deactivate user (remove from company).
- Role permission matrix card explaining what each role can do (read-only reference).

---

## Wave 2 — Modules & Reporting

### 6. QA/QC Instruments module (`/app/instruments`)
New table `instruments` with: asset_id, name, model, serial_number, manufacturer, category (UT / RT / gauge / coating / pressure / temperature / NDT / other), calibration_due, calibration_status (Calibrated / Due / Overdue, derived), status (Active / Calibration Due / Out of Service), assigned_user_id, assigned_project_id, qr_token.
- List page with search, category + status filters, calibration overview cards (Active / Due in 30d / Overdue).
- Detail page with calibration history table + certificate uploads (`instrument-files` storage bucket, RLS scoped by company).
- QR verification public route `/verify/instrument/{qr_token}` showing read-only calibration status.
- Cron job feeds calibration reminder notifications & emails.

### 7. Reporting System (`/app/reports`)
Six print-ready reports, each as its own route under `/app/reports/{slug}`:
- Welder Qualifications Register
- WPS / PQR Register (with linked PQR refs & approval signatures)
- Weld Traceability (project → weld → procedure → inspection chain)
- Inspection Report (per project, NDT outcomes)
- NCR Register
- Equipment & Instruments Calibration Report

Implementation:
- Shared `ReportShell` component: company logo + name header, report title, generated-at timestamp + user, filter summary, footer with page numbers, print-only CSS.
- "Export PDF" → `window.print()` with a dedicated print stylesheet (industrial-grade, deterministic, no third-party PDF lib needed for MVP).
- "Export Excel" → client-side `xlsx` (SheetJS) of the same dataset.
- Company branding: add `logo_url` + `report_footer` columns to `companies`; logo uploaded via Settings → Company.

### 8. Demo workspace seeder (upgrade)
Extend `src/lib/seed.ts` to populate a polished demo for a fresh company:
- 3 projects (Aramco GOSP-7, ADNOC Ruwais Phase II, Sonatrach Hassi Messaoud).
- 8 WPS (mix of GTAW / SMAW / FCAW, with full parameter envelopes & one fully Approved revision chain).
- 18 welder qualifications (3 expiring within 30 days, 1 expired — to demo reminders).
- 60 weld log entries linked to projects + procedures.
- 25 inspections (VT / PT / RT / UT) with 4 NCRs of varying severity.
- 12 welding machines + 14 QA/QC instruments (UT, RT, gauges, pressure, temperature).
- Dashboard KPIs computed from this data.

---

## Deferred (call out, do not build this round)
- File hub with project folder tree, drag-drop, preview, granular permissions — sticks to per-record attachments for now (your earlier decision). Drag-drop will be added to the existing `FileUploader` as a small UX win.
- AI welding analysis, IoT, real-time monitoring, predictive analytics.

---

## Technical notes (for reviewers)
- All new tables get `company_id`, RLS using `current_company_id()` + `is_editor()`, audit triggers via `write_audit_log()`.
- Email sends use the existing transactional queue (no direct Mailgun calls).
- pg_cron jobs use the documented `apikey`-header pattern hitting `/api/public/hooks/*` server routes.
- Excel export uses `xlsx` (SheetJS community edition, MIT).
- QR codes rendered with `qrcode.react`.

---

## Two questions before I start
1. **Sender address**: you said `system@weldyard.com`. Should reminders use a friendly "Weld Yard System <system@weldyard.com>" From-name, or strictly `system@weldyard.com`?
2. **Invitation flow**: when a super-admin invites a user, do you want them to (a) receive an email magic link to set their password, or (b) be created with a temporary password the admin shares manually? Default recommendation: (a).

Reply with answers (or just "go with defaults") and I'll execute Wave 1 first, then Wave 2.