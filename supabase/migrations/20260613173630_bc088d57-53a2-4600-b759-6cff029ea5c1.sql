
-- 1) Fix function search_path
CREATE OR REPLACE FUNCTION public.entity_link(_entity_type collab_entity_type, _entity_id uuid)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $function$
  SELECT CASE _entity_type
    WHEN 'ncr'           THEN '/app/ncrs/' || _entity_id::text
    WHEN 'weld'          THEN '/app/welds/' || _entity_id::text
    WHEN 'procedure'     THEN '/app/procedures/' || _entity_id::text
    WHEN 'pwps'          THEN '/app/pwps/' || _entity_id::text
    WHEN 'pqr'           THEN '/app/pqrs/' || _entity_id::text
    WHEN 'qualification' THEN '/app/qualifications/' || _entity_id::text
    WHEN 'inspection'    THEN '/app/inspections/' || _entity_id::text
    WHEN 'project'       THEN '/app/projects/' || _entity_id::text
    WHEN 'instrument'    THEN '/app/instruments/' || _entity_id::text
    WHEN 'equipment'     THEN '/app/equipment/' || _entity_id::text
    WHEN 'capa'          THEN '/app/ncrs?capa=' || _entity_id::text
    WHEN 'rework_job'    THEN '/app/ncrs?rework=' || _entity_id::text
    ELSE '/app'
  END;
$function$;

-- 2) Realtime subscription authorization
CREATE OR REPLACE FUNCTION public.can_subscribe_realtime_topic(_topic text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _parts text[];
  _etype text;
  _eid uuid;
BEGIN
  IF _uid IS NULL OR _topic IS NULL THEN
    RETURN false;
  END IF;

  -- Notifications: notif-{user_id}-{nonce}
  IF _topic LIKE 'notif-%' THEN
    RETURN _topic LIKE ('notif-' || _uid::text || '-%');
  END IF;

  -- Comments/activity: collab-{entityType}-{entityId}-{nonce}  /  activity-{entityType}-{entityId}-{nonce}
  IF _topic LIKE 'collab-%' OR _topic LIKE 'activity-%' THEN
    _parts := string_to_array(_topic, '-');
    -- prefix(1) + etype(1) + uuid(5) + nonce-uuid(5) = 12
    IF array_length(_parts, 1) < 12 THEN
      RETURN false;
    END IF;
    _etype := _parts[2];
    BEGIN
      _eid := (_parts[3] || '-' || _parts[4] || '-' || _parts[5] || '-' || _parts[6] || '-' || _parts[7])::uuid;
    EXCEPTION WHEN others THEN
      RETURN false;
    END;
    BEGIN
      RETURN public.can_read_entity(_etype::public.collab_entity_type, _eid);
    EXCEPTION WHEN others THEN
      RETURN false;
    END;
  END IF;

  RETURN false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.can_subscribe_realtime_topic(text) TO authenticated;

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated tenant-scoped realtime subscriptions" ON realtime.messages;
CREATE POLICY "Authenticated tenant-scoped realtime subscriptions"
ON realtime.messages
FOR SELECT
TO authenticated
USING (public.can_subscribe_realtime_topic(realtime.topic()));
