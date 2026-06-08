# Comprehensive Application Audit & Fix Plan

Scope: frontend & TypeScript only. No database migrations. DB-side findings (e.g. 73 SECURITY DEFINER linter warnings) will be documented in a follow-up report but not migrated.

---

## A. Findings summary

**Security & RLS (code side)**
1. `inspections.trash.tsx` and several modules gate UI by `roles.includes("super_admin")` on the client only. RLS already protects data, but the UX/RPC errors are noisy. → Use a shared `useIsSuperAdmin()` + `<RequireRole>` component; remove duplicated checks.
2. `supabase.from("inspections" as any)` casts bypass generated types in ~6 places. Replace with regenerated `Database` types so column drift is caught at build time.
3. Browser-only `confirm()` / `alert()` used for destructive actions (trash, hard delete). Replace with `AlertDialog` (already present in `src/components/ui/alert-dialog.tsx`) to prevent click-jacking and improve a11y.
4. `onAuthStateChange` in `src/lib/auth.tsx` reloads profile on every event (incl. `TOKEN_REFRESHED`, `INITIAL_SESSION`) — causes redundant fetches. Filter to identity transitions only (`SIGNED_IN | SIGNED_OUT | USER_UPDATED`).
5. Sign-out flow does not `queryClient.cancelQueries()` + `clear()` before `signOut()` — causes 401 storms and stale cached protected data after logout. Apply the canonical 4-step sign-out in `AppLayout`.

**Auth & Routing**
6. App routes have no `errorComponent`/`notFoundComponent` — only `__root.tsx` does. A single failed Supabase read blanks the workspace. Add a small shared `RouteErrorFallback` used by every `/app/*` route file.
7. `app.tsx` gate redirects unauth users via `<Navigate />` (component-level), causing protected content flash before redirect. Move to `beforeLoad` + `redirect()`.
8. Several trash/index routes use `useEffect` + `useState` for data fetching instead of `useQuery` — breaks cache invalidation, doesn't refetch on focus, leaks state on unmount. Convert to `useQuery` with proper `queryKey`.
9. Inspections detail Eye-icon fix is in place but **no other module's row click verified** — audit pass on equipment/instruments/pqrs/projects/welds/pwps/procedures/qualifications/ncrs to confirm Eye + Trash actions navigate correctly.
10. Marketing pages have `head()` metadata but lack `og:image`, `twitter:card`, and canonical link. Add to each leaf marketing route (not root).

**Data integrity (code side)**
11. Soft-delete consistency: `trash` views exist for equipment, instruments, pqrs, projects, pwps, qualifications, welds, inspections, but list pages don't all filter `deleted_at IS NULL` uniformly. Audit each list query and standardize via a shared helper `withActiveRows(query)`.
12. React Query `mutationFn` success handlers don't always `invalidateQueries` for related lists (e.g. trash restore doesn't invalidate the source list). Standardize via small `useSoftDeleteMutation` hook.
13. `as any` casts on RPC calls (`supabase.rpc as any`) — replace with typed RPC names from `Database["public"]["Functions"]`.

**Performance & UX**
14. Tables render full rows without virtualization. For >200-row tenants this will jank. Add pagination (server-side `range()`) to the heaviest tables: welds, inspections, qualifications, audit log.
15. Sidebar always renders all nav items including admin items even when computing role — fine, but `nav_items` is rebuilt every render. Memoize with `useMemo`.
16. No global loading skeletons for tables — most show a spinner. Add `<TableSkeleton rows={8}/>` consistent shimmer.
17. No mobile/RTL audit pass on new Inspection planning UI. Verify `dir="rtl"` propagation through `DynamicInspectionForm` and `ReadinessGauge`.
18. Idle timeout (`IdleTimeoutGuard`) — verify it does the 4-step sign-out (cancel/clear/signOut/navigate) not just `signOut()`.

**SEO (public marketing surface)**
19. Add canonical `<link rel="canonical">`, `og:image`, `twitter:card="summary_large_image"`, JSON-LD `Organization` schema to the root marketing pages.
20. Verify single H1 on each public route; lazy-load below-the-fold imagery.

