
-- 1. Enum
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

-- 2. Profile columns
ALTER TABLE public.profiles
  ADD COLUMN approval_status public.approval_status NOT NULL DEFAULT 'pending',
  ADD COLUMN approved_at timestamptz,
  ADD COLUMN approved_by uuid,
  ADD COLUMN rejected_at timestamptz,
  ADD COLUMN rejected_by uuid,
  ADD COLUMN rejection_reason text,
  ADD COLUMN pending_role public.app_role;

-- 3. Backfill existing users as approved
UPDATE public.profiles SET approval_status = 'approved', approved_at = COALESCE(created_at, now());

-- 4. Tighten current_company_id() so pending/rejected users have no company scope
CREATE OR REPLACE FUNCTION public.current_company_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT company_id FROM public.profiles
  WHERE id = auth.uid() AND approval_status = 'approved';
$function$;

-- 5. handle_new_user: brand-new workspace -> approved owner; invite/domain -> pending
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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

  -- (a) Invitation token -> create profile as PENDING, remember role
  IF _token IS NOT NULL AND length(_token) > 0 THEN
    SELECT * INTO _inv FROM public.invitations
    WHERE token = _token
      AND accepted_at IS NULL
      AND expires_at > now()
    LIMIT 1;

    IF FOUND THEN
      INSERT INTO public.profiles (id, company_id, display_name, approval_status, pending_role)
      VALUES (
        NEW.id, _inv.company_id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)),
        'pending', _inv.role
      );
      RETURN NEW;
    END IF;
  END IF;

  -- (b) Email-domain whitelist -> PENDING client_viewer
  _email_domain := lower(split_part(NEW.email, '@', 2));
  IF _email_domain IS NOT NULL AND length(_email_domain) > 0 THEN
    SELECT * INTO _matched_company FROM public.companies
    WHERE _email_domain = ANY (
      SELECT lower(d) FROM unnest(allowed_email_domains) AS d
    )
    ORDER BY created_at ASC
    LIMIT 1;

    IF FOUND THEN
      INSERT INTO public.profiles (id, company_id, display_name, approval_status, pending_role)
      VALUES (
        NEW.id, _matched_company.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)),
        'pending', 'client_viewer'::app_role
      );
      RETURN NEW;
    END IF;
  END IF;

  -- (c) Brand-new workspace -> auto-approve as owner
  _company_name := COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Company');

  INSERT INTO public.companies (name, plan)
  VALUES (_company_name, 'trial')
  RETURNING id INTO _company_id;

  INSERT INTO public.profiles (id, company_id, display_name, approval_status, approved_at)
  VALUES (
    NEW.id, _company_id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)),
    'approved', now()
  );

  INSERT INTO public.user_roles (user_id, role, company_id)
  VALUES (NEW.id, 'super_admin', _company_id);

  RETURN NEW;
END $function$;

-- 6. accept_invitation: now sets profile to PENDING for super admin approval
CREATE OR REPLACE FUNCTION public.accept_invitation(_token text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  UPDATE public.profiles
     SET company_id = _inv.company_id,
         approval_status = 'pending',
         pending_role = _inv.role
   WHERE id = auth.uid();

  RETURN _inv.company_id;
END $function$;

-- 7. Approve / reject RPCs
CREATE OR REPLACE FUNCTION public.approve_user(_user_id uuid, _role public.app_role)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _cid uuid;
  _user_email text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT company_id INTO _cid FROM public.profiles WHERE id = _user_id;
  IF _cid IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  IF _cid <> public.current_company_id() THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  IF NOT public.has_role(auth.uid(), 'super_admin'::public.app_role) THEN
    RAISE EXCEPTION 'Super admin role required';
  END IF;

  UPDATE public.profiles
     SET approval_status = 'approved',
         approved_at = now(),
         approved_by = auth.uid(),
         rejected_at = NULL,
         rejected_by = NULL,
         rejection_reason = NULL,
         updated_at = now()
   WHERE id = _user_id;

  INSERT INTO public.user_roles (user_id, role, company_id)
  VALUES (_user_id, _role, _cid)
  ON CONFLICT DO NOTHING;

  -- Mark any matching pending invitation accepted
  SELECT email INTO _user_email FROM auth.users WHERE id = _user_id;
  IF _user_email IS NOT NULL THEN
    UPDATE public.invitations
       SET accepted_at = now()
     WHERE company_id = _cid
       AND lower(email) = lower(_user_email)
       AND accepted_at IS NULL;
  END IF;

  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, after)
  VALUES (_cid, 'profiles', _user_id, 'approve', auth.uid(),
          jsonb_build_object('role', _role));

  -- Notify the approved user
  INSERT INTO public.notifications (user_id, company_id, kind, title, body, severity, link)
  VALUES (_user_id, _cid, 'approval_granted',
          'Your account has been approved',
          'You now have access to the workspace.',
          'success', '/app');
