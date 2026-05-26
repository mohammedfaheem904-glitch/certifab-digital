
-- =====================================================================
-- ENUMS
-- =====================================================================
CREATE TYPE public.pwps_status AS ENUM (
  'Draft','Under Qualification','Testing','Pending Validation','Qualified','Rejected','Converted'
);

CREATE TYPE public.pqr_status AS ENUM (
  'Draft','In Testing','Under Review','Passed','Failed','Withdrawn','Expired'
);

CREATE TYPE public.test_result AS ENUM ('Pending','Pass','Fail','N/A');

CREATE TYPE public.ndt_method AS ENUM ('RT','UT','PT','MT','VT');

CREATE TYPE public.mechanical_test_type AS ENUM (
  'Tensile','Bend','Impact','Hardness','Macro Etch','Fracture'
);

CREATE TYPE public.finding_severity AS ENUM ('info','warning','error','critical');

-- =====================================================================
-- pWPS
-- =====================================================================
CREATE TABLE public.pwps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  pwps_no text NOT NULL,
  title text,
  revision text NOT NULL DEFAULT 'Rev 0',
  status public.pwps_status NOT NULL DEFAULT 'Draft',
  code_family text NOT NULL DEFAULT 'ASME IX',
  standard text,
  process text,
  joint_type text,
  groove_type text,
  position text,
  base_material text,
  p_number text,
  group_number text,
  thickness_min_mm numeric,
  thickness_max_mm numeric,
  diameter_min_mm numeric,
  diameter_max_mm numeric,
  filler_material text,
  filler_classification text,
  shielding_gas text,
  backing text,
  preheat_min_c numeric,
  interpass_max_c numeric,
  pwht text,
  voltage_min numeric, voltage_max numeric,
  current_min numeric, current_max numeric,
  travel_speed_min numeric, travel_speed_max numeric,
  heat_input_min numeric, heat_input_max numeric,
  polarity text,
  technique_notes text,
  project_id uuid,
  notes text,
  created_by uuid,
  submitted_at timestamptz,
  qualified_at timestamptz,
  rejected_at timestamptz,
  converted_at timestamptz,
  converted_to_procedure_id uuid,
  deleted_at timestamptz,
  deleted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_pwps_company ON public.pwps(company_id);
CREATE INDEX idx_pwps_status ON public.pwps(status);
CREATE UNIQUE INDEX idx_pwps_no_per_company ON public.pwps(company_id, pwps_no) WHERE deleted_at IS NULL;

ALTER TABLE public.pwps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read pwps" ON public.pwps FOR SELECT TO authenticated
  USING (company_id = current_company_id() AND deleted_at IS NULL);
CREATE POLICY "editors insert pwps" ON public.pwps FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update pwps" ON public.pwps FOR UPDATE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete pwps" ON public.pwps FOR DELETE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE TRIGGER trg_pwps_updated_at BEFORE UPDATE ON public.pwps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
-- PQR
-- =====================================================================
CREATE TABLE public.pqrs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  pqr_no text NOT NULL,
  pwps_id uuid REFERENCES public.pwps(id) ON DELETE SET NULL,
  resulting_wps_id uuid,
  revision text NOT NULL DEFAULT 'Rev 0',
  status public.pqr_status NOT NULL DEFAULT 'Draft',
  code_family text NOT NULL DEFAULT 'ASME IX',
  standard text,
  test_date date,
  qualification_date date,
  expiry_date date,
  evaluator_name text,
  evaluator_id uuid,
  overall_result public.test_result NOT NULL DEFAULT 'Pending',
  qualified_ranges jsonb NOT NULL DEFAULT '{}'::jsonb,
  remarks text,
  qr_token text NOT NULL DEFAULT encode(extensions.gen_random_bytes(12),'hex'),
  deleted_at timestamptz,
  deleted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_pqr_company ON public.pqrs(company_id);
CREATE INDEX idx_pqr_pwps ON public.pqrs(pwps_id);
CREATE INDEX idx_pqr_status ON public.pqrs(status);
CREATE UNIQUE INDEX idx_pqr_no_per_company ON public.pqrs(company_id, pqr_no) WHERE deleted_at IS NULL;

