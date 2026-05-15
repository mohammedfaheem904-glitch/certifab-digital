
ALTER TABLE public.qualifications
  ADD COLUMN IF NOT EXISTS wpq_number text,
  ADD COLUMN IF NOT EXISTS wps_number text,
  ADD COLUMN IF NOT EXISTS pqr_number text,
  ADD COLUMN IF NOT EXISTS stamp_number text,
  ADD COLUMN IF NOT EXISTS welder_photo_url text,
  ADD COLUMN IF NOT EXISTS qr_token text NOT NULL DEFAULT encode(extensions.gen_random_bytes(12), 'hex'),
  ADD COLUMN IF NOT EXISTS revision text NOT NULL DEFAULT 'Rev 0',
  ADD COLUMN IF NOT EXISTS doc_number text,
  ADD COLUMN IF NOT EXISTS process_type text,
  ADD COLUMN IF NOT EXISTS test_coupon_type text,
  ADD COLUMN IF NOT EXISTS welder_test_number text,
  ADD COLUMN IF NOT EXISTS code_family text DEFAULT 'ASME IX',
  ADD COLUMN IF NOT EXISTS qualification_date date,
  ADD COLUMN IF NOT EXISTS last_continuity_date date,
  ADD COLUMN IF NOT EXISTS result text,
  ADD COLUMN IF NOT EXISTS remarks text,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS retest_of_id uuid,
  ADD COLUMN IF NOT EXISTS position_qualified text,
  ADD COLUMN IF NOT EXISTS project_id uuid;

CREATE UNIQUE INDEX IF NOT EXISTS qualifications_qr_token_key ON public.qualifications(qr_token);
CREATE INDEX IF NOT EXISTS qualifications_company_idx ON public.qualifications(company_id);
CREATE INDEX IF NOT EXISTS qualifications_expiry_idx ON public.qualifications(expiry_date);

CREATE TABLE IF NOT EXISTS public.qualification_variables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  qualification_id uuid NOT NULL,
  variable_key text NOT NULL,
  variable_label text NOT NULL,
  qualified_with text,
  qualified_for text,
  code_reference text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS qv_qid_idx ON public.qualification_variables(qualification_id);
ALTER TABLE public.qualification_variables ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read qv" ON public.qualification_variables;
CREATE POLICY "members read qv" ON public.qualification_variables FOR SELECT TO authenticated USING (company_id = current_company_id());
DROP POLICY IF EXISTS "editors insert qv" ON public.qualification_variables;
CREATE POLICY "editors insert qv" ON public.qualification_variables FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
DROP POLICY IF EXISTS "editors update qv" ON public.qualification_variables;
CREATE POLICY "editors update qv" ON public.qualification_variables FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
DROP POLICY IF EXISTS "editors delete qv" ON public.qualification_variables;
CREATE POLICY "editors delete qv" ON public.qualification_variables FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
DROP TRIGGER IF EXISTS qv_set_updated ON public.qualification_variables;
CREATE TRIGGER qv_set_updated BEFORE UPDATE ON public.qualification_variables FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.qualification_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  qualification_id uuid NOT NULL,
  category text NOT NULL CHECK (category IN ('ndt','destructive')),
  test_type text NOT NULL,
  result text,
  report_number text,
  inspector_name text,
  test_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS qt_qid_idx ON public.qualification_tests(qualification_id);
ALTER TABLE public.qualification_tests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read qt" ON public.qualification_tests;
CREATE POLICY "members read qt" ON public.qualification_tests FOR SELECT TO authenticated USING (company_id = current_company_id());
DROP POLICY IF EXISTS "editors insert qt" ON public.qualification_tests;
CREATE POLICY "editors insert qt" ON public.qualification_tests FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
DROP POLICY IF EXISTS "editors update qt" ON public.qualification_tests;
CREATE POLICY "editors update qt" ON public.qualification_tests FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
DROP POLICY IF EXISTS "editors delete qt" ON public.qualification_tests;
CREATE POLICY "editors delete qt" ON public.qualification_tests FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
DROP TRIGGER IF EXISTS qt_set_updated ON public.qualification_tests;
CREATE TRIGGER qt_set_updated BEFORE UPDATE ON public.qualification_tests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.qualification_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  qualification_id uuid NOT NULL,
  role text NOT NULL,
  name text NOT NULL,
  signature_data_url text,
  signed_at timestamptz NOT NULL DEFAULT now(),
  actor_id uuid
);
CREATE INDEX IF NOT EXISTS qs_qid_idx ON public.qualification_signatures(qualification_id);
ALTER TABLE public.qualification_signatures ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read qs" ON public.qualification_signatures;
CREATE POLICY "members read qs" ON public.qualification_signatures FOR SELECT TO authenticated USING (company_id = current_company_id());
DROP POLICY IF EXISTS "editors insert qs" ON public.qualification_signatures;
CREATE POLICY "editors insert qs" ON public.qualification_signatures FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE TABLE IF NOT EXISTS public.qualification_continuity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  qualification_id uuid NOT NULL,
  activity_date date NOT NULL,
  process text,
  project_id uuid,
  evidence_weld_id uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);
