
ALTER TABLE public.inspections
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by uuid;

CREATE INDEX IF NOT EXISTS idx_inspections_deleted_at ON public.inspections(company_id, deleted_at);

DROP POLICY IF EXISTS "company members read inspections" ON public.inspections;
CREATE POLICY "company members read inspections" ON public.inspections
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() AND deleted_at IS NULL);

DROP POLICY IF EXISTS "super_admin reads deleted inspections" ON public.inspections;
CREATE POLICY "super_admin reads deleted inspections" ON public.inspections
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() AND deleted_at IS NOT NULL AND public.has_role(auth.uid(), 'super_admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.soft_delete_inspection(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.inspections WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Inspection not found'; END IF;
  IF _cid <> public.current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.is_editor(auth.uid()) THEN RAISE EXCEPTION 'Editor role required'; END IF;
  UPDATE public.inspections SET deleted_at = now(), deleted_by = auth.uid(), updated_at = now() WHERE id = _id;
END $$;

CREATE OR REPLACE FUNCTION public.restore_inspection(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.inspections WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Inspection not found'; END IF;
  IF _cid <> public.current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.has_role(auth.uid(), 'super_admin'::public.app_role) THEN RAISE EXCEPTION 'Super admin role required'; END IF;
  UPDATE public.inspections SET deleted_at = NULL, deleted_by = NULL, updated_at = now() WHERE id = _id;
END $$;
