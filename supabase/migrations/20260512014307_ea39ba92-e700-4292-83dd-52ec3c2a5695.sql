
-- =========================================================
-- Procedures: extend with WPS limits and workflow metadata
-- =========================================================
ALTER TABLE public.procedures
  ADD COLUMN IF NOT EXISTS voltage_min numeric,
  ADD COLUMN IF NOT EXISTS voltage_max numeric,
  ADD COLUMN IF NOT EXISTS current_min numeric,
  ADD COLUMN IF NOT EXISTS current_max numeric,
  ADD COLUMN IF NOT EXISTS travel_speed_min numeric,  -- mm/min
  ADD COLUMN IF NOT EXISTS travel_speed_max numeric,
  ADD COLUMN IF NOT EXISTS heat_input_min numeric,    -- kJ/mm
  ADD COLUMN IF NOT EXISTS heat_input_max numeric,
  ADD COLUMN IF NOT EXISTS base_material text,
  ADD COLUMN IF NOT EXISTS filler_material text,
  ADD COLUMN IF NOT EXISTS shielding_gas text,
  ADD COLUMN IF NOT EXISTS joint_type text,
  ADD COLUMN IF NOT EXISTS position text,
  ADD COLUMN IF NOT EXISTS preheat_temp text,
  ADD COLUMN IF NOT EXISTS interpass_temp text,
  ADD COLUMN IF NOT EXISTS pwht text,
  ADD COLUMN IF NOT EXISTS submitted_for_review_at timestamptz,
  ADD COLUMN IF NOT EXISTS submitted_by uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid;

-- Extend procedure_status enum (Draft already exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='Review' AND enumtypid='procedure_status'::regtype) THEN
    ALTER TYPE procedure_status ADD VALUE 'Review';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='Rejected' AND enumtypid='procedure_status'::regtype) THEN
    ALTER TYPE procedure_status ADD VALUE 'Rejected';
  END IF;
END $$;

-- =========================================================
-- procedure_revisions
-- =========================================================
CREATE TABLE IF NOT EXISTS public.procedure_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id uuid NOT NULL REFERENCES public.procedures(id) ON DELETE CASCADE,
  company_id uuid NOT NULL,
  revision text NOT NULL,
  change_summary text,
  snapshot jsonb NOT NULL,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_proc_rev_proc ON public.procedure_revisions(procedure_id);
ALTER TABLE public.procedure_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read procedure_revisions" ON public.procedure_revisions
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert procedure_revisions" ON public.procedure_revisions
  FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));

-- =========================================================
-- procedure_attachments
-- =========================================================
CREATE TABLE IF NOT EXISTS public.procedure_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id uuid NOT NULL REFERENCES public.procedures(id) ON DELETE CASCADE,
  company_id uuid NOT NULL,
  filename text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_proc_att_proc ON public.procedure_attachments(procedure_id);
ALTER TABLE public.procedure_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read procedure_attachments" ON public.procedure_attachments
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert procedure_attachments" ON public.procedure_attachments
  FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete procedure_attachments" ON public.procedure_attachments
  FOR DELETE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));

-- =========================================================
-- procedure_approvals (signatures)
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='approval_action') THEN
    CREATE TYPE approval_action AS ENUM ('submitted','reviewed','approved','rejected','revoked');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.procedure_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id uuid NOT NULL REFERENCES public.procedures(id) ON DELETE CASCADE,
  company_id uuid NOT NULL,
  action approval_action NOT NULL,
  actor_id uuid NOT NULL,
  actor_name text,
  actor_role text,
  comment text,
  signed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_proc_app_proc ON public.procedure_approvals(procedure_id);
ALTER TABLE public.procedure_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read procedure_approvals" ON public.procedure_approvals
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert procedure_approvals" ON public.procedure_approvals
  FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()) AND actor_id = auth.uid());

-- =========================================================
-- heat_inputs (calculation log)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.heat_inputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid REFERENCES public.procedures(id) ON DELETE SET NULL,
  weld_id uuid REFERENCES public.welds(id) ON DELETE SET NULL,
  voltage numeric NOT NULL,
  current_amp numeric NOT NULL,
  travel_speed numeric NOT NULL,        -- mm/min
  heat_input numeric NOT NULL,          -- kJ/mm  (auto)
  within_limits boolean,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.heat_inputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read heat_inputs" ON public.heat_inputs
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert heat_inputs" ON public.heat_inputs
  FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete heat_inputs" ON public.heat_inputs
  FOR DELETE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));

-- =========================================================
-- audit_logs (generic, write-only via trigger)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  action text NOT NULL,                 -- INSERT/UPDATE/DELETE/custom
  actor_id uuid,
  before jsonb,
  after jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_company_time ON public.audit_logs(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_record ON public.audit_logs(table_name, record_id);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read audit_logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (company_id = current_company_id());
-- No INSERT/UPDATE/DELETE policies: only triggers (security definer) write.

-- =========================================================
-- Audit trigger function
-- =========================================================
CREATE OR REPLACE FUNCTION public.write_audit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _cid uuid;
  _rid uuid;
  _before jsonb;
  _after jsonb;
BEGIN
  IF TG_OP = 'DELETE' THEN
    _cid := (to_jsonb(OLD)->>'company_id')::uuid;
    _rid := (to_jsonb(OLD)->>'id')::uuid;
    _before := to_jsonb(OLD);
    _after := NULL;
  ELSIF TG_OP = 'INSERT' THEN
    _cid := (to_jsonb(NEW)->>'company_id')::uuid;
    _rid := (to_jsonb(NEW)->>'id')::uuid;
    _before := NULL;
    _after := to_jsonb(NEW);
  ELSE
    _cid := (to_jsonb(NEW)->>'company_id')::uuid;
    _rid := (to_jsonb(NEW)->>'id')::uuid;
    _before := to_jsonb(OLD);
    _after := to_jsonb(NEW);
  END IF;

  IF _cid IS NULL THEN RETURN COALESCE(NEW, OLD); END IF;

  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, before, after)
  VALUES (_cid, TG_TABLE_NAME, _rid, TG_OP, auth.uid(), _before, _after);

  RETURN COALESCE(NEW, OLD);
END $$;

-- Attach to domain tables
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['procedures','qualifications','welds','inspections','equipment','procedure_approvals']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_audit_%I ON public.%I;', t, t);
    EXECUTE format('CREATE TRIGGER trg_audit_%I AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();', t, t);
  END LOOP;
END $$;

-- =========================================================
-- Storage bucket for procedure files
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('procedure-files','procedure-files', false)
ON CONFLICT (id) DO NOTHING;

-- Path layout: {company_id}/{procedure_id}/filename
CREATE POLICY "company members read procedure files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'procedure-files'
    AND (storage.foldername(name))[1] = current_company_id()::text
  );

CREATE POLICY "editors upload procedure files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'procedure-files'
    AND (storage.foldername(name))[1] = current_company_id()::text
    AND is_editor(auth.uid())
  );

CREATE POLICY "editors delete procedure files" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'procedure-files'
    AND (storage.foldername(name))[1] = current_company_id()::text
    AND is_editor(auth.uid())
  );
