
-- 1. Enum
DO $$ BEGIN
  CREATE TYPE public.project_workflow_status AS ENUM
    ('Draft','Planning','Approved','In Progress','On Hold','Closed','Rejected','Cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Columns on projects
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS workflow_status public.project_workflow_status NOT NULL DEFAULT 'Draft',
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid,
  ADD COLUMN IF NOT EXISTS started_at timestamptz,
  ADD COLUMN IF NOT EXISTS held_at timestamptz,
  ADD COLUMN IF NOT EXISTS resumed_at timestamptz,
  ADD COLUMN IF NOT EXISTS closed_at timestamptz,
  ADD COLUMN IF NOT EXISTS closed_by uuid,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejected_by uuid,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_by uuid,
  ADD COLUMN IF NOT EXISTS hold_reason text,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS cancellation_reason text;

-- Backfill workflow_status from legacy status (only for rows still at Draft default)
UPDATE public.projects SET workflow_status =
  CASE status::text
    WHEN 'Active' THEN 'In Progress'::public.project_workflow_status
    WHEN 'On Hold' THEN 'On Hold'::public.project_workflow_status
    WHEN 'Completed' THEN 'Closed'::public.project_workflow_status
    WHEN 'Cancelled' THEN 'Cancelled'::public.project_workflow_status
    WHEN 'Planning' THEN 'Planning'::public.project_workflow_status
    ELSE 'Draft'::public.project_workflow_status
  END
WHERE workflow_status = 'Draft';

-- 3. project_events table
CREATE TABLE IF NOT EXISTS public.project_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  project_id uuid NOT NULL,
  kind text NOT NULL,
  actor_id uuid,
  actor_name text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.project_events TO authenticated;
GRANT ALL ON public.project_events TO service_role;

ALTER TABLE public.project_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members read project_events" ON public.project_events;
CREATE POLICY "members read project_events" ON public.project_events
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

DROP POLICY IF EXISTS "editors insert project_events" ON public.project_events;
CREATE POLICY "editors insert project_events" ON public.project_events
  FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id() AND public.is_editor(auth.uid()));

CREATE INDEX IF NOT EXISTS project_events_project_idx ON public.project_events (project_id, created_at DESC);

-- 4. Trigger to auto-log workflow changes
CREATE OR REPLACE FUNCTION public.emit_project_workflow_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.project_events (company_id, project_id, kind, actor_id, payload)
    VALUES (NEW.company_id, NEW.id, 'created', auth.uid(),
      jsonb_build_object('workflow_status', NEW.workflow_status));
  ELSIF TG_OP = 'UPDATE' AND NEW.workflow_status IS DISTINCT FROM OLD.workflow_status THEN
    INSERT INTO public.project_events (company_id, project_id, kind, actor_id, payload)
    VALUES (NEW.company_id, NEW.id, 'workflow_transition', auth.uid(),
      jsonb_build_object(
        'from', OLD.workflow_status,
        'to', NEW.workflow_status,
        'reason', COALESCE(NEW.hold_reason, NEW.rejection_reason, NEW.cancellation_reason)
      ));
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_emit_project_workflow_event ON public.projects;
CREATE TRIGGER trg_emit_project_workflow_event
AFTER INSERT OR UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.emit_project_workflow_event();

