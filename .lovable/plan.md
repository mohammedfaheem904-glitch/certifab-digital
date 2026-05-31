# Approval-based user onboarding

Today, anyone who signs up (or accepts an invitation) is immediately added to a workspace with a role and full access. We'll change this so every brand-new member sits in **Pending Approval** until a workspace admin (super_admin) approves them.

## Behavior changes

1. **Signup** — User submits the signup form (new workspace, invitation, or email-domain auto-join). Account is created, but profile is marked `approval_status = 'pending'`. No app role is granted yet.
2. **First login while pending** — User sees a full-screen message:
   > "Your account is awaiting administrator approval."
   with a Sign out button. They cannot reach any `/app/*` feature.
3. **Admin notification** — A row is written to the existing `notifications` table targeted at all super_admins of the company so the bell badge lights up. The new "User Management" page is also linked from the admin sidebar with a pending-count badge.
4. **Admin reviews** — On the User Management page the admin sees the requester's name, email, job title, signup date, and (if invited) the invitation role / inviter. They can:
   - **Approve** — pick a role (defaulting to the invited role or `client_viewer`), which grants `user_roles` and sets status to `approved`.
   - **Reject** — sets status to `rejected` with optional reason. User stays signed-out-capable but blocked from the app.
5. **Rejected user login** — Sees: "Your account request was not approved." with Sign out.
6. **Workspace owner exception** — The very first user who creates a brand-new workspace is auto-approved as `super_admin` (otherwise nobody could approve them).

## User Management page (`/app/admin/users`)

Super-admin only. Three tabs:
- **Pending** (default) — Approve / Reject actions, role picker.
- **Approved** — Existing members, with current roles (links over to the existing Team page for role edits).
- **Rejected** — Option to re-approve.

Each row: avatar, name, email, job title, signup date, source (new workspace / invitation / email-domain), and contextual actions.

## Technical details

**Database migration**
- Add `public.approval_status` enum: `pending | approved | rejected`.
- `ALTER TABLE public.profiles ADD COLUMN approval_status approval_status NOT NULL DEFAULT 'pending'`, plus `approved_at`, `approved_by`, `rejected_at`, `rejected_by`, `rejection_reason`, `pending_role app_role` (used to remember the invitation/auto-join role until approval).
- Backfill all existing profiles to `'approved'` so current users keep access.
- Update `public.handle_new_user()`:
  - Invitation path: create profile as `pending`, store `_inv.role` in `pending_role`, DO NOT insert into `user_roles`, DO NOT mark invitation accepted yet (mark on approval).
  - Email-domain path: same, `pending_role = 'client_viewer'`.
  - New-workspace path: create profile as `approved`, insert `super_admin` into `user_roles` (unchanged behavior for owner).
- New SECURITY DEFINER RPCs (company-scoped, super_admin gated via `has_role`):
  - `approve_user(_user_id uuid, _role app_role)` → inserts `user_roles`, sets `approval_status='approved'`, marks the matching invitation accepted if any, writes audit log.
  - `reject_user(_user_id uuid, _reason text)` → sets `approval_status='rejected'`, writes audit log.
- Update `public.accept_invitation()` similarly (it currently grants the role outright) so manual token acceptance also goes through approval.
- Add a notification trigger on `profiles` INSERT when `approval_status='pending'` that fans out a `notifications` row to every super_admin of that company.
- Tighten RLS: existing per-table policies already require `current_company_id()`. We'll add a check that the requester is approved — a new helper `public.is_approved(uuid)` and update `is_editor` / `has_role` is overkill; instead we add a single guard policy by updating `current_company_id()` to return NULL when not approved, which transparently blocks all company-scoped reads/writes.

**Frontend**
- `src/lib/auth.tsx` — load `approval_status` into the profile state.
- `src/routes/app.tsx` — after the session check, branch on `profile.approval_status`:
  - `pending` → render `<PendingApprovalScreen />`
  - `rejected` → render `<RejectedScreen />`
  - `approved` → existing AppLayout
- New `src/components/PendingApprovalScreen.tsx` and `RejectedScreen.tsx` (simple centered cards with Sign out).
- New route `src/routes/app.admin.users.tsx` with tabs (Pending / Approved / Rejected), approve/reject dialogs calling the RPCs via `supabase.rpc(...)`. Super-admin gated like the existing `/app/admin` page.
- Add a "User approvals" link in the admin sidebar with a count badge of pending users.
- `src/routes/accept-invite.tsx` — after `accept_invitation` RPC, route the user to the pending screen instead of `/app`.

**Out of scope**
- No email notifications to admins (in-app notification only). Can be added later if you want.
- Existing users (including all current invitations already accepted) are grandfathered as approved.

## Open question

Should the **first signup against an existing invitation** also require admin approval? The plan above says **yes** (consistent rule: every new member is reviewed). If you'd rather invited users skip approval (since the admin already vetted them when inviting), say the word and I'll drop the invitation path from the pending flow.
