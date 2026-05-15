ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS is_internal boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.protect_company_internal_flag()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_internal IS DISTINCT FROM OLD.is_internal THEN
    -- Allow service_role (server-side admin client) and direct DB roles
    -- (postgres/supabase_admin used by migrations). Block all tenant updates.
    IF coalesce(auth.role(), '') NOT IN ('service_role')
       AND session_user NOT IN ('postgres', 'supabase_admin', 'supabase_auth_admin') THEN
      RAISE EXCEPTION 'is_internal can only be modified by platform operators';
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_protect_company_internal_flag ON public.companies;
CREATE TRIGGER trg_protect_company_internal_flag
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.protect_company_internal_flag();

CREATE OR REPLACE FUNCTION public.is_internal_company(_company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_internal FROM public.companies WHERE id = _company_id), false);
$$;

UPDATE public.companies
SET is_internal = true, plan = 'enterprise'
WHERE id = (SELECT id FROM public.companies ORDER BY created_at ASC LIMIT 1);
