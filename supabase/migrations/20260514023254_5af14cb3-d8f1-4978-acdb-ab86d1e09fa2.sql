-- Lock down internal SECURITY DEFINER helpers — these should only run as
-- part of authenticated RLS checks or trigger execution, never via the
-- exposed PostgREST API for anonymous callers.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_any_role(uuid, public.app_role[]) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.current_company_id() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_company_member(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_editor(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.accept_invitation(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.emit_weld_event() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.emit_instrument_event() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.write_audit_log() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, public;

-- get_invitation is intentionally callable by anon so the /accept-invite
-- page can show invitation details before the user creates an account.
GRANT EXECUTE ON FUNCTION public.get_invitation(text) TO anon, authenticated;