ALTER TABLE public.pqrs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read pqrs" ON public.pqrs FOR SELECT TO authenticated
  USING (company_id = current_company_id() AND deleted_at IS NULL);
CREATE POLICY "editors insert pqrs" ON public.pqrs FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update pqrs" ON public.pqrs FOR UPDATE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete pqrs" ON public.pqrs FOR DELETE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE TRIGGER trg_pqrs_updated_at BEFORE UPDATE ON public.pqrs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
-- TEST COUPONS
-- =====================================================================
CREATE TABLE public.test_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  coupon_no text NOT NULL,
  pwps_id uuid REFERENCES public.pwps(id) ON DELETE SET NULL,
  pqr_id uuid REFERENCES public.pqrs(id) ON DELETE SET NULL,
  project_id uuid,
  material_spec text,
  p_number text,
  group_number text,
  thickness_mm numeric,
  diameter_mm numeric,
  process text,
  welder_name text,
  welder_qualification_id uuid,
  position text,
  joint_type text,
  backing text,
  heat_number text,
  filler_metal text,
  filler_classification text,
  test_date date,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_coupons_company ON public.test_coupons(company_id);
CREATE INDEX idx_coupons_pwps ON public.test_coupons(pwps_id);
CREATE INDEX idx_coupons_pqr ON public.test_coupons(pqr_id);
CREATE UNIQUE INDEX idx_coupon_no_per_company ON public.test_coupons(company_id, coupon_no);

ALTER TABLE public.test_coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read coupons" ON public.test_coupons FOR SELECT TO authenticated
  USING (company_id = current_company_id());
CREATE POLICY "editors insert coupons" ON public.test_coupons FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update coupons" ON public.test_coupons FOR UPDATE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete coupons" ON public.test_coupons FOR DELETE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE TRIGGER trg_coupons_updated_at BEFORE UPDATE ON public.test_coupons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
-- WELDING EXECUTION RECORDS
-- =====================================================================
CREATE TABLE public.welding_execution_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  coupon_id uuid NOT NULL REFERENCES public.test_coupons(id) ON DELETE CASCADE,
  pass_number integer,
  pass_type text,
  process text,
  filler_classification text,
  filler_diameter_mm numeric,
  amperage numeric,
  voltage numeric,
  travel_speed numeric,
  heat_input numeric,
  polarity text,
  interpass_temp_c numeric,
  preheat_temp_c numeric,
  gas_type text,
  gas_flow numeric,
  sequence_notes text,
  recorded_by uuid,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_exec_company ON public.welding_execution_records(company_id);
CREATE INDEX idx_exec_coupon ON public.welding_execution_records(coupon_id);

ALTER TABLE public.welding_execution_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read execution" ON public.welding_execution_records FOR SELECT TO authenticated
  USING (company_id = current_company_id());
CREATE POLICY "editors insert execution" ON public.welding_execution_records FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update execution" ON public.welding_execution_records FOR UPDATE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete execution" ON public.welding_execution_records FOR DELETE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE TRIGGER trg_exec_updated_at BEFORE UPDATE ON public.welding_execution_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
-- NDT TESTS
-- =====================================================================
CREATE TABLE public.ndt_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  coupon_id uuid REFERENCES public.test_coupons(id) ON DELETE CASCADE,
  pqr_id uuid REFERENCES public.pqrs(id) ON DELETE SET NULL,
  method public.ndt_method NOT NULL,
  report_number text,
  acceptance_criteria text,
  result public.test_result NOT NULL DEFAULT 'Pending',
  technician_name text,
  technician_id uuid,
  equipment_id uuid,
  test_date date,
  findings text,
  remarks text,
  attachment_path text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ndt_company ON public.ndt_tests(company_id);
CREATE INDEX idx_ndt_coupon ON public.ndt_tests(coupon_id);
CREATE INDEX idx_ndt_pqr ON public.ndt_tests(pqr_id);

ALTER TABLE public.ndt_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read ndt" ON public.ndt_tests FOR SELECT TO authenticated
  USING (company_id = current_company_id());
