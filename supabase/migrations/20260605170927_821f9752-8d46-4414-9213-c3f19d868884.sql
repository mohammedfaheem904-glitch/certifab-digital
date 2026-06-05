
ALTER TABLE public.instruments
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by uuid;

DROP POLICY IF EXISTS "members read instruments" ON public.instruments;
CREATE POLICY "members read instruments" ON public.instruments
  FOR SELECT TO authenticated
  USING (company_id = current_company_id() AND deleted_at IS NULL);

CREATE POLICY "super_admin reads deleted instruments" ON public.instruments
  FOR SELECT TO authenticated
  USING (company_id = current_company_id() AND deleted_at IS NOT NULL AND has_role(auth.uid(), 'super_admin'::app_role));

CREATE OR REPLACE FUNCTION public.soft_delete_instrument(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.instruments WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Instrument not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.is_editor(auth.uid()) THEN RAISE EXCEPTION 'Editor role required'; END IF;
  UPDATE public.instruments SET deleted_at = now(), deleted_by = auth.uid(), updated_at = now() WHERE id = _id;
END $$;

CREATE OR REPLACE FUNCTION public.restore_instrument(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.instruments WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Instrument not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.has_role(auth.uid(), 'super_admin'::app_role) THEN RAISE EXCEPTION 'Super admin role required'; END IF;
  UPDATE public.instruments SET deleted_at = NULL, deleted_by = NULL, updated_at = now() WHERE id = _id;
END $$;
