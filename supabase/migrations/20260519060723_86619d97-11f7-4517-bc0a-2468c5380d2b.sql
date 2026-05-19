
-- 1. Remove anon broad reads on qualifications / instruments
DROP POLICY IF EXISTS "public reads qualifications via qr" ON public.qualifications;
DROP POLICY IF EXISTS "public reads via qr" ON public.instruments;

-- 2. Secure lookup for instrument QR verification
CREATE OR REPLACE FUNCTION public.get_instrument_by_qr(_token text)
RETURNS TABLE(
  asset_id text, name text, category text, model text,
  serial_number text, manufacturer text, calibration_due date, status text,
  company_name text, company_logo_url text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT i.asset_id, i.name, i.category, i.model,
         i.serial_number, i.manufacturer, i.calibration_due, i.status::text,
         c.name, c.logo_url
  FROM public.instruments i
  JOIN public.companies c ON c.id = i.company_id
  WHERE i.qr_token = _token
  LIMIT 1;
$$;

-- 3. Tighten user_roles: only see roles inside your own company
DROP POLICY IF EXISTS "view own roles or company roles" ON public.user_roles;
CREATE POLICY "view roles within own company"
  ON public.user_roles FOR SELECT TO authenticated
  USING (company_id = current_company_id());

-- 4. Company-scope has_role (accepts rows with NULL company_id or matching)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
      AND (ur.company_id IS NULL OR ur.company_id = public.current_company_id())
  );
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid, _roles app_role[])
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = ANY(_roles)
      AND (ur.company_id IS NULL OR ur.company_id = public.current_company_id())
  );
$$;

-- 5. Restrict storage broad listing on public buckets.
-- Public file URLs still work (served via the CDN); only the .list() API is restricted.
DROP POLICY IF EXISTS "public reads welder-photos" ON storage.objects;
DROP POLICY IF EXISTS "public reads branding" ON storage.objects;

CREATE POLICY "members read welder-photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'welder-photos'
         AND (storage.foldername(name))[1] = (current_company_id())::text);

CREATE POLICY "members read branding"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'company-branding');

-- 6. Lock down SECURITY DEFINER functions: revoke anon EXECUTE on everything
-- except the explicit public QR/invitation lookups.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_any_role(uuid, app_role[]) FROM anon;
REVOKE EXECUTE ON FUNCTION public.current_company_id() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_editor(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_company_member(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_internal_company(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.accept_invitation(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.soft_delete_procedure(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.restore_procedure(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.soft_delete_qualification(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.restore_qualification(uuid) FROM anon;

-- Public-facing lookups (used by QR / invite verification pages)
GRANT EXECUTE ON FUNCTION public.get_qualification_by_qr(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_wps_by_qr(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_instrument_by_qr(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_invitation(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_company_branding_by_domain(text) TO anon;