**Build hygiene**
21. 4 `console.log/error/warn` calls remain in src (excluding error boundaries). Replace with `toast.error` or silent throw.
22. `eslint-disable-next-line` comments in `inspections.trash.tsx` — fix proper dependency array.

---

## B. Execution plan (in order)

### Phase 1 — Shared primitives (low risk, high leverage)
- `src/components/RouteErrorFallback.tsx` — reusable error + not-found components for app routes.
- `src/components/ConfirmDialog.tsx` — `AlertDialog` wrapper; replace all `confirm()` call sites.
- `src/lib/use-soft-delete.ts` — hook that wraps the soft-delete + restore + hard-delete pattern with React Query invalidation.
- `src/lib/use-role.ts` — `useIsSuperAdmin`, `useIsEditor`, `<RequireRole role="super_admin">`.
- `src/components/TableSkeleton.tsx` — consistent shimmer.

### Phase 2 — Auth/sign-out hygiene
- `src/lib/auth.tsx`: filter `onAuthStateChange` to identity events; remove redundant profile reloads.
- `src/components/AppLayout.tsx` sign-out handler: cancel → clear → signOut → `navigate({to:"/login", replace:true})`.
- `src/components/IdleTimeoutGuard.tsx`: same 4-step sequence.
- `src/routes/app.tsx`: move auth check from `<Navigate/>` in component to `beforeLoad` redirect.

### Phase 3 — Per-route hardening
For each route under `src/routes/app.*.tsx`:
- Attach `errorComponent` + (where applicable) `notFoundComponent` from Phase 1.
- Convert any `useEffect`+`useState` fetchers to `useQuery` with stable `queryKey`.
- Replace `confirm()` with `ConfirmDialog`.
- Replace `as any` Supabase casts with typed table/RPC names.

### Phase 4 — List/trash consistency sweep
- Audit 9 list pages (equipment, instruments, pqrs, projects, pwps, qualifications, welds, inspections, procedures) for:
  - `deleted_at IS NULL` filter present
  - Eye-icon → detail route works
  - Trash icon → calls `soft_delete_*` RPC and invalidates
  - Trash sub-page restore invalidates the parent list
- Standardize via `useSoftDeleteMutation` from Phase 1.

### Phase 5 — Performance & UX
- Memoize `nav_items` and `NavList` in `AppLayout`.
- Add server-side pagination (`.range(from,to)` + `count: "exact"`) to welds, inspections, qualifications, audit log.
- Add `<TableSkeleton>` to all list pages.
- Mobile/RTL pass on inspection planning UI.

### Phase 6 — SEO polish (marketing routes only)
For `index`, `about`, `pricing`, `features`, `contact`, `industries`, `modules`, `demo`:
- Add `og:image` (use existing brand asset), `twitter:card`, canonical.
- Add JSON-LD `Organization` schema in root `__root.tsx` head only (single source).
- Ensure single `<h1>` and `loading="lazy"` on below-fold images.

### Phase 7 — Cleanup
- Remove stray `console.*` in src.
- Fix `eslint-disable-next-line` dependency hacks.
- Run typecheck; ensure no regressions.

---

## C. Out of scope (will be reported, not fixed)

A separate `AUDIT_DB.md` will be written into the repo listing items requiring migrations so you can approve them later:
- 73 SECURITY DEFINER functions callable by `anon`/`authenticated` — REVOKE EXECUTE on the ones not meant to be public (e.g. `soft_delete_*`, `restore_*`).
- Leaked-password protection (HIBP) toggle in Auth settings.
- Recommended indexes (e.g. `inspections (company_id, deleted_at, workflow_status)`, `welds (company_id, status)`).
- Foreign-key cascade review on `inspection_*`, `weld_*`, `ncr_*` event tables.

---

## D. Risk & validation

- All changes are additive or refactor-in-place; no schema or RLS edits.
- After each phase: typecheck + spot-check the affected routes in preview.
- Final pass: walk the 9 list pages + their trash sub-pages + 3 detail pages.

Estimated diff: ~25–35 files touched, ~3 new shared files, no removed routes.
