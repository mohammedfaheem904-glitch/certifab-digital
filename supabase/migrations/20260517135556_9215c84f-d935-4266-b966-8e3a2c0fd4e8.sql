
-- =========================================================
-- Phase 1: WPS Engine relational data model
-- =========================================================

-- 1) Extend procedures with structured WPS fields
ALTER TABLE public.procedures
  ADD COLUMN IF NOT EXISTS wps_no text,
  ADD COLUMN IF NOT EXISTS pqr_no text,
  ADD COLUMN IF NOT EXISTS procedure_type text,
  ADD COLUMN IF NOT EXISTS document_no text,
  ADD COLUMN IF NOT EXISTS wps_date date,
  ADD COLUMN IF NOT EXISTS qr_token text UNIQUE DEFAULT encode(extensions.gen_random_bytes(12), 'hex'),
  -- Joint design summary
  ADD COLUMN IF NOT EXISTS groove_type text,
  ADD COLUMN IF NOT EXISTS welding_progression text,
  ADD COLUMN IF NOT EXISTS pipe_or_plate text,
  ADD COLUMN IF NOT EXISTS position_qualified text,
  ADD COLUMN IF NOT EXISTS joint_notes text,
  -- Thermal
  ADD COLUMN IF NOT EXISTS preheat_min_c numeric,
  ADD COLUMN IF NOT EXISTS interpass_max_c numeric,
  ADD COLUMN IF NOT EXISTS preheat_method text,
  ADD COLUMN IF NOT EXISTS thermal_notes text,
  -- Technique
  ADD COLUMN IF NOT EXISTS technique_string_weave text,
  ADD COLUMN IF NOT EXISTS cleaning_method text,
  ADD COLUMN IF NOT EXISTS back_gouging text,
  ADD COLUMN IF NOT EXISTS peening text,
  ADD COLUMN IF NOT EXISTS pass_type text,
  ADD COLUMN IF NOT EXISTS electrode_type text,
  ADD COLUMN IF NOT EXISTS automation text,
  ADD COLUMN IF NOT EXISTS technique_notes text;

-- Backfill qr_token for any existing rows missing it
UPDATE public.procedures
   SET qr_token = encode(extensions.gen_random_bytes(12), 'hex')
 WHERE qr_token IS NULL;

-- =========================================================
-- Helper: standard updated_at trigger reuse (set_updated_at already exists)
-- =========================================================

-- =========================================================
-- 2) wps_joint_configurations
-- =========================================================
CREATE TABLE IF NOT EXISTS public.wps_joint_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid NOT NULL REFERENCES public.procedures(id) ON DELETE CASCADE,
  label text,
  groove_type text,
  joint_type text,
  welding_progression text,
  position_qualified text,
  pipe_or_plate text,
  notes text,
  sketch_path text,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS wps_joints_proc_idx ON public.wps_joint_configurations(procedure_id);
ALTER TABLE public.wps_joint_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read wps_joint_configurations" ON public.wps_joint_configurations
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert wps_joint_configurations" ON public.wps_joint_configurations
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update wps_joint_configurations" ON public.wps_joint_configurations
  FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete wps_joint_configurations" ON public.wps_joint_configurations
  FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE TRIGGER trg_wps_joints_updated BEFORE UPDATE ON public.wps_joint_configurations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_wps_joints_audit AFTER INSERT OR UPDATE OR DELETE ON public.wps_joint_configurations
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- =========================================================
-- 3) wps_base_metals
-- =========================================================
CREATE TABLE IF NOT EXISTS public.wps_base_metals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid NOT NULL REFERENCES public.procedures(id) ON DELETE CASCADE,
  material_spec text,
  p_no text,
  group_no text,
  to_p_no text,
  to_group_no text,
  thickness_min_mm numeric,
  thickness_max_mm numeric,
  diameter_min_mm numeric,
  diameter_max_mm numeric,
  groove_applicability text,
  pass_thickness_limit_mm numeric,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS wps_basemetals_proc_idx ON public.wps_base_metals(procedure_id);
ALTER TABLE public.wps_base_metals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read wps_base_metals" ON public.wps_base_metals
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert wps_base_metals" ON public.wps_base_metals
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update wps_base_metals" ON public.wps_base_metals
  FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete wps_base_metals" ON public.wps_base_metals
  FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE TRIGGER trg_wps_basemetals_updated BEFORE UPDATE ON public.wps_base_metals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_wps_basemetals_audit AFTER INSERT OR UPDATE OR DELETE ON public.wps_base_metals
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- =========================================================
-- 4) wps_filler_metals
-- =========================================================
CREATE TABLE IF NOT EXISTS public.wps_filler_metals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid NOT NULL REFERENCES public.procedures(id) ON DELETE CASCADE,
  process text,
  filler_type text,
  sfa_no text,
  aws_classification text,
  electrode_brand text,
  f_no text,
  a_no text,
  electrode_diameter_mm numeric,
  qualified_thickness_mm numeric,
  flux_wire_class text,
  flux_brand text,
  consumable_insert text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS wps_fillers_proc_idx ON public.wps_filler_metals(procedure_id);
