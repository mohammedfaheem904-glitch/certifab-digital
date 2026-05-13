
-- Companies branding
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS report_footer text,
  ADD COLUMN IF NOT EXISTS email_from_name text DEFAULT 'Weld Yard System';

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  user_id uuid NOT NULL,
  kind text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  severity text DEFAULT 'info',
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read_at, created_at DESC);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user reads own notifications" ON public.notifications;
CREATE POLICY "user reads own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "user updates own notifications" ON public.notifications;
CREATE POLICY "user updates own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "editors create notifications" ON public.notifications;
CREATE POLICY "editors create notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));

-- Instruments (QA/QC tools)
DO $$ BEGIN
  CREATE TYPE public.instrument_status AS ENUM ('Active','Calibration Due','Out of Service');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS public.instruments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  asset_id text NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  model text,
  serial_number text,
  manufacturer text,
  calibration_due date,
  status public.instrument_status NOT NULL DEFAULT 'Active',
  assigned_user_id uuid,
  assigned_project_id uuid,
  qr_token text NOT NULL DEFAULT encode(gen_random_bytes(12), 'hex'),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, asset_id),
  UNIQUE (qr_token)
);
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read instruments" ON public.instruments;
CREATE POLICY "members read instruments" ON public.instruments FOR SELECT TO authenticated USING (company_id = current_company_id());
DROP POLICY IF EXISTS "editors insert instruments" ON public.instruments;
CREATE POLICY "editors insert instruments" ON public.instruments FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
DROP POLICY IF EXISTS "editors update instruments" ON public.instruments;
CREATE POLICY "editors update instruments" ON public.instruments FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
DROP POLICY IF EXISTS "editors delete instruments" ON public.instruments;
CREATE POLICY "editors delete instruments" ON public.instruments FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

-- Public verify route reads via qr_token
DROP POLICY IF EXISTS "public reads via qr" ON public.instruments;
CREATE POLICY "public reads via qr" ON public.instruments FOR SELECT TO anon USING (true);
-- (will be tightened by limiting columns at the route layer)

CREATE TRIGGER trg_instruments_updated BEFORE UPDATE ON public.instruments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.instrument_calibrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  instrument_id uuid NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  calibrated_on date NOT NULL,
  next_due date,
  performed_by text,
  certificate_path text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);
ALTER TABLE public.instrument_calibrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read calibrations" ON public.instrument_calibrations;
CREATE POLICY "members read calibrations" ON public.instrument_calibrations FOR SELECT TO authenticated USING (company_id = current_company_id());
DROP POLICY IF EXISTS "editors insert calibrations" ON public.instrument_calibrations;
CREATE POLICY "editors insert calibrations" ON public.instrument_calibrations FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));

-- Reminder idempotency log
CREATE TABLE IF NOT EXISTS public.reminder_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  kind text NOT NULL,         -- 'qualification_expiry' | 'instrument_calibration'
  ref_id uuid NOT NULL,       -- qualification or instrument id
  window_days int NOT NULL,   -- 30 / 7 / 0
  sent_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, ref_id, window_days)
);
ALTER TABLE public.reminder_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read reminder_log" ON public.reminder_log;
CREATE POLICY "members read reminder_log" ON public.reminder_log FOR SELECT TO authenticated USING (company_id = current_company_id());

-- Audit triggers on new tables
DROP TRIGGER IF EXISTS trg_audit_instruments ON public.instruments;
CREATE TRIGGER trg_audit_instruments AFTER INSERT OR UPDATE OR DELETE ON public.instruments
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

DROP TRIGGER IF EXISTS trg_audit_calibrations ON public.instrument_calibrations;
CREATE TRIGGER trg_audit_calibrations AFTER INSERT OR UPDATE OR DELETE ON public.instrument_calibrations
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- Storage bucket for instrument certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('instrument-files','instrument-files', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "company reads instrument files" ON storage.objects;
CREATE POLICY "company reads instrument files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'instrument-files' AND (storage.foldername(name))[1] = current_company_id()::text);

DROP POLICY IF EXISTS "editors upload instrument files" ON storage.objects;
CREATE POLICY "editors upload instrument files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'instrument-files' AND (storage.foldername(name))[1] = current_company_id()::text AND is_editor(auth.uid()));

DROP POLICY IF EXISTS "editors delete instrument files" ON storage.objects;
CREATE POLICY "editors delete instrument files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'instrument-files' AND (storage.foldername(name))[1] = current_company_id()::text AND is_editor(auth.uid()));

-- Public bucket for company logos (read-anywhere, write by editors of own company)
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-branding','company-branding', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public reads branding" ON storage.objects;
CREATE POLICY "public reads branding" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'company-branding');

DROP POLICY IF EXISTS "admins write branding" ON storage.objects;
CREATE POLICY "admins write branding" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'company-branding'
              AND (storage.foldername(name))[1] = current_company_id()::text
              AND has_role(auth.uid(),'super_admin'));

DROP POLICY IF EXISTS "admins update branding" ON storage.objects;
CREATE POLICY "admins update branding" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'company-branding'
         AND (storage.foldername(name))[1] = current_company_id()::text
         AND has_role(auth.uid(),'super_admin'));
