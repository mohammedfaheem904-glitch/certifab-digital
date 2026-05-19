
DO $$ BEGIN
  CREATE TYPE public.weld_workflow_status AS ENUM (
    'Draft','Pending Validation','Awaiting Inspection','NCR Open',
    'Ready for Release','Approved','Released','Rejected','Blocked'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.welds
  ADD COLUMN IF NOT EXISTS workflow_status public.weld_workflow_status NOT NULL DEFAULT 'Draft',
  ADD COLUMN IF NOT EXISTS submitted_for_validation_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid,
  ADD COLUMN IF NOT EXISTS released_at timestamptz,
  ADD COLUMN IF NOT EXISTS released_by uuid,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejected_by uuid,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS blocked_reason text;

-- Derive workflow_status for existing rows (one-time backfill, idempotent)
UPDATE public.welds SET workflow_status =
  CASE
    WHEN status::text = 'Accepted' THEN 'Approved'::public.weld_workflow_status
    WHEN status::text = 'Rejected' THEN 'Rejected'::public.weld_workflow_status
    WHEN status::text = 'Repair' THEN 'NCR Open'::public.weld_workflow_status
    ELSE 'Draft'::public.weld_workflow_status
  END
WHERE workflow_status = 'Draft';

-- Augment the existing event emitter to also log workflow transitions
CREATE OR REPLACE FUNCTION public.emit_weld_event()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.weld_events (company_id, weld_id, kind, actor_id, payload)
    VALUES (NEW.company_id, NEW.id, 'created', auth.uid(),
      jsonb_build_object('status', NEW.status, 'workflow_status', NEW.workflow_status));
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.weld_events (company_id, weld_id, kind, actor_id, payload)
      VALUES (NEW.company_id, NEW.id, 'status_change', auth.uid(),
        jsonb_build_object('from', OLD.status, 'to', NEW.status));
    END IF;
    IF NEW.workflow_status IS DISTINCT FROM OLD.workflow_status THEN
      INSERT INTO public.weld_events (company_id, weld_id, kind, actor_id, payload)
      VALUES (NEW.company_id, NEW.id, 'workflow_transition', auth.uid(),
        jsonb_build_object('from', OLD.workflow_status, 'to', NEW.workflow_status,
                            'reason', COALESCE(NEW.rejection_reason, NEW.blocked_reason)));
    END IF;
  END IF;
  RETURN NEW;
END $$;

REVOKE EXECUTE ON FUNCTION public.emit_weld_event() FROM anon;