ALTER TABLE public.wps_filler_metals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read wps_filler_metals" ON public.wps_filler_metals
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert wps_filler_metals" ON public.wps_filler_metals
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update wps_filler_metals" ON public.wps_filler_metals
  FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete wps_filler_metals" ON public.wps_filler_metals
  FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE TRIGGER trg_wps_fillers_updated BEFORE UPDATE ON public.wps_filler_metals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_wps_fillers_audit AFTER INSERT OR UPDATE OR DELETE ON public.wps_filler_metals
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- =========================================================
-- 5) wps_electrical_characteristics
-- =========================================================
CREATE TABLE IF NOT EXISTS public.wps_electrical_characteristics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid NOT NULL REFERENCES public.procedures(id) ON DELETE CASCADE,
  weld_layer text,
  process text,
  filler_class text,
  electrode_diameter_mm numeric,
  polarity text,
  amperage_min numeric,
  amperage_max numeric,
  voltage_min numeric,
  voltage_max numeric,
  travel_speed_min numeric,
  travel_speed_max numeric,
  heat_input_min numeric,
  heat_input_max numeric,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS wps_electrical_proc_idx ON public.wps_electrical_characteristics(procedure_id);
ALTER TABLE public.wps_electrical_characteristics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read wps_electrical_characteristics" ON public.wps_electrical_characteristics
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert wps_electrical_characteristics" ON public.wps_electrical_characteristics
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update wps_electrical_characteristics" ON public.wps_electrical_characteristics
  FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete wps_electrical_characteristics" ON public.wps_electrical_characteristics
  FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE TRIGGER trg_wps_electrical_updated BEFORE UPDATE ON public.wps_electrical_characteristics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_wps_electrical_audit AFTER INSERT OR UPDATE OR DELETE ON public.wps_electrical_characteristics
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- =========================================================
-- 6) wps_signatures
-- =========================================================
CREATE TABLE IF NOT EXISTS public.wps_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid NOT NULL REFERENCES public.procedures(id) ON DELETE CASCADE,
  role text NOT NULL,        -- 'prepared_by' | 'reviewed_by' | 'approved_by'
  name text NOT NULL,
  actor_id uuid,
  signature_data_url text,
  signed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS wps_signatures_proc_idx ON public.wps_signatures(procedure_id);
ALTER TABLE public.wps_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read wps_signatures" ON public.wps_signatures
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert wps_signatures" ON public.wps_signatures
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE TRIGGER trg_wps_signatures_audit AFTER INSERT OR UPDATE OR DELETE ON public.wps_signatures
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- =========================================================
-- 7) Storage bucket for joint sketches
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('wps-sketches', 'wps-sketches', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "members read wps-sketches"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'wps-sketches' AND (storage.foldername(name))[1] = current_company_id()::text);

CREATE POLICY "editors upload wps-sketches"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'wps-sketches'
  AND (storage.foldername(name))[1] = current_company_id()::text
  AND is_editor(auth.uid())
);

CREATE POLICY "editors update wps-sketches"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'wps-sketches'
  AND (storage.foldername(name))[1] = current_company_id()::text
  AND is_editor(auth.uid())
);

CREATE POLICY "editors delete wps-sketches"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'wps-sketches'
  AND (storage.foldername(name))[1] = current_company_id()::text
  AND is_editor(auth.uid())
);

-- =========================================================
-- 8) Public QR verification function
-- =========================================================
CREATE OR REPLACE FUNCTION public.get_wps_by_qr(_token text)
RETURNS TABLE (
  id uuid, code text, wps_no text, pqr_no text, standard text, process text,
  revision text, status text, document_no text, wps_date date,
  position_qualified text, groove_type text,
  company_name text, company_logo_url text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.id, p.code, p.wps_no, p.pqr_no, p.standard, p.process,
         p.revision, p.status::text, p.document_no, p.wps_date,
         p.position_qualified, p.groove_type,
         c.name, c.logo_url
  FROM public.procedures p
  JOIN public.companies c ON c.id = p.company_id
  WHERE p.qr_token = _token AND p.deleted_at IS NULL
  LIMIT 1;
$$;
