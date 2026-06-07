
-- Phase 2: Inspection Planning & Dynamic Builder

-- 1) inspection_plans
CREATE TABLE IF NOT EXISTS public.inspection_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  project_id uuid,
  name text NOT NULL,
  code text,
  description text,
  discipline text,
  default_inspection_type text,
  area text,
  unit text,
  line_no text,
  spool_no text,
  priority text NOT NULL DEFAULT 'Normal', -- Low | Normal | High | Critical
  planned_date date,
  due_date date,
  status text NOT NULL DEFAULT 'Draft', -- Draft | Active | Completed | Cancelled
  assigned_to uuid,
  assigned_to_name text,
  recurrence text, -- none | weekly | monthly
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspection_plans TO authenticated;
GRANT ALL ON public.inspection_plans TO service_role;
ALTER TABLE public.inspection_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read inspection_plans" ON public.inspection_plans
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert inspection_plans" ON public.inspection_plans
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update inspection_plans" ON public.inspection_plans
  FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete inspection_plans" ON public.inspection_plans
  FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_inspection_plans_company ON public.inspection_plans(company_id, status);

-- 2) inspection_plan_items
CREATE TABLE IF NOT EXISTS public.inspection_plan_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  plan_id uuid NOT NULL REFERENCES public.inspection_plans(id) ON DELETE CASCADE,
  weld_id uuid,
  joint_no text,
  line_no text,
  spool_no text,
  welder_name text,
  inspection_type text NOT NULL,
  priority text NOT NULL DEFAULT 'Normal',
  planned_date date,
  status text NOT NULL DEFAULT 'Planned', -- Planned | Generated | Skipped
  generated_inspection_id uuid REFERENCES public.inspections(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspection_plan_items TO authenticated;
GRANT ALL ON public.inspection_plan_items TO service_role;
ALTER TABLE public.inspection_plan_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read inspection_plan_items" ON public.inspection_plan_items
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert inspection_plan_items" ON public.inspection_plan_items
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update inspection_plan_items" ON public.inspection_plan_items
  FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete inspection_plan_items" ON public.inspection_plan_items
  FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_plan_items_plan ON public.inspection_plan_items(plan_id, status);

-- 3) inspection_work_packages
CREATE TABLE IF NOT EXISTS public.inspection_work_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  project_id uuid,
  package_no text NOT NULL,
  name text NOT NULL,
  package_type text NOT NULL DEFAULT 'General', -- RT | UT | Final | Hydrotest | Fabrication | General
  description text,
  status text NOT NULL DEFAULT 'Open', -- Open | In Progress | Completed | Closed
  target_date date,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspection_work_packages TO authenticated;
GRANT ALL ON public.inspection_work_packages TO service_role;
ALTER TABLE public.inspection_work_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read work_packages" ON public.inspection_work_packages
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert work_packages" ON public.inspection_work_packages
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update work_packages" ON public.inspection_work_packages
  FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete work_packages" ON public.inspection_work_packages
  FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_work_packages_company ON public.inspection_work_packages(company_id, status);

-- 4) inspection_package_members
CREATE TABLE IF NOT EXISTS public.inspection_package_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  package_id uuid NOT NULL REFERENCES public.inspection_work_packages(id) ON DELETE CASCADE,
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (package_id, inspection_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspection_package_members TO authenticated;
GRANT ALL ON public.inspection_package_members TO service_role;
ALTER TABLE public.inspection_package_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read package_members" ON public.inspection_package_members
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert package_members" ON public.inspection_package_members
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete package_members" ON public.inspection_package_members
  FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

-- 5) inspection_templates
CREATE TABLE IF NOT EXISTS public.inspection_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  name text NOT NULL,
  inspection_type text NOT NULL,
  discipline text,
  code_reference text,
  description text,
  is_default boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspection_templates TO authenticated;
GRANT ALL ON public.inspection_templates TO service_role;
ALTER TABLE public.inspection_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read inspection_templates" ON public.inspection_templates
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert inspection_templates" ON public.inspection_templates
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update inspection_templates" ON public.inspection_templates
  FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete inspection_templates" ON public.inspection_templates
  FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_templates_company_type ON public.inspection_templates(company_id, inspection_type, active);

-- 6) inspection_template_fields
CREATE TABLE IF NOT EXISTS public.inspection_template_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  template_id uuid NOT NULL REFERENCES public.inspection_templates(id) ON DELETE CASCADE,
  section text,
  sort_order int NOT NULL DEFAULT 0,
  label text NOT NULL,
  field_type text NOT NULL DEFAULT 'pass_fail', -- pass_fail | text | number | measurement | checkbox | attachment
  required boolean NOT NULL DEFAULT false,
  unit text,
  tolerance_min numeric,
  tolerance_max numeric,
  code_reference text,
  helper_text text,
  options jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspection_template_fields TO authenticated;
GRANT ALL ON public.inspection_template_fields TO service_role;
ALTER TABLE public.inspection_template_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read template_fields" ON public.inspection_template_fields
  FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert template_fields" ON public.inspection_template_fields
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update template_fields" ON public.inspection_template_fields
  FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete template_fields" ON public.inspection_template_fields
  FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_template_fields_template ON public.inspection_template_fields(template_id, sort_order);

-- 7) Extend inspections to also store template + measurement values
ALTER TABLE public.inspections
  ADD COLUMN IF NOT EXISTS template_id uuid REFERENCES public.inspection_templates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS plan_item_id uuid REFERENCES public.inspection_plan_items(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS priority text DEFAULT 'Normal',
  ADD COLUMN IF NOT EXISTS due_date date;

-- Extend checklist items so they can capture template-driven measurements
ALTER TABLE public.inspection_checklist_items
  ADD COLUMN IF NOT EXISTS template_field_id uuid REFERENCES public.inspection_template_fields(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS section text,
  ADD COLUMN IF NOT EXISTS unit text,
  ADD COLUMN IF NOT EXISTS tolerance_min numeric,
  ADD COLUMN IF NOT EXISTS tolerance_max numeric,
  ADD COLUMN IF NOT EXISTS code_reference text,
  ADD COLUMN IF NOT EXISTS attachment_path text;

CREATE INDEX IF NOT EXISTS idx_inspections_plan_item ON public.inspections(plan_item_id);

DROP TRIGGER IF EXISTS trg_inspection_plans_updated_at ON public.inspection_plans;
CREATE TRIGGER trg_inspection_plans_updated_at BEFORE UPDATE ON public.inspection_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_work_packages_updated_at ON public.inspection_work_packages;
CREATE TRIGGER trg_work_packages_updated_at BEFORE UPDATE ON public.inspection_work_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_templates_updated_at ON public.inspection_templates;
CREATE TRIGGER trg_templates_updated_at BEFORE UPDATE ON public.inspection_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