-- 5. The single transition RPC
CREATE OR REPLACE FUNCTION public.transition_project(
  _id uuid,
  _to public.project_workflow_status,
  _reason text DEFAULT NULL,
  _comment text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _cid uuid;
  _from public.project_workflow_status;
  _now timestamptz := now();
  _uid uuid := auth.uid();
  _is_super boolean;
  _is_qaqc boolean;
  _is_editor boolean;
  _can_approve boolean;
  _open_ncrs int;
  _admin uuid;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT company_id, workflow_status INTO _cid, _from FROM public.projects WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Project not found'; END IF;
  IF _cid <> public.current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;

  _is_super  := public.has_role(_uid, 'super_admin'::public.app_role);
  _is_qaqc   := public.has_role(_uid, 'qa_qc_manager'::public.app_role);
  _is_editor := public.is_editor(_uid);
  _can_approve := _is_super OR _is_qaqc;

  -- Validate transitions + role gates
  IF _from = _to THEN RAISE EXCEPTION 'Project is already %', _to; END IF;

  IF _from = 'Draft' AND _to = 'Planning' THEN
    IF NOT _is_editor THEN RAISE EXCEPTION 'Editor role required'; END IF;
  ELSIF _from = 'Planning' AND _to = 'Approved' THEN
    IF NOT _can_approve THEN RAISE EXCEPTION 'Approver role required (super_admin or QA/QC manager)'; END IF;
  ELSIF _from = 'Planning' AND _to = 'Rejected' THEN
    IF NOT _can_approve THEN RAISE EXCEPTION 'Approver role required'; END IF;
    IF _reason IS NULL OR length(trim(_reason)) = 0 THEN RAISE EXCEPTION 'Reason required to reject'; END IF;
  ELSIF _from = 'Approved' AND _to = 'In Progress' THEN
    IF NOT _is_editor THEN RAISE EXCEPTION 'Editor role required'; END IF;
  ELSIF _from = 'In Progress' AND _to = 'On Hold' THEN
    IF NOT _is_editor THEN RAISE EXCEPTION 'Editor role required'; END IF;
    IF _reason IS NULL OR length(trim(_reason)) = 0 THEN RAISE EXCEPTION 'Reason required to hold'; END IF;
  ELSIF _from = 'On Hold' AND _to = 'In Progress' THEN
    IF NOT _is_editor THEN RAISE EXCEPTION 'Editor role required'; END IF;
  ELSIF _from = 'In Progress' AND _to = 'Closed' THEN
    IF NOT _can_approve THEN RAISE EXCEPTION 'Approver role required to close'; END IF;
    SELECT count(*) INTO _open_ncrs FROM public.ncrs
      WHERE project_id = _id AND status NOT IN ('Closed','Cancelled');
    IF _open_ncrs > 0 THEN
      RAISE EXCEPTION 'Cannot close: % open NCR(s) must be resolved first', _open_ncrs;
    END IF;
  ELSIF _to = 'Cancelled' AND _from NOT IN ('Closed','Cancelled','Rejected') THEN
    IF NOT _is_super THEN RAISE EXCEPTION 'Super admin role required to cancel'; END IF;
    IF _reason IS NULL OR length(trim(_reason)) = 0 THEN RAISE EXCEPTION 'Reason required to cancel'; END IF;
  ELSIF _to = 'Draft' AND _from IN ('Rejected','Cancelled') THEN
    IF NOT _is_super THEN RAISE EXCEPTION 'Super admin role required to reopen'; END IF;
  ELSE
    RAISE EXCEPTION 'Transition % -> % not allowed', _from, _to;
  END IF;

  -- Apply
  UPDATE public.projects SET
    workflow_status = _to,
    updated_at = _now,
    submitted_at = CASE WHEN _to = 'Planning'    THEN _now ELSE submitted_at END,
    approved_at  = CASE WHEN _to = 'Approved'    THEN _now ELSE approved_at  END,
    approved_by  = CASE WHEN _to = 'Approved'    THEN _uid ELSE approved_by  END,
    started_at   = CASE WHEN _to = 'In Progress' AND started_at IS NULL THEN _now ELSE started_at END,
    held_at      = CASE WHEN _to = 'On Hold'     THEN _now ELSE held_at END,
    resumed_at   = CASE WHEN _from = 'On Hold' AND _to = 'In Progress' THEN _now ELSE resumed_at END,
    closed_at    = CASE WHEN _to = 'Closed'      THEN _now ELSE closed_at END,
    closed_by    = CASE WHEN _to = 'Closed'      THEN _uid ELSE closed_by END,
    rejected_at  = CASE WHEN _to = 'Rejected'    THEN _now ELSE rejected_at END,
    rejected_by  = CASE WHEN _to = 'Rejected'    THEN _uid ELSE rejected_by END,
    cancelled_at = CASE WHEN _to = 'Cancelled'   THEN _now ELSE cancelled_at END,
    cancelled_by = CASE WHEN _to = 'Cancelled'   THEN _uid ELSE cancelled_by END,
    hold_reason         = CASE WHEN _to = 'On Hold'  THEN _reason WHEN _to = 'In Progress' THEN NULL ELSE hold_reason END,
    rejection_reason    = CASE WHEN _to = 'Rejected' THEN _reason WHEN _to = 'Draft' THEN NULL ELSE rejection_reason END,
    cancellation_reason = CASE WHEN _to = 'Cancelled'THEN _reason WHEN _to = 'Draft' THEN NULL ELSE cancellation_reason END
  WHERE id = _id;

  -- Add comment as a separate event when provided
  IF _comment IS NOT NULL AND length(trim(_comment)) > 0 THEN
    INSERT INTO public.project_events (company_id, project_id, kind, actor_id, payload)
    VALUES (_cid, _id, 'comment', _uid, jsonb_build_object('to', _to, 'comment', _comment));
  END IF;

  -- Audit log
  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, after)
  VALUES (_cid, 'projects', _id, 'workflow_transition', _uid,
    jsonb_build_object('from', _from, 'to', _to, 'reason', _reason, 'comment', _comment));

  -- Notifications
  IF _to = 'Planning' THEN
    FOR _admin IN
      SELECT user_id FROM public.user_roles
      WHERE company_id = _cid AND role IN ('super_admin'::public.app_role,'qa_qc_manager'::public.app_role)
    LOOP
      INSERT INTO public.notifications (user_id, company_id, kind, title, body, severity, link)
      VALUES (_admin, _cid, 'project_pending_approval',
        'Project awaiting approval',
        'A project has been submitted for review.',
        'info', '/app/projects/' || _id::text);
    END LOOP;
  ELSIF _to IN ('Approved','Rejected','Closed','Cancelled') THEN
    FOR _admin IN
      SELECT user_id FROM public.user_roles
      WHERE company_id = _cid AND role = 'super_admin'::public.app_role
    LOOP
      INSERT INTO public.notifications (user_id, company_id, kind, title, body, severity, link)
      VALUES (_admin, _cid, 'project_workflow',
        'Project ' || _to,
        'A project moved to ' || _to || '.',
        CASE WHEN _to IN ('Rejected','Cancelled') THEN 'warning' ELSE 'success' END,
        '/app/projects/' || _id::text);
    END LOOP;
  END IF;
END $$;

GRANT EXECUTE ON FUNCTION public.transition_project(uuid, public.project_workflow_status, text, text) TO authenticated;
