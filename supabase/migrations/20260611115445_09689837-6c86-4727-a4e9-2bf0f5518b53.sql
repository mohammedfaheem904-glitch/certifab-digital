
-- ============================================================
-- Collaboration entity enum
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.collab_entity_type AS ENUM (
    'ncr','weld','procedure','pwps','pqr','qualification',
    'inspection','project','capa','rework_job','instrument'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- Permission helper: can the current user read a given record?
-- Mirrors per-table RLS by checking company membership on the parent row.
-- ============================================================
CREATE OR REPLACE FUNCTION public.can_read_entity(
  _entity_type public.collab_entity_type,
  _entity_id uuid
) RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE _cid uuid; _my uuid := public.current_company_id();
BEGIN
  IF _my IS NULL THEN RETURN false; END IF;
  CASE _entity_type
    WHEN 'ncr'           THEN SELECT company_id INTO _cid FROM public.ncrs WHERE id = _entity_id;
    WHEN 'weld'          THEN SELECT company_id INTO _cid FROM public.welds WHERE id = _entity_id;
    WHEN 'procedure'     THEN SELECT company_id INTO _cid FROM public.procedures WHERE id = _entity_id;
    WHEN 'pwps'          THEN SELECT company_id INTO _cid FROM public.pwps WHERE id = _entity_id;
    WHEN 'pqr'           THEN SELECT company_id INTO _cid FROM public.pqrs WHERE id = _entity_id;
    WHEN 'qualification' THEN SELECT company_id INTO _cid FROM public.qualifications WHERE id = _entity_id;
    WHEN 'inspection'    THEN SELECT company_id INTO _cid FROM public.inspections WHERE id = _entity_id;
    WHEN 'project'       THEN SELECT company_id INTO _cid FROM public.projects WHERE id = _entity_id;
    WHEN 'capa'          THEN SELECT company_id INTO _cid FROM public.capa_actions WHERE id = _entity_id;
    WHEN 'rework_job'    THEN SELECT company_id INTO _cid FROM public.rework_jobs WHERE id = _entity_id;
    WHEN 'instrument'    THEN SELECT company_id INTO _cid FROM public.instruments WHERE id = _entity_id;
  END CASE;
  RETURN _cid IS NOT NULL AND _cid = _my;
END $$;

-- ============================================================
-- comments
-- ============================================================
CREATE TABLE public.comments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  entity_type  public.collab_entity_type NOT NULL,
  entity_id    uuid NOT NULL,
  parent_id    uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  author_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  body_md      text NOT NULL,
  body_plain   text NOT NULL,
  category     text,
  edited_at    timestamptz,
  deleted_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_comments_entity ON public.comments (entity_type, entity_id, created_at);
CREATE INDEX idx_comments_parent ON public.comments (parent_id);
CREATE INDEX idx_comments_company ON public.comments (company_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments read in company w/ entity access" ON public.comments
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() AND public.can_read_entity(entity_type, entity_id));

CREATE POLICY "comments insert own" ON public.comments
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND author_id = auth.uid()
    AND public.can_read_entity(entity_type, entity_id)
  );

CREATE POLICY "comments update own or admin" ON public.comments
  FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND (author_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'::public.app_role))
  );

CREATE POLICY "comments delete own or admin" ON public.comments
  FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND (author_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'::public.app_role))
  );

CREATE TRIGGER trg_comments_updated BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- comment_attachments
-- ============================================================
CREATE TABLE public.comment_attachments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id     uuid NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  company_id     uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  storage_bucket text NOT NULL DEFAULT 'record-attachments',
  storage_path   text NOT NULL,
  file_name      text NOT NULL,
  mime_type      text,
  size_bytes     bigint,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_comment_attachments_comment ON public.comment_attachments (comment_id);

GRANT SELECT, INSERT, DELETE ON public.comment_attachments TO authenticated;
GRANT ALL ON public.comment_attachments TO service_role;
ALTER TABLE public.comment_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attachments read in company" ON public.comment_attachments
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id()
         AND EXISTS (SELECT 1 FROM public.comments c WHERE c.id = comment_id));

CREATE POLICY "attachments insert via own comment" ON public.comment_attachments
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND EXISTS (SELECT 1 FROM public.comments c WHERE c.id = comment_id AND c.author_id = auth.uid())
  );

CREATE POLICY "attachments delete own or admin" ON public.comment_attachments
  FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND (EXISTS (SELECT 1 FROM public.comments c WHERE c.id = comment_id AND c.author_id = auth.uid())
         OR public.has_role(auth.uid(), 'super_admin'::public.app_role))
  );

