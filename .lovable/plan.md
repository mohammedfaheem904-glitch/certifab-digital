
# Engineering Collaboration Layer — v1

Scope: Foundation engine + pilot rollout to **NCRs**, **Welds**, and **WPS (procedures)**. Realtime on. Role-based group mentions. In-app notifications only (email deferred).

---

## 1. Data model (single migration)

All tables: `company_id uuid`, `created_at`, `updated_at`, RLS scoped via `current_company_id()`, GRANTs to `authenticated` + `service_role`, audit triggers where applicable.

**`entity_type` enum** — `ncr`, `weld`, `procedure`, `pwps`, `pqr`, `qualification`, `inspection`, `project`, `capa`, `rework_job`, `instrument` (only first three wired in v1; enum lets us expand without migration).

**`comments`**
- `id`, `company_id`, `entity_type`, `entity_id uuid`, `parent_id uuid null` (self-FK for threading)
- `author_id`, `body_md text`, `body_plain text` (for search/notifications), `edited_at`, `deleted_at`
- Index on `(entity_type, entity_id, created_at)` and `(parent_id)`

**`comment_attachments`**
- `id`, `comment_id`, `company_id`, `storage_bucket`, `storage_path`, `file_name`, `mime_type`, `size_bytes`

**`comment_reactions`**
- `id`, `comment_id`, `company_id`, `user_id`, `emoji text` (constrained: 👍 ✅ 👀 ⚠ ❌)
- Unique `(comment_id, user_id, emoji)`

**`mentions`**
- `id`, `comment_id`, `company_id`, `mentioned_user_id null`, `mentioned_role app_role null`
- Check: exactly one of user/role set

**`watchers`**
- `id`, `company_id`, `entity_type`, `entity_id`, `user_id`, `auto_added bool`
- Unique `(entity_type, entity_id, user_id)`. Author auto-watches on create.

**`activity_events`**
- `id`, `company_id`, `entity_type`, `entity_id`, `kind text`, `actor_id`, `summary text`, `payload jsonb`
- Indexed for entity feeds and global feed.
- Populated by triggers on `comments`, `welds`, `ncrs`, `procedures`, `inspections` (status / workflow changes only — no row-level spam).

**Reuse `notifications`** (already exists). Add new `kind` values: `mention`, `comment_reply`, `watched_update`, `reaction`. Existing approval/workflow kinds remain.

**RLS pattern (all tables):** `company_id = current_company_id()` for SELECT. INSERT requires `author_id/user_id = auth.uid()` and same company. Editing/deleting a comment limited to author OR `has_role(super_admin)`. Reading a comment requires read access to the parent record — enforced via a `can_read_entity(entity_type, entity_id)` SECURITY DEFINER helper that delegates per type (mirrors existing per-table policies).

**Realtime:** `ALTER PUBLICATION supabase_realtime ADD TABLE` for `comments`, `comment_reactions`, `notifications`, `activity_events`.

**Storage:** reuse private bucket `record-attachments` (create if missing) with RLS on `storage.objects` scoped by `company_id` prefix.

## 2. RPCs (SECURITY DEFINER)

- `post_comment(entity_type, entity_id, parent_id, body_md, body_plain, mention_user_ids uuid[], mention_roles app_role[], attachment_paths jsonb)` — inserts comment + attachments + mentions atomically, auto-watches author, fan-out notifications to: mentioned users, role members (via `user_roles`), watchers, parent-comment author (reply). Emits `activity_events` row.
- `toggle_reaction(comment_id, emoji)` — upsert/delete.
- `toggle_watch(entity_type, entity_id)` — add/remove current user.
- `mark_notification_read(id)` / existing `markAllRead` flow already in `useNotifications`.

All RPCs enforce `can_read_entity` before writing.

## 3. Frontend — shared engine

New folder `src/components/collab/`:

- `CollaborationTab.tsx` — wraps Comments + Activity + Watchers for a given `{entityType, entityId}`. Drop-in `<CollaborationTab .../>` on any detail page.
- `CommentList.tsx` — recursive thread renderer (collapsible, unlimited depth, "show N replies").
- `CommentItem.tsx` — author + role badge + time + edited indicator + reactions row + reply button + edit/delete (own).
- `CommentComposer.tsx` — textarea with `@` autocomplete (users in company + role tokens `@QA-Team`, `@Inspectors`, `@Engineering`, `@NDT-Team`, `@Project-Managers`), attachment upload to `record-attachments/{company}/{entity}/{uuid}`, submit via `post_comment` RPC.
- `ReactionsBar.tsx` — 5 fixed emojis with counts and "you reacted" highlight.
- `WatchButton.tsx` — toggle, shows watcher count.
- `ActivityFeed.tsx` — per-entity timeline reading `activity_events` + `comments`.
- `MentionHighlight.tsx` — renders `@name` / `@role` chips in comment body, deep-links.

Hooks in `src/lib/collab/`:
- `useComments(entityType, entityId)` — react-query + realtime subscription, returns nested tree.
- `useActivity(entityType, entityId)`
- `useWatchers(entityType, entityId)`
- `useMentionSuggestions(query)` — queries `profiles` in company + static role list.

## 4. Pilot wiring

- **NCRs** — `src/routes/app.ncrs.$ncrId.tsx`: add "Discussion" and "Activity" tabs using `<CollaborationTab entityType="ncr" entityId={ncrId} />`. Existing `NcrAuditTimeline` stays; new feed sits alongside.
- **Welds** — `src/routes/app.welds.$weldId.tsx`: new "Discussion" tab. Watch button next to QR Verify.
- **WPS / procedures** — `src/routes/app.procedures.$procedureId.tsx`: "Discussion" tab + Approval-discussion section pinned at top of tab (filter `kind='approval'` via a `category` field on comment — added as nullable column).

## 5. Notification Center upgrades

`src/components/NotificationsBell.tsx` + `src/lib/notifications.ts`:
- Add category filter dropdown (Mentions / Approvals / Watched / All).
- Grouping by entity in dropdown.
- Deep links route to `/app/<module>/<id>?comment=<id>` and `CommentList` auto-scrolls + highlights.
- New `/app/notifications` full-page view with filters.

## 6. Global activity page

New route `src/routes/app.activity.tsx` at `/app/activity`:
- Reads `activity_events` (company-scoped) with filters: module, user, date range, kind, search on `summary`.
- Pagination via cursor on `created_at`.

## 7. Dashboard exposure

Add a `CollaborationSummaryCard` to `src/routes/app.index.tsx`:
- Open discussions (entities with comments in last 7d)
- Unread mentions for current user
- Pending approvals (existing)
- Recent activity (existing `RecentActivityFeed` stays)

## 8. Security

- Every read goes through `can_read_entity` helper to inherit per-module RLS.
- Mentions limited to users in the same `company_id`.
- Attachment URLs always signed; bucket private.
- No client-side role checks for posting — enforced in RPC.

## 9. Out of scope (v1)

- Email notifications, mobile push, AI summaries, internal DMs.
- Rich-text editor beyond markdown + `@mentions` (use a lightweight markdown renderer; no TipTap).
- Custom teams table (using role-based groups per your answer).
- Wiring into pWPS, PQR, WPQ, inspections, CAPAs, rework, releases, calibration, projects — engine supports them; routes wired in a follow-up.

## 10. Delivery order

1. Migration (tables + enum + RLS + GRANTs + realtime + RPCs + helper).
2. Storage bucket + policies.
3. Shared hooks + components in `src/components/collab/` and `src/lib/collab/`.
4. Notification center upgrades + `/app/notifications` + `/app/activity`.
5. Wire NCR → Weld → WPS detail routes.
6. Dashboard card.

## Technical notes

- Threading: store `parent_id` only; tree built client-side. Depth unlimited but UI indents cap at ~6 levels then flattens with "↳ replying to @x".
- Realtime: one channel per `(entity_type, entity_id)` for comments/reactions; one per-user channel for notifications (already exists).
- Activity events written via triggers on existing tables (`ncrs`, `welds`, `procedures` status changes) + explicit inserts from `post_comment`. Existing `audit_logs` untouched.
- Reuse existing `notifications` table — no new notification table — to avoid duplicating the bell UI.