CREATE INDEX IF NOT EXISTS qc_qid_idx ON public.qualification_continuity(qualification_id);
ALTER TABLE public.qualification_continuity ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read qc" ON public.qualification_continuity;
CREATE POLICY "members read qc" ON public.qualification_continuity FOR SELECT TO authenticated USING (company_id = current_company_id());
DROP POLICY IF EXISTS "editors insert qc" ON public.qualification_continuity;
CREATE POLICY "editors insert qc" ON public.qualification_continuity FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE OR REPLACE FUNCTION public.bump_qualification_continuity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.qualifications
    SET last_continuity_date = GREATEST(COALESCE(last_continuity_date, NEW.activity_date), NEW.activity_date),
        updated_at = now()
    WHERE id = NEW.qualification_id;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS qc_bump_parent ON public.qualification_continuity;
CREATE TRIGGER qc_bump_parent AFTER INSERT ON public.qualification_continuity FOR EACH ROW EXECUTE FUNCTION public.bump_qualification_continuity();

CREATE TABLE IF NOT EXISTS public.qualification_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  qualification_id uuid NOT NULL,
  filename text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS qa_qid_idx ON public.qualification_attachments(qualification_id);
ALTER TABLE public.qualification_attachments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read qa" ON public.qualification_attachments;
CREATE POLICY "members read qa" ON public.qualification_attachments FOR SELECT TO authenticated USING (company_id = current_company_id());
DROP POLICY IF EXISTS "editors insert qa" ON public.qualification_attachments;
CREATE POLICY "editors insert qa" ON public.qualification_attachments FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
DROP POLICY IF EXISTS "editors delete qa" ON public.qualification_attachments;
CREATE POLICY "editors delete qa" ON public.qualification_attachments FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

DROP POLICY IF EXISTS "public reads qualifications via qr" ON public.qualifications;
CREATE POLICY "public reads qualifications via qr" ON public.qualifications FOR SELECT TO anon USING (true);

CREATE OR REPLACE FUNCTION public.get_qualification_by_qr(_token text)
RETURNS TABLE (
  id uuid,
  wpq_number text,
  welder_name text,
  employee_id text,
  process text,
  standard text,
  code_family text,
  position_qualified text,
  qualification_date date,
  expiry_date date,
  status text,
  company_name text,
  company_logo_url text
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT q.id, q.wpq_number, q.welder_name, q.employee_id, q.process, q.standard,
         q.code_family, q.position_qualified, q.qualification_date, q.expiry_date, q.status::text,
         c.name, c.logo_url
  FROM public.qualifications q
  JOIN public.companies c ON c.id = q.company_id
  WHERE q.qr_token = _token
  LIMIT 1;
$$;

INSERT INTO storage.buckets (id, name, public) VALUES ('qualification-files', 'qualification-files', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('welder-photos', 'welder-photos', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "members read qualification-files" ON storage.objects;
CREATE POLICY "members read qualification-files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'qualification-files' AND (storage.foldername(name))[1] = current_company_id()::text);
DROP POLICY IF EXISTS "editors write qualification-files" ON storage.objects;
CREATE POLICY "editors write qualification-files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'qualification-files' AND (storage.foldername(name))[1] = current_company_id()::text AND is_editor(auth.uid()));
DROP POLICY IF EXISTS "editors delete qualification-files" ON storage.objects;
CREATE POLICY "editors delete qualification-files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'qualification-files' AND (storage.foldername(name))[1] = current_company_id()::text AND is_editor(auth.uid()));
DROP POLICY IF EXISTS "public reads welder-photos" ON storage.objects;
CREATE POLICY "public reads welder-photos" ON storage.objects FOR SELECT USING (bucket_id = 'welder-photos');
DROP POLICY IF EXISTS "editors write welder-photos" ON storage.objects;
CREATE POLICY "editors write welder-photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'welder-photos' AND (storage.foldername(name))[1] = current_company_id()::text AND is_editor(auth.uid()));

DROP TRIGGER IF EXISTS audit_qualifications ON public.qualifications;
CREATE TRIGGER audit_qualifications AFTER INSERT OR UPDATE OR DELETE ON public.qualifications FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
DROP TRIGGER IF EXISTS audit_qualification_variables ON public.qualification_variables;
CREATE TRIGGER audit_qualification_variables AFTER INSERT OR UPDATE OR DELETE ON public.qualification_variables FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
DROP TRIGGER IF EXISTS audit_qualification_tests ON public.qualification_tests;
CREATE TRIGGER audit_qualification_tests AFTER INSERT OR UPDATE OR DELETE ON public.qualification_tests FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
DROP TRIGGER IF EXISTS audit_qualification_signatures ON public.qualification_signatures;
CREATE TRIGGER audit_qualification_signatures AFTER INSERT OR UPDATE OR DELETE ON public.qualification_signatures FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
DROP TRIGGER IF EXISTS audit_qualification_continuity ON public.qualification_continuity;
CREATE TRIGGER audit_qualification_continuity AFTER INSERT OR UPDATE OR DELETE ON public.qualification_continuity FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
