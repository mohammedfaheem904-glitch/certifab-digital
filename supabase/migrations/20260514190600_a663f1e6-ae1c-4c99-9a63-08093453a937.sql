-- 1. Schema additions
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS dedicated_domain text UNIQUE,
  ADD COLUMN IF NOT EXISTS allowed_email_domains text[] NOT NULL DEFAULT '{}'::text[];

CREATE INDEX IF NOT EXISTS idx_companies_dedicated_domain ON public.companies (dedicated_domain);

-- 2. Public branding lookup (anon-safe; exposes only branding fields)
CREATE OR REPLACE FUNCTION public.get_company_branding_by_domain(_host text)
RETURNS TABLE (id uuid, name text, logo_url text, report_footer text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.name, c.logo_url, c.report_footer
  FROM public.companies c
  WHERE c.dedicated_domain IS NOT NULL
    AND lower(c.dedicated_domain) = lower(_host)
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_company_branding_by_domain(text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_company_branding_by_domain(text) TO anon, authenticated;

-- 3. Updated new-user handler with domain whitelist support
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  _company_id uuid;
  _company_name text;
  _token text;
  _inv public.invitations%ROWTYPE;
  _email_domain text;
  _matched_company public.companies%ROWTYPE;
BEGIN
  _token := NEW.raw_user_meta_data->>'invitation_token';

  -- (a) Invitation token wins
  IF _token IS NOT NULL AND length(_token) > 0 THEN
    SELECT * INTO _inv FROM public.invitations
    WHERE token = _token
      AND accepted_at IS NULL
      AND expires_at > now()
    LIMIT 1;

    IF FOUND THEN
      INSERT INTO public.profiles (id, company_id, display_name)
      VALUES (
        NEW.id, _inv.company_id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1))
      );
      INSERT INTO public.user_roles (user_id, role, company_id)
      VALUES (NEW.id, _inv.role, _inv.company_id);
      UPDATE public.invitations SET accepted_at = now() WHERE id = _inv.id;
      RETURN NEW;
    END IF;
  END IF;

  -- (b) Email-domain whitelist auto-join
  _email_domain := lower(split_part(NEW.email, '@', 2));
  IF _email_domain IS NOT NULL AND length(_email_domain) > 0 THEN
    SELECT * INTO _matched_company FROM public.companies
    WHERE _email_domain = ANY (
      SELECT lower(d) FROM unnest(allowed_email_domains) AS d
    )
    ORDER BY created_at ASC
    LIMIT 1;

    IF FOUND THEN
      INSERT INTO public.profiles (id, company_id, display_name)
      VALUES (
        NEW.id, _matched_company.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1))
      );
      INSERT INTO public.user_roles (user_id, role, company_id)
      VALUES (NEW.id, 'client_viewer'::app_role, _matched_company.id);
      RETURN NEW;
    END IF;
  END IF;

  -- (c) Fallback: brand-new company
  _company_name := COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Company');

  INSERT INTO public.companies (name, plan)
  VALUES (_company_name, 'trial')
  RETURNING id INTO _company_id;

  INSERT INTO public.profiles (id, company_id, display_name)
  VALUES (
    NEW.id, _company_id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1))
  );

  INSERT INTO public.user_roles (user_id, role, company_id)
  VALUES (NEW.id, 'super_admin', _company_id);

  RETURN NEW;
END $function$;
