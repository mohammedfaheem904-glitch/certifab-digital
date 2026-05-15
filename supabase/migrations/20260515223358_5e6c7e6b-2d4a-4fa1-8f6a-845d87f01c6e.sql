ALTER TABLE public.procedures
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by uuid;

CREATE INDEX IF NOT EXISTS procedures_deleted_at_idx
  ON public.procedures (company_id, deleted_at);

DROP POLICY IF EXISTS "company members read procedures" ON public.procedures;
CREATE POLICY "company members read procedures"
  ON public.procedures
  FOR SELECT
  TO authenticated
  USING (company_id = current_company_id() AND deleted_at IS NULL);

DROP POLICY IF EXISTS "super_admin reads deleted procedures" ON public.procedures;
CREATE POLICY "super_admin reads deleted procedures"
  ON public.procedures
  FOR SELECT
  TO authenticated
  USING (
    company_id = current_company_id()
    AND deleted_at IS NOT NULL
    AND has_role(auth.uid(), 'super_admin'::app_role)
  );

CREATE OR REPLACE FUNCTION public.soft_delete_procedure(_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT company_id INTO _cid FROM public.procedures WHERE id = _id;
  IF _cid IS NULL THEN
    RAISE EXCEPTION 'Procedure not found';
  END IF;
  IF _cid <> current_company_id() THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  IF NOT public.is_editor(auth.uid()) THEN
    RAISE EXCEPTION 'Editor role required';
  END IF;

  UPDATE public.procedures
     SET deleted_at = now(),
         deleted_by = auth.uid(),
         updated_at = now()
   WHERE id = _id;

  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, before)
  VALUES (_cid, 'procedures', _id, 'soft_delete', auth.uid(), jsonb_build_object('id', _id));
END $$;

CREATE OR REPLACE FUNCTION public.restore_procedure(_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT company_id INTO _cid FROM public.procedures WHERE id = _id;
  IF _cid IS NULL THEN
    RAISE EXCEPTION 'Procedure not found';
  END IF;
  IF _cid <> current_company_id() THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  IF NOT public.has_role(auth.uid(), 'super_admin'::app_role) THEN
    RAISE EXCEPTION 'Super admin role required';
  END IF;

  UPDATE public.procedures
     SET deleted_at = NULL,
         deleted_by = NULL,
         updated_at = now()
   WHERE id = _id;

  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, after)
  VALUES (_cid, 'procedures', _id, 'restore', auth.uid(), jsonb_build_object('id', _id));
END $$;

GRANT EXECUTE ON FUNCTION public.soft_delete_procedure(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_procedure(uuid) TO authenticated;