CREATE POLICY "editors insert ndt" ON public.ndt_tests FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update ndt" ON public.ndt_tests FOR UPDATE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete ndt" ON public.ndt_tests FOR DELETE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE TRIGGER trg_ndt_updated_at BEFORE UPDATE ON public.ndt_tests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
-- MECHANICAL TESTS
-- =====================================================================
CREATE TABLE public.mechanical_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  coupon_id uuid REFERENCES public.test_coupons(id) ON DELETE CASCADE,
  pqr_id uuid REFERENCES public.pqrs(id) ON DELETE SET NULL,
  test_type public.mechanical_test_type NOT NULL,
  specimen_id text,
  dimensions jsonb,
  results jsonb,
  minimum_requirement text,
  result public.test_result NOT NULL DEFAULT 'Pending',
  laboratory text,
  report_number text,
  test_date date,
  remarks text,
  attachment_path text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_mech_company ON public.mechanical_tests(company_id);
CREATE INDEX idx_mech_coupon ON public.mechanical_tests(coupon_id);
CREATE INDEX idx_mech_pqr ON public.mechanical_tests(pqr_id);

ALTER TABLE public.mechanical_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read mech" ON public.mechanical_tests FOR SELECT TO authenticated
  USING (company_id = current_company_id());
CREATE POLICY "editors insert mech" ON public.mechanical_tests FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update mech" ON public.mechanical_tests FOR UPDATE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete mech" ON public.mechanical_tests FOR DELETE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE TRIGGER trg_mech_updated_at BEFORE UPDATE ON public.mechanical_tests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
-- PQR FINDINGS (engine output)
-- =====================================================================
CREATE TABLE public.pqr_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  pqr_id uuid NOT NULL REFERENCES public.pqrs(id) ON DELETE CASCADE,
  severity public.finding_severity NOT NULL DEFAULT 'info',
  code_reference text,
  affected_variable text,
  title text NOT NULL,
  message text,
  remediation text,
  resolved boolean NOT NULL DEFAULT false,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_findings_company ON public.pqr_findings(company_id);
CREATE INDEX idx_findings_pqr ON public.pqr_findings(pqr_id);

ALTER TABLE public.pqr_findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read findings" ON public.pqr_findings FOR SELECT TO authenticated
  USING (company_id = current_company_id());
CREATE POLICY "editors insert findings" ON public.pqr_findings FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update findings" ON public.pqr_findings FOR UPDATE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete findings" ON public.pqr_findings FOR DELETE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));

-- =====================================================================
-- PROCEDURE LINKS (traceability graph)
-- =====================================================================
CREATE TABLE public.procedure_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  source_type text NOT NULL,
  source_id uuid NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  relationship text NOT NULL,
  metadata jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_links_company ON public.procedure_links(company_id);
CREATE INDEX idx_links_source ON public.procedure_links(source_type, source_id);
CREATE INDEX idx_links_target ON public.procedure_links(target_type, target_id);

ALTER TABLE public.procedure_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read links" ON public.procedure_links FOR SELECT TO authenticated
  USING (company_id = current_company_id());
CREATE POLICY "editors insert links" ON public.procedure_links FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete links" ON public.procedure_links FOR DELETE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));

-- =====================================================================
-- Extend procedures with qualification lineage
-- =====================================================================
ALTER TABLE public.procedures
  ADD COLUMN IF NOT EXISTS pwps_id uuid REFERENCES public.pwps(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS pqr_id uuid REFERENCES public.pqrs(id) ON DELETE SET NULL;

-- =====================================================================
-- STORAGE BUCKET for PQR attachments
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('pqr-attachments', 'pqr-attachments', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "members read pqr attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'pqr-attachments');

CREATE POLICY "editors upload pqr attachments"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'pqr-attachments' AND is_editor(auth.uid()));

CREATE POLICY "editors update pqr attachments"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'pqr-attachments' AND is_editor(auth.uid()));

CREATE POLICY "editors delete pqr attachments"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'pqr-attachments' AND is_editor(auth.uid()));
