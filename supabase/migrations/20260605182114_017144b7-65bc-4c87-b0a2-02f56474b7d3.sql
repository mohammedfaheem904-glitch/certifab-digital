
-- 1) Extend equipment table
ALTER TABLE public.equipment
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Other',
  ADD COLUMN IF NOT EXISTS serial_number text,
  ADD COLUMN IF NOT EXISTS manufacturer text,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS qr_token text NOT NULL DEFAULT encode(extensions.gen_random_bytes(12), 'hex'),
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by uuid;

-- 2) Update read RLS to exclude soft-deleted; add super_admin read of trash
DROP POLICY IF EXISTS "company members read equipment" ON public.equipment;
CREATE POLICY "company members read equipment"
  ON public.equipment FOR SELECT TO authenticated
  USING (company_id = current_company_id() AND deleted_at IS NULL);

CREATE POLICY "super_admin reads deleted equipment"
  ON public.equipment FOR SELECT TO authenticated
  USING (company_id = current_company_id() AND deleted_at IS NOT NULL AND has_role(auth.uid(), 'super_admin'::app_role));

-- 3) Soft-delete / restore RPCs
CREATE OR REPLACE FUNCTION public.soft_delete_equipment(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.equipment WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Equipment not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.is_editor(auth.uid()) THEN RAISE EXCEPTION 'Editor role required'; END IF;
  UPDATE public.equipment SET deleted_at = now(), deleted_by = auth.uid(), updated_at = now() WHERE id = _id;
END $$;

CREATE OR REPLACE FUNCTION public.restore_equipment(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.equipment WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Equipment not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.has_role(auth.uid(), 'super_admin'::app_role) THEN RAISE EXCEPTION 'Super admin role required'; END IF;
  UPDATE public.equipment SET deleted_at = NULL, deleted_by = NULL, updated_at = now() WHERE id = _id;
END $$;

-- 4) Calibration history table for equipment
CREATE TABLE IF NOT EXISTS public.equipment_calibrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  equipment_id uuid NOT NULL,
  calibrated_on date NOT NULL,
  next_due date,
  performed_by text,
  notes text,
  certificate_path text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipment_calibrations TO authenticated;
GRANT ALL ON public.equipment_calibrations TO service_role;

ALTER TABLE public.equipment_calibrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read equipment_calibrations"
  ON public.equipment_calibrations FOR SELECT TO authenticated
  USING (company_id = current_company_id());

CREATE POLICY "editors insert equipment_calibrations"
  ON public.equipment_calibrations FOR INSERT TO authenticated
  WITH CHECK (company_id = current_company_id() AND is_editor(auth.uid()));

CREATE POLICY "editors delete equipment_calibrations"
  ON public.equipment_calibrations FOR DELETE TO authenticated
  USING (company_id = current_company_id() AND is_editor(auth.uid()));
