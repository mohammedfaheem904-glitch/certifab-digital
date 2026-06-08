
ALTER TABLE public.ncrs ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.ncrs ADD COLUMN IF NOT EXISTS deleted_by uuid;

CREATE OR REPLACE FUNCTION public.soft_delete_ncr(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.ncrs WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'NCR not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.is_editor(auth.uid()) THEN RAISE EXCEPTION 'Editor role required'; END IF;
  UPDATE public.ncrs SET deleted_at = now(), deleted_by = auth.uid(), updated_at = now() WHERE id = _id;
  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, before)
  VALUES (_cid, 'ncrs', _id, 'soft_delete', auth.uid(), jsonb_build_object('id', _id));
END $$;

CREATE OR REPLACE FUNCTION public.restore_ncr(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.ncrs WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'NCR not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.has_role(auth.uid(), 'super_admin'::app_role) THEN RAISE EXCEPTION 'Super admin role required'; END IF;
  UPDATE public.ncrs SET deleted_at = NULL, deleted_by = NULL, updated_at = now() WHERE id = _id;
  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, after)
  VALUES (_cid, 'ncrs', _id, 'restore', auth.uid(), jsonb_build_object('id', _id));
END $$;