END $function$;

CREATE OR REPLACE FUNCTION public.reject_user(_user_id uuid, _reason text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT company_id INTO _cid FROM public.profiles WHERE id = _user_id;
  IF _cid IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  IF _cid <> public.current_company_id() THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  IF NOT public.has_role(auth.uid(), 'super_admin'::public.app_role) THEN
    RAISE EXCEPTION 'Super admin role required';
  END IF;
  IF _user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot reject yourself';
  END IF;

  UPDATE public.profiles
     SET approval_status = 'rejected',
         rejected_at = now(),
         rejected_by = auth.uid(),
         rejection_reason = _reason,
         updated_at = now()
   WHERE id = _user_id;

  -- Revoke any roles they had
  DELETE FROM public.user_roles WHERE user_id = _user_id AND company_id = _cid;

  INSERT INTO public.audit_logs (company_id, table_name, record_id, action, actor_id, after)
  VALUES (_cid, 'profiles', _user_id, 'reject', auth.uid(),
          jsonb_build_object('reason', _reason));
END $function$;

-- 8. Notification trigger: fan out to super_admins when a pending profile is created
CREATE OR REPLACE FUNCTION public.notify_super_admins_on_pending()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _admin uuid;
  _name text;
BEGIN
  IF NEW.approval_status <> 'pending' OR NEW.company_id IS NULL THEN
    RETURN NEW;
  END IF;
  _name := COALESCE(NEW.display_name, 'A new user');
  FOR _admin IN
    SELECT user_id FROM public.user_roles
     WHERE company_id = NEW.company_id AND role = 'super_admin'::public.app_role
  LOOP
    INSERT INTO public.notifications (user_id, company_id, kind, title, body, severity, link)
    VALUES (_admin, NEW.company_id, 'user_pending_approval',
            'New user awaiting approval',
            _name || ' signed up and is awaiting your approval.',
            'info', '/app/admin/users');
  END LOOP;
  RETURN NEW;
END $function$;

DROP TRIGGER IF EXISTS trg_notify_super_admins_on_pending ON public.profiles;
CREATE TRIGGER trg_notify_super_admins_on_pending
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.notify_super_admins_on_pending();

-- Also when a status flips to pending (e.g. accept_invitation on existing profile)
CREATE OR REPLACE FUNCTION public.notify_super_admins_on_pending_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _admin uuid;
  _name text;
BEGIN
  IF NEW.approval_status = 'pending'
     AND (OLD.approval_status IS DISTINCT FROM 'pending' OR OLD.company_id IS DISTINCT FROM NEW.company_id)
     AND NEW.company_id IS NOT NULL THEN
    _name := COALESCE(NEW.display_name, 'A user');
    FOR _admin IN
      SELECT user_id FROM public.user_roles
       WHERE company_id = NEW.company_id AND role = 'super_admin'::public.app_role
    LOOP
      INSERT INTO public.notifications (user_id, company_id, kind, title, body, severity, link)
      VALUES (_admin, NEW.company_id, 'user_pending_approval',
              'New user awaiting approval',
              _name || ' is awaiting your approval.',
              'info', '/app/admin/users');
    END LOOP;
  END IF;
  RETURN NEW;
END $function$;

DROP TRIGGER IF EXISTS trg_notify_super_admins_on_pending_update ON public.profiles;
CREATE TRIGGER trg_notify_super_admins_on_pending_update
AFTER UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.notify_super_admins_on_pending_update();

-- 9. Allow super admins to see pending users' emails (via existing profiles policy already covers company members)
-- No policy change needed; profiles policy already permits company-scope reads, and approved super admin gets a working current_company_id().
