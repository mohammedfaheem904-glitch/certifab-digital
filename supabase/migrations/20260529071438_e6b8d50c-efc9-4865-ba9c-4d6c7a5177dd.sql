ALTER TABLE public.welds ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.welds ADD COLUMN IF NOT EXISTS deleted_by uuid;

DROP POLICY IF EXISTS "company members read welds" ON public.welds;
DROP POLICY IF EXISTS "members read welds" ON public.welds;
CREATE POLICY "members read welds" ON public.welds
  FOR SELECT TO authenticated
  USING (company_id = current_company_id() AND deleted_at IS NULL);

CREATE POLICY "super_admin reads deleted welds" ON public.welds
  FOR SELECT TO authenticated
  USING (company_id = current_company_id() AND deleted_at IS NOT NULL AND has_role(auth.uid(), 'super_admin'::app_role));

CREATE OR REPLACE FUNCTION public.soft_delete_weld(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.welds WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Weld not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.is_editor(auth.uid()) THEN RAISE EXCEPTION 'Editor role required'; END IF;
  UPDATE public.welds SET deleted_at = now(), deleted_by = auth.uid(), updated_at = now() WHERE id = _id;
  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, before)
  VALUES (_cid, 'welds', _id, 'soft_delete', auth.uid(), jsonb_build_object('id', _id));
END $$;

CREATE OR REPLACE FUNCTION public.restore_weld(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.welds WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Weld not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.has_role(auth.uid(), 'super_admin'::app_role) THEN RAISE EXCEPTION 'Super admin role required'; END IF;
  UPDATE public.welds SET deleted_at = NULL, deleted_by = NULL, updated_at = now() WHERE id = _id;
  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, after)
  VALUES (_cid, 'welds', _id, 'restore', auth.uid(), jsonb_build_object('id', _id));
END $$;