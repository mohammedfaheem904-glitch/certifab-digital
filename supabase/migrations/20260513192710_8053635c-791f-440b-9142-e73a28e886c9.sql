
-- Wave 1: Phase 4 schema foundations

-- 1. Extend welds with traceability fields
ALTER TABLE public.welds
  ADD COLUMN IF NOT EXISTS joint_no text,
  ADD COLUMN IF NOT EXISTS spool_no text,
  ADD COLUMN IF NOT EXISTS drawing_ref text,
  ADD COLUMN IF NOT EXISTS line_no text,
  ADD COLUMN IF NOT EXISTS base_material text,
  ADD COLUMN IF NOT EXISTS heat_number text,
  ADD COLUMN IF NOT EXISTS filler_metal text,
  ADD COLUMN IF NOT EXISTS joint_type text,
  ADD COLUMN IF NOT EXISTS inspection_status text DEFAULT 'Pending',
  ADD COLUMN IF NOT EXISTS qr_token text UNIQUE DEFAULT encode(extensions.gen_random_bytes(12), 'hex');

CREATE INDEX IF NOT EXISTS idx_welds_project ON public.welds(project_id);
CREATE INDEX IF NOT EXISTS idx_welds_company ON public.welds(company_id);

-- 2. weld_events
CREATE TABLE IF NOT EXISTS public.weld_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  weld_id uuid NOT NULL,
  kind text NOT NULL,
  actor_id uuid,
  actor_name text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.weld_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read weld_events" ON public.weld_events FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert weld_events" ON public.weld_events FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));

-- 3. weld_attachments
CREATE TABLE IF NOT EXISTS public.weld_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  weld_id uuid NOT NULL,
  filename text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.weld_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read weld_attachments" ON public.weld_attachments FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert weld_attachments" ON public.weld_attachments FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete weld_attachments" ON public.weld_attachments FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

-- weld-attachments storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('weld-attachments','weld-attachments', false) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "members read weld files" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'weld-attachments' AND (storage.foldername(name))[1] = current_company_id()::text);
CREATE POLICY "editors upload weld files" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'weld-attachments' AND (storage.foldername(name))[1] = current_company_id()::text AND is_editor(auth.uid()));
CREATE POLICY "editors delete weld files" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'weld-attachments' AND (storage.foldername(name))[1] = current_company_id()::text AND is_editor(auth.uid()));

-- 4. ncrs
DO $$ BEGIN
  CREATE TYPE public.ncr_status AS ENUM ('Draft','Open','Root Cause','CA Pending','In Review','Closed','Rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.ncrs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  ncr_no text NOT NULL,
  project_id uuid,
  weld_id uuid,
  inspection_id uuid,
  raised_by uuid,
  raised_by_name text,
  assigned_to uuid,
  assigned_to_name text,
  severity public.severity_level,
  status public.ncr_status NOT NULL DEFAULT 'Open',
  title text NOT NULL,
  description text,
  root_cause text,
  corrective_action text,
  preventive_action text,
  due_date date,
  closed_at timestamptz,
  closed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ncrs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read ncrs" ON public.ncrs FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert ncrs" ON public.ncrs FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors update ncrs" ON public.ncrs FOR UPDATE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete ncrs" ON public.ncrs FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE TRIGGER trg_ncrs_updated BEFORE UPDATE ON public.ncrs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. ncr_events
CREATE TABLE IF NOT EXISTS public.ncr_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  ncr_id uuid NOT NULL,
  kind text NOT NULL,
  actor_id uuid,
  actor_name text,
  comment text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ncr_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read ncr_events" ON public.ncr_events FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert ncr_events" ON public.ncr_events FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));

-- 6. ncr_attachments
CREATE TABLE IF NOT EXISTS public.ncr_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  ncr_id uuid NOT NULL,
  filename text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ncr_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read ncr_attachments" ON public.ncr_attachments FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert ncr_attachments" ON public.ncr_attachments FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));
CREATE POLICY "editors delete ncr_attachments" ON public.ncr_attachments FOR DELETE TO authenticated USING (company_id = current_company_id() AND is_editor(auth.uid()));

-- 7. instrument_events
CREATE TABLE IF NOT EXISTS public.instrument_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  instrument_id uuid NOT NULL,
  kind text NOT NULL,
  actor_id uuid,
  actor_name text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.instrument_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read instrument_events" ON public.instrument_events FOR SELECT TO authenticated USING (company_id = current_company_id());
CREATE POLICY "editors insert instrument_events" ON public.instrument_events FOR INSERT TO authenticated WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));

-- 8. Audit triggers on new tables
CREATE TRIGGER audit_ncrs AFTER INSERT OR UPDATE OR DELETE ON public.ncrs FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
CREATE TRIGGER audit_weld_events AFTER INSERT OR DELETE ON public.weld_events FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
CREATE TRIGGER audit_ncr_events AFTER INSERT OR DELETE ON public.ncr_events FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- 9. Auto-emit weld_events on weld status change
CREATE OR REPLACE FUNCTION public.emit_weld_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.weld_events (company_id, weld_id, kind, actor_id, payload)
    VALUES (NEW.company_id, NEW.id, 'logged', auth.uid(), jsonb_build_object('status', NEW.status));
  ELSIF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.weld_events (company_id, weld_id, kind, actor_id, payload)
    VALUES (NEW.company_id, NEW.id, 'status_change', auth.uid(),
      jsonb_build_object('from', OLD.status, 'to', NEW.status));
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_emit_weld_event AFTER INSERT OR UPDATE ON public.welds FOR EACH ROW EXECUTE FUNCTION public.emit_weld_event();

-- 10. Auto-emit instrument_events on assignment/status change
CREATE OR REPLACE FUNCTION public.emit_instrument_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.instrument_events (company_id, instrument_id, kind, actor_id, payload)
    VALUES (NEW.company_id, NEW.id, 'created', auth.uid(), jsonb_build_object('status', NEW.status));
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.instrument_events (company_id, instrument_id, kind, actor_id, payload)
      VALUES (NEW.company_id, NEW.id, 'status_change', auth.uid(),
        jsonb_build_object('from', OLD.status, 'to', NEW.status));
    END IF;
    IF NEW.assigned_user_id IS DISTINCT FROM OLD.assigned_user_id OR NEW.assigned_project_id IS DISTINCT FROM OLD.assigned_project_id THEN
      INSERT INTO public.instrument_events (company_id, instrument_id, kind, actor_id, payload)
      VALUES (NEW.company_id, NEW.id, 'reassigned', auth.uid(),
        jsonb_build_object('user', NEW.assigned_user_id, 'project', NEW.assigned_project_id));
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_emit_instrument_event AFTER INSERT OR UPDATE ON public.instruments FOR EACH ROW EXECUTE FUNCTION public.emit_instrument_event();

-- 11. Backfill qr_token for existing welds (defaults handle new rows)
UPDATE public.welds SET qr_token = encode(extensions.gen_random_bytes(12), 'hex') WHERE qr_token IS NULL;
