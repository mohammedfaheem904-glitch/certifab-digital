-- Expanded WPS engineering variables
CREATE TYPE public.wps_variable_category AS ENUM ('essential', 'non_essential', 'supplementary_essential');

CREATE TABLE public.wps_variables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid NOT NULL,
  category public.wps_variable_category NOT NULL DEFAULT 'essential',
  group_name text NOT NULL,
  process_ref text,
  variable_key text,
  variable_label text NOT NULL,
  qualified_value text,
  actual_range text,
  code_reference text,
  transferable boolean DEFAULT true,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_wps_variables_procedure ON public.wps_variables(procedure_id);
CREATE INDEX idx_wps_variables_company ON public.wps_variables(company_id);

ALTER TABLE public.wps_variables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company members read wps_variables"
  ON public.wps_variables FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

CREATE POLICY "editors insert wps_variables"
  ON public.wps_variables FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id() AND public.is_editor(auth.uid()));

CREATE POLICY "editors update wps_variables"
  ON public.wps_variables FOR UPDATE TO authenticated
  USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()));

CREATE POLICY "editors delete wps_variables"
  ON public.wps_variables FOR DELETE TO authenticated
  USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()));

CREATE TRIGGER trg_wps_variables_updated_at
  BEFORE UPDATE ON public.wps_variables
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();