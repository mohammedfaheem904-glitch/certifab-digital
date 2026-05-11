
-- =========================================================
-- ENUMS
-- =========================================================
CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'qa_qc_manager',
  'welding_engineer',
  'inspector',
  'welder',
  'client_viewer'
);

CREATE TYPE public.weld_status AS ENUM ('Accepted','Rejected','Repair','Pending');
CREATE TYPE public.procedure_status AS ENUM ('Draft','Review','Approved','Archived');
CREATE TYPE public.qualification_status AS ENUM ('Active','Expiring Soon','Expired','Suspended');
CREATE TYPE public.equipment_status AS ENUM ('Operational','Maintenance','Calibration Due','Out of Service');
CREATE TYPE public.severity_level AS ENUM ('Low','Medium','High','Critical');
CREATE TYPE public.project_status AS ENUM ('Planning','Active','On Hold','Completed','Cancelled');

-- =========================================================
-- COMPANIES (tenants)
-- =========================================================
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT,
  industry TEXT,
  plan TEXT NOT NULL DEFAULT 'trial',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- PROFILES
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  display_name TEXT,
  job_title TEXT,
  avatar_url TEXT,
  phone TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- USER ROLES (separate table — never on profiles)
-- =========================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role, company_id)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- SECURITY DEFINER HELPERS (avoid RLS recursion)
-- =========================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles public.app_role[])
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = ANY(_roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS UUID
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_company_member(_company_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND company_id = _company_id
  );
$$;

-- Editors: can create/modify operational records
CREATE OR REPLACE FUNCTION public.is_editor(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.has_any_role(_user_id, ARRAY[
    'super_admin','qa_qc_manager','welding_engineer','inspector'
  ]::public.app_role[]);
$$;

-- =========================================================
-- updated_at trigger fn
-- =========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

-- =========================================================
-- New-user trigger (creates profile + default role)
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _company_id UUID;
  _company_name TEXT;
BEGIN
  _company_name := COALESCE(
    NEW.raw_user_meta_data->>'company_name',
    'My Company'
  );

  INSERT INTO public.companies (name, plan)
  VALUES (_company_name, 'trial')
  RETURNING id INTO _company_id;

  INSERT INTO public.profiles (id, company_id, display_name)
  VALUES (
    NEW.id,
    _company_id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1))
  );

  -- First user of a freshly created company is super_admin of that tenant
  INSERT INTO public.user_roles (user_id, role, company_id)
  VALUES (NEW.id, 'super_admin', _company_id);

  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- DOMAIN TABLES
-- =========================================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  client TEXT,
  location TEXT,
  status public.project_status NOT NULL DEFAULT 'Active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE INDEX ON public.projects(company_id);

CREATE TABLE public.procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  standard TEXT NOT NULL,
  process TEXT NOT NULL,
  thickness_range TEXT,
  revision TEXT NOT NULL DEFAULT 'Rev 0',
  status public.procedure_status NOT NULL DEFAULT 'Draft',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (company_id, code, revision)
);
ALTER TABLE public.procedures ENABLE ROW LEVEL SECURITY;
CREATE INDEX ON public.procedures(company_id);

CREATE TABLE public.qualifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  welder_name TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  process TEXT NOT NULL,
  standard TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  status public.qualification_status NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.qualifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX ON public.qualifications(company_id);
CREATE INDEX ON public.qualifications(expiry_date);

CREATE TABLE public.welds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  weld_no TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  procedure_id UUID REFERENCES public.procedures(id) ON DELETE SET NULL,
  welder_name TEXT,
  heat_input TEXT,
  status public.weld_status NOT NULL DEFAULT 'Pending',
  weld_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (company_id, weld_no)
);
ALTER TABLE public.welds ENABLE ROW LEVEL SECURITY;
CREATE INDEX ON public.welds(company_id);
CREATE INDEX ON public.welds(project_id);

CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  ncr_code TEXT,
  weld_id UUID REFERENCES public.welds(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  inspection_type TEXT NOT NULL,
  defect_type TEXT,
  severity public.severity_level,
  status TEXT NOT NULL DEFAULT 'Open',
  inspector_name TEXT,
  inspected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
CREATE INDEX ON public.inspections(company_id);

CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  asset_id TEXT NOT NULL,
  model TEXT NOT NULL,
  status public.equipment_status NOT NULL DEFAULT 'Operational',
  calibration_due DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (company_id, asset_id)
);
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
CREATE INDEX ON public.equipment(company_id);

-- =========================================================
-- updated_at triggers
-- =========================================================
CREATE TRIGGER trg_companies_updated      BEFORE UPDATE ON public.companies      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_profiles_updated       BEFORE UPDATE ON public.profiles       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_projects_updated       BEFORE UPDATE ON public.projects       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_procedures_updated     BEFORE UPDATE ON public.procedures     FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_qualifications_updated BEFORE UPDATE ON public.qualifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_welds_updated          BEFORE UPDATE ON public.welds          FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_inspections_updated    BEFORE UPDATE ON public.inspections    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_equipment_updated      BEFORE UPDATE ON public.equipment      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- RLS POLICIES
-- =========================================================

-- companies: members can view their company; super_admin can update
CREATE POLICY "members view own company" ON public.companies
FOR SELECT TO authenticated
USING (id = public.current_company_id());

CREATE POLICY "super_admin updates company" ON public.companies
FOR UPDATE TO authenticated
USING (id = public.current_company_id() AND public.has_role(auth.uid(),'super_admin'));

-- profiles: user can view/update own; same-company members can view each other
CREATE POLICY "view own or company profiles" ON public.profiles
FOR SELECT TO authenticated
USING (id = auth.uid() OR company_id = public.current_company_id());

CREATE POLICY "insert own profile" ON public.profiles
FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE POLICY "update own profile" ON public.profiles
FOR UPDATE TO authenticated USING (id = auth.uid());

-- user_roles: user can view their own; super_admin within company can manage
CREATE POLICY "view own roles or company roles" ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR company_id = public.current_company_id());

CREATE POLICY "super_admin manages roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'super_admin') AND company_id = public.current_company_id())
WITH CHECK (public.has_role(auth.uid(),'super_admin') AND company_id = public.current_company_id());

-- Generic tenant-scoped policies (read for any company member, write for editors)
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['projects','procedures','qualifications','welds','inspections','equipment'])
  LOOP
    EXECUTE format($f$
      CREATE POLICY "company members read %1$s" ON public.%1$I
      FOR SELECT TO authenticated
      USING (company_id = public.current_company_id());
    $f$, t);

    EXECUTE format($f$
      CREATE POLICY "editors insert %1$s" ON public.%1$I
      FOR INSERT TO authenticated
      WITH CHECK (company_id = public.current_company_id() AND public.is_editor(auth.uid()));
    $f$, t);

    EXECUTE format($f$
      CREATE POLICY "editors update %1$s" ON public.%1$I
      FOR UPDATE TO authenticated
      USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()));
    $f$, t);

    EXECUTE format($f$
      CREATE POLICY "editors delete %1$s" ON public.%1$I
      FOR DELETE TO authenticated
      USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()));
    $f$, t);
  END LOOP;
END $$;