-- ============================================================
-- comment_reactions
-- ============================================================
CREATE TABLE public.comment_reactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id  uuid NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  company_id  uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji       text NOT NULL CHECK (emoji IN ('👍','✅','👀','⚠','❌')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (comment_id, user_id, emoji)
);
CREATE INDEX idx_reactions_comment ON public.comment_reactions (comment_id);

GRANT SELECT, INSERT, DELETE ON public.comment_reactions TO authenticated;
GRANT ALL ON public.comment_reactions TO service_role;
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reactions read in company" ON public.comment_reactions
  FOR SELECT TO authenticated USING (company_id = public.current_company_id());

CREATE POLICY "reactions insert own" ON public.comment_reactions
  FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id() AND user_id = auth.uid());

CREATE POLICY "reactions delete own" ON public.comment_reactions
  FOR DELETE TO authenticated
  USING (company_id = public.current_company_id() AND user_id = auth.uid());

-- ============================================================
-- mentions
-- ============================================================
CREATE TABLE public.mentions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id          uuid NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  company_id          uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  mentioned_user_id   uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  mentioned_role      public.app_role,
  created_at          timestamptz NOT NULL DEFAULT now(),
  CHECK ((mentioned_user_id IS NOT NULL)::int + (mentioned_role IS NOT NULL)::int = 1)
);
CREATE INDEX idx_mentions_comment ON public.mentions (comment_id);
CREATE INDEX idx_mentions_user ON public.mentions (mentioned_user_id);

GRANT SELECT, INSERT ON public.mentions TO authenticated;
GRANT ALL ON public.mentions TO service_role;
ALTER TABLE public.mentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mentions read in company" ON public.mentions
  FOR SELECT TO authenticated USING (company_id = public.current_company_id());

CREATE POLICY "mentions insert via own comment" ON public.mentions
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND EXISTS (SELECT 1 FROM public.comments c WHERE c.id = comment_id AND c.author_id = auth.uid())
  );

-- ============================================================
-- watchers
-- ============================================================
CREATE TABLE public.watchers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  entity_type  public.collab_entity_type NOT NULL,
  entity_id    uuid NOT NULL,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_added   boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (entity_type, entity_id, user_id)
);
CREATE INDEX idx_watchers_entity ON public.watchers (entity_type, entity_id);
CREATE INDEX idx_watchers_user ON public.watchers (user_id);

GRANT SELECT, INSERT, DELETE ON public.watchers TO authenticated;
GRANT ALL ON public.watchers TO service_role;
ALTER TABLE public.watchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "watchers read in company" ON public.watchers
  FOR SELECT TO authenticated USING (company_id = public.current_company_id());

CREATE POLICY "watchers insert own" ON public.watchers
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND user_id = auth.uid()
    AND public.can_read_entity(entity_type, entity_id)
  );

CREATE POLICY "watchers delete own" ON public.watchers
  FOR DELETE TO authenticated
  USING (company_id = public.current_company_id() AND user_id = auth.uid());

-- ============================================================
-- activity_events
-- ============================================================
CREATE TABLE public.activity_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  entity_type  public.collab_entity_type NOT NULL,
  entity_id    uuid NOT NULL,
  kind         text NOT NULL,
  actor_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  summary      text,
  payload      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_activity_entity ON public.activity_events (entity_type, entity_id, created_at DESC);
CREATE INDEX idx_activity_company ON public.activity_events (company_id, created_at DESC);

GRANT SELECT, INSERT ON public.activity_events TO authenticated;
GRANT ALL ON public.activity_events TO service_role;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity read in company" ON public.activity_events
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id()
         AND public.can_read_entity(entity_type, entity_id));

-- Inserts happen via SECURITY DEFINER functions only.
CREATE POLICY "activity insert via definer" ON public.activity_events
  FOR INSERT TO authenticated WITH CHECK (false);

