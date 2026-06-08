# DB-Side Audit Findings (Migration Required)

These items were identified by the comprehensive audit but require database migrations and were intentionally out of scope for the frontend-only pass. Approve them as a follow-up.

## Critical / High

1. **73 SECURITY DEFINER functions are EXECUTE-able by `anon` / `authenticated`.**
   Soft-delete and restore helpers (`soft_delete_inspection`, `restore_inspection`, `soft_delete_weld`, `restore_weld`, etc.) enforce role internally, but `EXECUTE` should be REVOKEd from `PUBLIC` / `anon` and granted only to `authenticated`. Public-facing read functions (`get_*_by_qr`, `get_company_branding_by_domain`, `get_invitation`) can stay callable by `anon` but should be re-verified for SQLi safety and minimal column projection.

2. **Leaked-password protection (HIBP) is not enabled** on Supabase Auth. Toggle on via Auth settings to block known-compromised passwords at signup and reset.

3. **Recommended composite indexes** (drives list-page perf at scale):
   - `inspections (company_id, deleted_at, workflow_status)`
   - `welds (company_id, deleted_at, status)`
   - `qualifications (company_id, deleted_at, expiry_date)`
   - `instruments (company_id, deleted_at, calibration_due)`
   - `equipment (company_id, deleted_at, calibration_due)`
   - `audit_logs (company_id, created_at desc)`
   - `notifications (user_id, created_at desc) where seen_at is null`

## Medium

4. **FK cascade review** on `*_events`, `*_attachments`, `*_signatures` — confirm `ON DELETE CASCADE` matches the soft-delete model (events should survive a hard delete only via audit_logs).

5. **`profiles.approval_status` should be an enum**, not free text, to prevent invalid states.

6. **`audit_logs` retention policy** — consider partitioning by month and a scheduled cleanup beyond compliance retention window.

## Notes

- All findings above are visible in the Supabase linter and platform dashboard.
- No data-loss risk; all proposed changes are additive (GRANT/REVOKE, CREATE INDEX, settings toggles).
