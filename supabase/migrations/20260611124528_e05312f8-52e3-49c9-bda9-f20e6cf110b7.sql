
CREATE OR REPLACE FUNCTION public.entity_link(_entity_type collab_entity_type, _entity_id uuid)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
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

CREATE OR REPLACE FUNCTION public.can_read_entity(_entity_type collab_entity_type, _entity_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE _cid uuid; _my uuid := public.current_company_id();
BEGIN
  IF _my IS NULL THEN RETURN false; END IF;
  CASE _entity_type
    WHEN 'ncr'           THEN SELECT company_id INTO _cid FROM public.ncrs WHERE id = _entity_id;
    WHEN 'weld'          THEN SELECT company_id INTO _cid FROM public.welds WHERE id = _entity_id;
    WHEN 'procedure'     THEN SELECT company_id INTO _cid FROM public.procedures WHERE id = _entity_id;
    WHEN 'pwps'          THEN SELECT company_id INTO _cid FROM public.pwps WHERE id = _entity_id;
    WHEN 'pqr'           THEN SELECT company_id INTO _cid FROM public.pqrs WHERE id = _entity_id;
    WHEN 'qualification' THEN SELECT company_id INTO _cid FROM public.qualifications WHERE id = _entity_id;
    WHEN 'inspection'    THEN SELECT company_id INTO _cid FROM public.inspections WHERE id = _entity_id;
    WHEN 'project'       THEN SELECT company_id INTO _cid FROM public.projects WHERE id = _entity_id;
    WHEN 'capa'          THEN SELECT company_id INTO _cid FROM public.capa_actions WHERE id = _entity_id;
    WHEN 'rework_job'    THEN SELECT company_id INTO _cid FROM public.rework_jobs WHERE id = _entity_id;
    WHEN 'instrument'    THEN SELECT company_id INTO _cid FROM public.instruments WHERE id = _entity_id;
    WHEN 'equipment'     THEN SELECT company_id INTO _cid FROM public.equipment WHERE id = _entity_id;
  END CASE;
  RETURN _cid IS NOT NULL AND _cid = _my;
END $function$;
