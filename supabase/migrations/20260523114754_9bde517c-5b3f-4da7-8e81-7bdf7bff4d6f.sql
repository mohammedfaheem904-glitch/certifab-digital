
-- Helper to attach audit + updated_at to new wps_* tables
DO $$ BEGIN
  -- nothing; just a marker block
END $$;

CREATE TABLE IF NOT EXISTS public.wps_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid NOT NULL,
  position text NOT NULL,
  qualified_range text,
  progression text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wps_preheat_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid NOT NULL,
  applicability text,
  preheat_min_c numeric,
  preheat_max_c numeric,
  interpass_max_c numeric,
  preheat_method text,
  maintenance text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wps_techniques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid NOT NULL,
  process text,
  string_or_weave text,
  cleaning_method text,
  back_gouging text,
  peening text,
  pass_type text,
  electrode_mode text,
  automation text,
  oscillation text,
  multi_or_single_pass text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wps_shielding_gases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid NOT NULL,
  process text,
  gas_type text,
  composition text,
  flow_rate_lpm numeric,
  purge_gas text,
  purge_flow_lpm numeric,
  trailing_gas text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wps_pwht (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid NOT NULL,
  applicability text,
  temperature_c numeric,
  hold_time_min numeric,
  heating_rate text,
  cooling_rate text,
  atmosphere text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wps_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  procedure_id uuid NOT NULL,
  category text NOT NULL DEFAULT 'engineering',
  body text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wps_positions_proc ON public.wps_positions(procedure_id);
CREATE INDEX IF NOT EXISTS idx_wps_preheat_proc ON public.wps_preheat_entries(procedure_id);
CREATE INDEX IF NOT EXISTS idx_wps_techniques_proc ON public.wps_techniques(procedure_id);
CREATE INDEX IF NOT EXISTS idx_wps_gases_proc ON public.wps_shielding_gases(procedure_id);
CREATE INDEX IF NOT EXISTS idx_wps_pwht_proc ON public.wps_pwht(procedure_id);
CREATE INDEX IF NOT EXISTS idx_wps_notes_proc ON public.wps_notes(procedure_id);

-- updated_at triggers
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'wps_positions','wps_preheat_entries','wps_techniques',
    'wps_shielding_gases','wps_pwht','wps_notes'
  ]) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;
END $$;

-- Enable RLS + standard policies
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'wps_positions','wps_preheat_entries','wps_techniques',
    'wps_shielding_gases','wps_pwht','wps_notes'
  ]) LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "members read %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "members read %I" ON public.%I FOR SELECT TO authenticated USING (company_id = current_company_id())', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "editors insert %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "editors insert %I" ON public.%I FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()))', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "editors update %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "editors update %I" ON public.%I FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()))', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "editors delete %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "editors delete %I" ON public.%I FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()))', t, t);
  END LOOP;
END $$;
