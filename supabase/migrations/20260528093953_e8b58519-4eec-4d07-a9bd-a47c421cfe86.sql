
CREATE OR REPLACE FUNCTION public.soft_delete_pwps(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.pwps WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'pWPS not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.is_editor(auth.uid()) THEN RAISE EXCEPTION 'Editor role required'; END IF;
  UPDATE public.pwps SET deleted_at = now(), deleted_by = auth.uid(), updated_at = now() WHERE id = _id;
  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, before)
  VALUES (_cid, 'pwps', _id, 'soft_delete', auth.uid(), jsonb_build_object('id', _id));
END $$;

CREATE OR REPLACE FUNCTION public.restore_pwps(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.pwps WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'pWPS not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.has_role(auth.uid(), 'super_admin'::app_role) THEN RAISE EXCEPTION 'Super admin role required'; END IF;
  UPDATE public.pwps SET deleted_at = NULL, deleted_by = NULL, updated_at = now() WHERE id = _id;
  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, after)
  VALUES (_cid, 'pwps', _id, 'restore', auth.uid(), jsonb_build_object('id', _id));
END $$;

CREATE OR REPLACE FUNCTION public.soft_delete_pqr(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.pqrs WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'PQR not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.is_editor(auth.uid()) THEN RAISE EXCEPTION 'Editor role required'; END IF;
  UPDATE public.pqrs SET deleted_at = now(), deleted_by = auth.uid(), updated_at = now() WHERE id = _id;
  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, before)
  VALUES (_cid, 'pqrs', _id, 'soft_delete', auth.uid(), jsonb_build_object('id', _id));
END $$;

CREATE OR REPLACE FUNCTION public.restore_pqr(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id INTO _cid FROM public.pqrs WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'PQR not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.has_role(auth.uid(), 'super_admin'::app_role) THEN RAISE EXCEPTION 'Super admin role required'; END IF;
  UPDATE public.pqrs SET deleted_at = NULL, deleted_by = NULL, updated_at = now() WHERE id = _id;
  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, after)
  VALUES (_cid, 'pqrs', _id, 'restore', auth.uid(), jsonb_build_object('id', _id));
END $$;
