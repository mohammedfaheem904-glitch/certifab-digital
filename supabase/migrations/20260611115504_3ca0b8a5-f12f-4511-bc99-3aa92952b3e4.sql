
REVOKE EXECUTE ON FUNCTION public.post_comment(public.collab_entity_type, uuid, uuid, text, text, text, uuid[], public.app_role[], jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.toggle_reaction(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.toggle_watch(public.collab_entity_type, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.mark_notifications_read(uuid[]) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_read_entity(public.collab_entity_type, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.entity_link(public.collab_entity_type, uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.post_comment(public.collab_entity_type, uuid, uuid, text, text, text, uuid[], public.app_role[], jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_reaction(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_watch(public.collab_entity_type, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notifications_read(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_read_entity(public.collab_entity_type, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.entity_link(public.collab_entity_type, uuid) TO authenticated;
