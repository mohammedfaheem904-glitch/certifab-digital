
-- Phase 1: Inspection Lifecycle Foundation

-- 1) New enum for workflow_status
DO $$ BEGIN
  CREATE TYPE public.inspection_workflow_status AS ENUM (
    'Requested','Assigned','In Progress','Pending Review','Accepted','Rejected','NCR Raised','Re-Inspection Required','Closed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Extend inspections table
ALTER TABLE public.inspections
  ADD COLUMN IF NOT EXISTS workflow_status public.inspection_workflow_status NOT NULL DEFAULT 'Requested',
  ADD COLUMN IF NOT EXISTS requested_by uuid,
  ADD COLUMN IF NOT EXISTS requested_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS assigned_to uuid,
  ADD COLUMN IF NOT EXISTS assigned_to_name text,
  ADD COLUMN IF NOT EXISTS assigned_at timestamptz,
  ADD COLUMN IF NOT EXISTS started_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS closed_at timestamptz,
  ADD COLUMN IF NOT EXISTS closed_by uuid,
  ADD COLUMN IF NOT EXISTS parent_inspection_id uuid REFERENCES public.inspections(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS discipline text,
  ADD COLUMN IF NOT EXISTS area text,
  ADD COLUMN IF NOT EXISTS line_no text,
  ADD COLUMN IF NOT EXISTS spool_no text,
  ADD COLUMN IF NOT EXISTS joint_no text,
  ADD COLUMN IF NOT EXISTS wps_id uuid,
  ADD COLUMN IF NOT EXISTS welder_id uuid,
  ADD COLUMN IF NOT EXISTS welder_name text,
  ADD COLUMN IF NOT EXISTS client_requirement_ref text,
  ADD COLUMN IF NOT EXISTS inspection_no text,
  ADD COLUMN IF NOT EXISTS scheduled_for date;

CREATE INDEX IF NOT EXISTS idx_inspections_workflow_status ON public.inspections(company_id, workflow_status);
CREATE INDEX IF NOT EXISTS idx_inspections_assigned_to ON public.inspections(assigned_to);
CREATE INDEX IF NOT EXISTS idx_inspections_parent ON public.inspections(parent_inspection_id);

-- 3) inspection_events (audit trail)
CREATE TABLE IF NOT EXISTS public.inspection_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  kind text NOT NULL,
  actor_id uuid,
  actor_name text,
  comment text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.inspection_events TO authenticated;
GRANT ALL ON public.inspection_events TO service_role;
ALTER TABLE public.inspection_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members read inspection_events" ON public.inspection_events;
CREATE POLICY "members read inspection_events" ON public.inspection_events
  FOR SELECT TO authenticated USING (company_id = current_company_id());

DROP POLICY IF EXISTS "editors insert inspection_events" ON public.inspection_events;
CREATE POLICY "editors insert inspection_events" ON public.inspection_events
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_inspection_events_inspection ON public.inspection_events(inspection_id, created_at DESC);

-- 4) inspection_checklist_items
CREATE TABLE IF NOT EXISTS public.inspection_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  label text NOT NULL,
  field_type text NOT NULL DEFAULT 'pass_fail', -- pass_fail | text | number | checkbox
  required boolean NOT NULL DEFAULT false,
  value_text text,
  value_number numeric,
  value_bool boolean,
  result text, -- Pass | Fail | N/A
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspection_checklist_items TO authenticated;
GRANT ALL ON public.inspection_checklist_items TO service_role;
ALTER TABLE public.inspection_checklist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members read inspection_checklist_items" ON public.inspection_checklist_items;
CREATE POLICY "members read inspection_checklist_items" ON public.inspection_checklist_items
  FOR SELECT TO authenticated USING (company_id = current_company_id());

DROP POLICY IF EXISTS "editors write inspection_checklist_items_i" ON public.inspection_checklist_items;
CREATE POLICY "editors write inspection_checklist_items_i" ON public.inspection_checklist_items
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));

DROP POLICY IF EXISTS "editors write inspection_checklist_items_u" ON public.inspection_checklist_items;
CREATE POLICY "editors write inspection_checklist_items_u" ON public.inspection_checklist_items
  FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

DROP POLICY IF EXISTS "editors write inspection_checklist_items_d" ON public.inspection_checklist_items;
CREATE POLICY "editors write inspection_checklist_items_d" ON public.inspection_checklist_items
  FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_checklist_items_inspection ON public.inspection_checklist_items(inspection_id, sort_order);

-- 5) updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_checklist_items_updated_at ON public.inspection_checklist_items;
CREATE TRIGGER trg_checklist_items_updated_at BEFORE UPDATE ON public.inspection_checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) Workflow transition validation trigger
CREATE OR REPLACE FUNCTION public.validate_inspection_transition()
RETURNS TRIGGER AS $$
DECLARE
  allowed boolean := false;
BEGIN
  IF TG_OP = 'INSERT' THEN RETURN NEW; END IF;
  IF OLD.workflow_status = NEW.workflow_status THEN RETURN NEW; END IF;

  allowed := CASE OLD.workflow_status
    WHEN 'Requested' THEN NEW.workflow_status IN ('Assigned','Rejected','Closed')
    WHEN 'Assigned' THEN NEW.workflow_status IN ('In Progress','Requested','Closed')
    WHEN 'In Progress' THEN NEW.workflow_status IN ('Pending Review','Assigned')
    WHEN 'Pending Review' THEN NEW.workflow_status IN ('Accepted','Rejected','NCR Raised','In Progress')
    WHEN 'Accepted' THEN NEW.workflow_status IN ('Closed','Re-Inspection Required')
    WHEN 'Rejected' THEN NEW.workflow_status IN ('NCR Raised','Re-Inspection Required','Closed')
    WHEN 'NCR Raised' THEN NEW.workflow_status IN ('Re-Inspection Required','Closed')
    WHEN 'Re-Inspection Required' THEN NEW.workflow_status IN ('Assigned','Closed')
    WHEN 'Closed' THEN false
    ELSE true
  END;

  IF NOT allowed THEN
    RAISE EXCEPTION 'Invalid inspection workflow transition: % -> %', OLD.workflow_status, NEW.workflow_status;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_validate_inspection_transition ON public.inspections;
CREATE TRIGGER trg_validate_inspection_transition BEFORE UPDATE OF workflow_status ON public.inspections
  FOR EACH ROW EXECUTE FUNCTION public.validate_inspection_transition();
