## Fix: Team & Roles crash — "Cannot read properties of null (reading 'company_id')"

### Root cause
`src/routes/app.team.tsx` dereferences `profile!.company_id` in several places (the `useQuery` body, the `PendingInvites` render, the `InviteDialog` quota check), but `profile` can be `null` while auth is still loading or when the profile row hasn't been hydrated yet. React renders the component before `profile` is available, triggering the TypeError.

### Change (single file: `src/routes/app.team.tsx`)
1. Pull `loading` from `useAuth()` alongside `profile` / `roles`.
2. Early-return a loading state when `loading || !profile` (spinner matching other pages).
3. Early-return a friendly empty state when `!profile.company_id` (no workspace assigned yet — shouldn't happen for approved users, but defensive).
4. Remove the `profile!.company_id!` non-null assertions now that `profile` and `company_id` are guaranteed past the guard.

No DB, no auth, no route changes. Pure frontend null-safety fix scoped to the Team page.
