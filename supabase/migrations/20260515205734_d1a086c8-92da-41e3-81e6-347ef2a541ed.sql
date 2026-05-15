
ALTER TABLE public.qualifications
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by uuid;

CREATE INDEX IF NOT EXISTS qualifications_deleted_at_idx
  ON public.qualifications (company_id, deleted_at);

-- Replace SELECT policy to hide soft-deleted by default
DROP POLICY IF EXISTS "company members read qualifications" ON public.qualifications;
CREATE POLICY "company members read qualifications"
  ON public.qualifications
  FOR SELECT
  TO authenticated
  USING (company_id = current_company_id() AND deleted_at IS NULL);

-- Super admins can see soft-deleted records (Trash view)
DROP POLICY IF EXISTS "super_admin reads deleted qualifications" ON public.qualifications;
CREATE POLICY "super_admin reads deleted qualifications"
  ON public.qualifications
  FOR SELECT
  TO authenticated
  USING (
    company_id = current_company_id()
    AND deleted_at IS NOT NULL
    AND has_role(auth.uid(), 'super_admin'::app_role)
  );

-- Soft delete RPC (editors)
CREATE OR REPLACE FUNCTION public.soft_delete_qualification(_id uuid)
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

  SELECT company_id INTO _cid FROM public.qualifications WHERE id = _id;
  IF _cid IS NULL THEN
    RAISE EXCEPTION 'Qualification not found';
  END IF;
  IF _cid <> current_company_id() THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  IF NOT public.is_editor(auth.uid()) THEN
    RAISE EXCEPTION 'Editor role required';
  END IF;

  UPDATE public.qualifications
     SET deleted_at = now(),
         deleted_by = auth.uid(),
         updated_at = now()
   WHERE id = _id;
END $$;

-- Restore RPC (super_admin only)
CREATE OR REPLACE FUNCTION public.restore_qualification(_id uuid)
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

  SELECT company_id INTO _cid FROM public.qualifications WHERE id = _id;
  IF _cid IS NULL THEN
    RAISE EXCEPTION 'Qualification not found';
  END IF;
  IF _cid <> current_company_id() THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  IF NOT public.has_role(auth.uid(), 'super_admin'::app_role) THEN
    RAISE EXCEPTION 'Super admin role required';
  END IF;

  UPDATE public.qualifications
     SET deleted_at = NULL,
         deleted_by = NULL,
         updated_at = now()
   WHERE id = _id;
END $$;

GRANT EXECUTE ON FUNCTION public.soft_delete_qualification(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_qualification(uuid) TO authenticated;