-- ============================================================
-- RPC: post_comment
-- ============================================================
CREATE OR REPLACE FUNCTION public.post_comment(
  _entity_type public.collab_entity_type,
  _entity_id uuid,
  _parent_id uuid,
  _body_md text,
  _body_plain text,
  _category text,
  _mention_user_ids uuid[],
  _mention_roles public.app_role[],
  _attachments jsonb
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _cid uuid := public.current_company_id();
  _uid uuid := auth.uid();
  _cmt uuid;
  _u uuid; _r public.app_role; _att jsonb; _watcher uuid; _parent_author uuid;
  _entity_label text;
  _author_name text;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _cid IS NULL THEN RAISE EXCEPTION 'No company'; END IF;
  IF NOT public.can_read_entity(_entity_type, _entity_id) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF _body_md IS NULL OR length(trim(_body_md)) = 0 THEN RAISE EXCEPTION 'Empty comment'; END IF;

  INSERT INTO public.comments (company_id, entity_type, entity_id, parent_id, author_id, body_md, body_plain, category)
  VALUES (_cid, _entity_type, _entity_id, _parent_id, _uid, _body_md, COALESCE(_body_plain, _body_md), _category)
  RETURNING id INTO _cmt;

  -- Attachments
  IF _attachments IS NOT NULL THEN
    INSERT INTO public.comment_attachments (comment_id, company_id, storage_path, file_name, mime_type, size_bytes)
    SELECT _cmt, _cid,
           x->>'path', x->>'name', x->>'mime', NULLIF(x->>'size','')::bigint
    FROM jsonb_array_elements(_attachments) AS x;
  END IF;

  -- Mentions: users
  IF _mention_user_ids IS NOT NULL THEN
    FOREACH _u IN ARRAY _mention_user_ids LOOP
      INSERT INTO public.mentions (comment_id, company_id, mentioned_user_id)
      VALUES (_cmt, _cid, _u) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;
  -- Mentions: roles
  IF _mention_roles IS NOT NULL THEN
    FOREACH _r IN ARRAY _mention_roles LOOP
      INSERT INTO public.mentions (comment_id, company_id, mentioned_role)
      VALUES (_cmt, _cid, _r);
    END LOOP;
  END IF;

  -- Auto-watch the author
  INSERT INTO public.watchers (company_id, entity_type, entity_id, user_id, auto_added)
  VALUES (_cid, _entity_type, _entity_id, _uid, true)
  ON CONFLICT DO NOTHING;

  -- Activity event
  SELECT COALESCE(display_name, 'Someone') INTO _author_name FROM public.profiles WHERE id = _uid;
  _entity_label := _entity_type::text;
  INSERT INTO public.activity_events (company_id, entity_type, entity_id, kind, actor_id, summary, payload)
  VALUES (_cid, _entity_type, _entity_id,
          CASE WHEN _parent_id IS NULL THEN 'comment_added' ELSE 'comment_reply' END,
          _uid,
          _author_name || ' commented on ' || _entity_label,
          jsonb_build_object('comment_id', _cmt, 'parent_id', _parent_id));

  -- Notifications: mentioned users
  IF _mention_user_ids IS NOT NULL THEN
    FOREACH _u IN ARRAY _mention_user_ids LOOP
      IF _u <> _uid THEN
        INSERT INTO public.notifications (user_id, company_id, kind, title, body, severity, link)
        VALUES (_u, _cid, 'mention',
                _author_name || ' mentioned you',
                left(_body_plain, 200), 'info',
                public.entity_link(_entity_type, _entity_id) || '?comment=' || _cmt::text);
      END IF;
    END LOOP;
  END IF;

  -- Notifications: mentioned roles → all members
  IF _mention_roles IS NOT NULL THEN
    FOREACH _r IN ARRAY _mention_roles LOOP
      FOR _watcher IN
        SELECT DISTINCT ur.user_id FROM public.user_roles ur
        WHERE ur.role = _r AND (ur.company_id IS NULL OR ur.company_id = _cid)
      LOOP
        IF _watcher <> _uid THEN
          INSERT INTO public.notifications (user_id, company_id, kind, title, body, severity, link)
          VALUES (_watcher, _cid, 'mention',
                  _author_name || ' mentioned @' || _r::text,
                  left(_body_plain, 200), 'info',
                  public.entity_link(_entity_type, _entity_id) || '?comment=' || _cmt::text);
        END IF;
      END LOOP;
    END LOOP;
  END IF;

  -- Notifications: parent comment author (reply)
  IF _parent_id IS NOT NULL THEN
    SELECT author_id INTO _parent_author FROM public.comments WHERE id = _parent_id;
    IF _parent_author IS NOT NULL AND _parent_author <> _uid THEN
      INSERT INTO public.notifications (user_id, company_id, kind, title, body, severity, link)
      VALUES (_parent_author, _cid, 'comment_reply',
              _author_name || ' replied to your comment',
              left(_body_plain, 200), 'info',
              public.entity_link(_entity_type, _entity_id) || '?comment=' || _cmt::text);
    END IF;
  END IF;

  -- Notifications: watchers (exclude author + already-mentioned users + parent author)
  FOR _watcher IN
    SELECT w.user_id FROM public.watchers w
    WHERE w.entity_type = _entity_type AND w.entity_id = _entity_id
      AND w.user_id <> _uid
  LOOP
    INSERT INTO public.notifications (user_id, company_id, kind, title, body, severity, link)
    SELECT _watcher, _cid, 'watched_update',
           'New comment on ' || _entity_label,
           left(_body_plain, 200), 'info',
           public.entity_link(_entity_type, _entity_id) || '?comment=' || _cmt::text
    WHERE NOT EXISTS (
      SELECT 1 FROM public.notifications n
      WHERE n.user_id = _watcher AND n.kind = 'mention'
        AND n.link LIKE '%comment=' || _cmt::text
    );
  END LOOP;

  RETURN _cmt;
END $$;

-- Entity link helper
CREATE OR REPLACE FUNCTION public.entity_link(
  _entity_type public.collab_entity_type, _entity_id uuid
) RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE _entity_type
    WHEN 'ncr'           THEN '/app/ncrs/' || _entity_id::text
    WHEN 'weld'          THEN '/app/welds/' || _entity_id::text
    WHEN 'procedure'     THEN '/app/procedures/' || _entity_id::text
    WHEN 'pwps'          THEN '/app/pwps/' || _entity_id::text
    WHEN 'pqr'           THEN '/app/pqrs/' || _entity_id::text
    WHEN 'qualification' THEN '/app/qualifications/' || _entity_id::text
    WHEN 'inspection'    THEN '/app/inspections/' || _entity_id::text
    WHEN 'project'       THEN '/app/projects/' || _entity_id::text
    WHEN 'instrument'    THEN '/app/instruments/' || _entity_id::text
    ELSE '/app'
  END;
$$;

-- ============================================================
-- RPC: toggle_reaction
-- ============================================================
CREATE OR REPLACE FUNCTION public.toggle_reaction(_comment_id uuid, _emoji text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid uuid; _uid uuid := auth.uid(); _existed boolean;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.comments WHERE id = _comment_id;
  IF _cid IS NULL OR _cid <> public.current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF _emoji NOT IN ('👍','✅','👀','⚠','❌') THEN RAISE EXCEPTION 'Invalid emoji'; END IF;
  DELETE FROM public.comment_reactions
   WHERE comment_id = _comment_id AND user_id = _uid AND emoji = _emoji
   RETURNING true INTO _existed;
  IF _existed IS NULL THEN
    INSERT INTO public.comment_reactions (comment_id, company_id, user_id, emoji)
    VALUES (_comment_id, _cid, _uid, _emoji);
    RETURN true;
  END IF;
  RETURN false;
END $$;

-- ============================================================
-- RPC: toggle_watch
-- ============================================================
CREATE OR REPLACE FUNCTION public.toggle_watch(
  _entity_type public.collab_entity_type, _entity_id uuid
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid uuid := public.current_company_id(); _uid uuid := auth.uid(); _existed boolean;
BEGIN
  IF _uid IS NULL OR _cid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT public.can_read_entity(_entity_type, _entity_id) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  DELETE FROM public.watchers
   WHERE entity_type = _entity_type AND entity_id = _entity_id AND user_id = _uid
   RETURNING true INTO _existed;
  IF _existed IS NULL THEN
    INSERT INTO public.watchers (company_id, entity_type, entity_id, user_id, auto_added)
    VALUES (_cid, _entity_type, _entity_id, _uid, false);
    RETURN true;
  END IF;
  RETURN false;
END $$;

-- ============================================================
-- RPC: mark all notifications read (server-side, scoped)
-- ============================================================
CREATE OR REPLACE FUNCTION public.mark_notifications_read(_ids uuid[])
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.notifications SET read_at = now()
  WHERE user_id = auth.uid()
    AND (_ids IS NULL OR id = ANY(_ids))
    AND read_at IS NULL;
$$;

-- ============================================================
-- Realtime
-- ============================================================
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.comment_reactions;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_events;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- Storage policies for record-attachments
-- Path convention: <company_id>/<entity_type>/<entity_id>/<filename>
-- ============================================================
CREATE POLICY "record-attach read own company" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'record-attachments'
    AND (storage.foldername(name))[1]::uuid = public.current_company_id()
  );

CREATE POLICY "record-attach insert own company" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'record-attachments'
    AND (storage.foldername(name))[1]::uuid = public.current_company_id()
    AND owner = auth.uid()
  );

CREATE POLICY "record-attach delete own or admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'record-attachments'
    AND (storage.foldername(name))[1]::uuid = public.current_company_id()
    AND (owner = auth.uid() OR public.has_role(auth.uid(), 'super_admin'::public.app_role))
  );
