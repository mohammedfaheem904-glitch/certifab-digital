
CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  email text NOT NULL,
  token text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(24), 'hex'),
  role public.app_role NOT NULL DEFAULT 'inspector',
  invited_by uuid,
  invited_by_name text,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX invitations_token_idx ON public.invitations(token);
CREATE INDEX invitations_company_idx ON public.invitations(company_id);
CREATE INDEX invitations_email_idx ON public.invitations(lower(email));

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read invitations" ON public.invitations
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

CREATE POLICY "super_admin insert invitations" ON public.invitations
  FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id() AND public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "super_admin update invitations" ON public.invitations
  FOR UPDATE TO authenticated
  USING (company_id = public.current_company_id() AND public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "super_admin delete invitations" ON public.invitations
  FOR DELETE TO authenticated
  USING (company_id = public.current_company_id() AND public.has_role(auth.uid(), 'super_admin'));

-- Token-based lookup (callable by anon, returns minimal info)
CREATE OR REPLACE FUNCTION public.get_invitation(_token text)
RETURNS TABLE(
  company_id uuid,
  company_name text,
  email text,
  role public.app_role,
  expires_at timestamptz,
  accepted_at timestamptz,
  invited_by_name text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT i.company_id, c.name, i.email, i.role, i.expires_at, i.accepted_at, i.invited_by_name
  FROM public.invitations i
  JOIN public.companies c ON c.id = i.company_id
  WHERE i.token = _token
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_invitation(text) TO anon, authenticated;

-- Accept invite for an already-authenticated user
CREATE OR REPLACE FUNCTION public.accept_invitation(_token text)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _inv public.invitations%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Must be authenticated';
  END IF;

  SELECT * INTO _inv FROM public.invitations WHERE token = _token;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid invitation';
  END IF;
  IF _inv.accepted_at IS NOT NULL THEN
    RAISE EXCEPTION 'Invitation already used';
  END IF;
  IF _inv.expires_at < now() THEN
    RAISE EXCEPTION 'Invitation expired';
  END IF;

  UPDATE public.profiles SET company_id = _inv.company_id WHERE id = auth.uid();

  INSERT INTO public.user_roles (user_id, role, company_id)
  VALUES (auth.uid(), _inv.role, _inv.company_id)
  ON CONFLICT DO NOTHING;

  UPDATE public.invitations SET accepted_at = now() WHERE id = _inv.id;

  RETURN _inv.company_id;
END $$;

GRANT EXECUTE ON FUNCTION public.accept_invitation(text) TO authenticated;

-- Updated signup handler: prioritize invitation token
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _company_id uuid;
  _company_name text;
  _token text;
  _inv public.invitations%ROWTYPE;
BEGIN
  _token := NEW.raw_user_meta_data->>'invitation_token';

  IF _token IS NOT NULL AND length(_token) > 0 THEN
    SELECT * INTO _inv FROM public.invitations
    WHERE token = _token
      AND accepted_at IS NULL
      AND expires_at > now()
    LIMIT 1;

    IF FOUND THEN
      INSERT INTO public.profiles (id, company_id, display_name)
      VALUES (
        NEW.id,
        _inv.company_id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1))
      );
      INSERT INTO public.user_roles (user_id, role, company_id)
      VALUES (NEW.id, _inv.role, _inv.company_id);
      UPDATE public.invitations SET accepted_at = now() WHERE id = _inv.id;
      RETURN NEW;
    END IF;
  END IF;

  -- Fallback: brand-new company
  _company_name := COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Company');

  INSERT INTO public.companies (name, plan)
  VALUES (_company_name, 'trial')
  RETURNING id INTO _company_id;

  INSERT INTO public.profiles (id, company_id, display_name)
  VALUES (
    NEW.id,
    _company_id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1))
  );

  INSERT INTO public.user_roles (user_id, role, company_id)
  VALUES (NEW.id, 'super_admin', _company_id);

  RETURN NEW;
END $$;
