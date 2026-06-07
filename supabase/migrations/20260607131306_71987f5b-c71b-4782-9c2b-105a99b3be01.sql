
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by uuid;

DROP POLICY IF EXISTS "company members read projects" ON public.projects;
CREATE POLICY "company members read projects" ON public.projects
  FOR SELECT TO authenticated
  USING ((company_id = current_company_id()) AND (deleted_at IS NULL));

CREATE POLICY "super_admin reads deleted projects" ON public.projects
  FOR SELECT TO authenticated
  USING ((company_id = current_company_id()) AND (deleted_at IS NOT NULL) AND has_role(auth.uid(), 'super_admin'::app_role));

CREATE OR REPLACE FUNCTION public.soft_delete_project(_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _cid uuid;
BEGIN
  SELECT company_id INTO _cid FROM public.projects WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Project not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT is_editor(auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE public.projects
    SET deleted_at = now(), deleted_by = auth.uid()
    WHERE id = _id;
END;
$$;

CREATE OR REPLACE FUNCTION public.restore_project(_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _cid uuid;
BEGIN
  SELECT company_id INTO _cid FROM public.projects WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Project not found'; END IF;
  IF _cid <> current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT has_role(auth.uid(), 'super_admin'::app_role) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE public.projects
    SET deleted_at = NULL, deleted_by = NULL
    WHERE id = _id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.soft_delete_project(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_project(uuid) TO authenticated;
