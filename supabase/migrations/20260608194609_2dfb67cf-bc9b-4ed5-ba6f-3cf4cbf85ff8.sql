
-- Enums (idempotent)
ALTER TYPE public.ncr_status ADD VALUE IF NOT EXISTS 'Under Investigation';
ALTER TYPE public.ncr_status ADD VALUE IF NOT EXISTS 'Corrective Action Proposed';
ALTER TYPE public.ncr_status ADD VALUE IF NOT EXISTS 'Awaiting Approval';
ALTER TYPE public.ncr_status ADD VALUE IF NOT EXISTS 'Rework Required';
ALTER TYPE public.ncr_status ADD VALUE IF NOT EXISTS 'Repaired';
ALTER TYPE public.ncr_status ADD VALUE IF NOT EXISTS 'Re-Inspection Required';
ALTER TYPE public.ncr_status ADD VALUE IF NOT EXISTS 'Accepted As-Is';

DO $$ BEGIN CREATE TYPE public.defect_category AS ENUM ('Discontinuity','Geometric','Metallurgical','Surface','Dimensional','Other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.defect_disposition AS ENUM ('Accept','Repair','Reject','Use As-Is','Pending Engineering');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.capa_type AS ENUM ('Corrective','Preventive','Containment');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.capa_status AS ENUM ('Proposed','Approved','In Progress','Completed','Verified','Cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.rca_method AS ENUM ('5 Why','Fishbone','Custom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.rca_cause_category AS ENUM ('Human Error','Procedure Issue','Material Issue','Equipment Issue','Environmental Issue','Training Deficiency','Other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.rework_status AS ENUM ('Planned','In Progress','Completed','Re-Inspected','Cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- defect_catalog
CREATE TABLE IF NOT EXISTS public.defect_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  code text NOT NULL, name text NOT NULL,
  category public.defect_category NOT NULL DEFAULT 'Discontinuity',
  default_severity public.severity_level NOT NULL DEFAULT 'Medium',
  description text, typical_causes text, code_references text, repair_guidance text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_defect_catalog_company ON public.defect_catalog(company_id, is_active);
CREATE UNIQUE INDEX IF NOT EXISTS uq_defect_catalog_code ON public.defect_catalog(COALESCE(company_id::text,'GLOBAL'), code);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.defect_catalog TO authenticated;
GRANT ALL ON public.defect_catalog TO service_role;
ALTER TABLE public.defect_catalog ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read defect catalog" ON public.defect_catalog;
CREATE POLICY "read defect catalog" ON public.defect_catalog FOR SELECT TO authenticated
  USING (company_id IS NULL OR company_id = public.current_company_id());
DROP POLICY IF EXISTS "super admins manage catalog" ON public.defect_catalog;
CREATE POLICY "super admins manage catalog" ON public.defect_catalog FOR ALL TO authenticated
  USING (company_id = public.current_company_id() AND public.has_role(auth.uid(),'super_admin'::public.app_role))
  WITH CHECK (company_id = public.current_company_id() AND public.has_role(auth.uid(),'super_admin'::public.app_role));
DROP TRIGGER IF EXISTS trg_defect_catalog_updated ON public.defect_catalog;
CREATE TRIGGER trg_defect_catalog_updated BEFORE UPDATE ON public.defect_catalog
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.defect_catalog (company_id, code, name, category, default_severity, description, typical_causes, code_references, repair_guidance) VALUES
(NULL,'POR','Porosity','Discontinuity','Medium','Cavity-type discontinuities formed by gas entrapment during solidification.','Contaminated base metal; inadequate shielding gas; moisture in consumables; improper arc length.','AWS D1.1 Table 6.1; ASME IX QW-194','Remove by grinding to sound metal; re-weld per WPS.'),
(NULL,'CRK','Crack','Discontinuity','Critical','Fracture-type discontinuity, often linear, in weld or HAZ.','High residual stress; hydrogen embrittlement; rapid cooling; restraint.','AWS D1.1 6.9; ASME B31.3 341.3.2','Excavate fully; verify with MT/PT; re-weld with preheat per qualified WPS.'),
(NULL,'LOF','Lack of Fusion','Discontinuity','High','Failure of weld metal to fuse with base metal or previous bead.','Low heat input; improper torch angle; surface contamination.','AWS D1.1 6.12; ASME IX','Grind to sound metal; re-weld observing correct travel angle and amperage.'),
(NULL,'LOP','Lack of Penetration','Discontinuity','High','Weld metal does not extend through joint thickness.','Insufficient root opening; low current; fast travel speed.','AWS D1.1 6.12.3','Back-gouge root; re-weld from opposite side per WPS.'),
(NULL,'UCT','Undercut','Geometric','Medium','Groove melted into base metal adjacent to weld toe.','Excessive current; incorrect electrode angle; high travel speed.','AWS D1.1 6.9; B31.3 Table 341.3.2','Blend smooth or fill with stringer pass within limits.'),
(NULL,'OVL','Overlap','Geometric','Medium','Weld metal protruding beyond toe without fusion to base metal.','Low travel speed; excessive deposition rate.','AWS D1.1 6.9','Remove by grinding to acceptable contour; re-inspect.'),
(NULL,'SLG','Slag Inclusion','Discontinuity','Medium','Non-metallic solid material trapped in weld metal.','Improper inter-pass cleaning; incorrect electrode manipulation.','AWS D1.1 6.12; ASME IX','Grind to sound metal; re-weld with thorough inter-pass cleaning.'),
(NULL,'ARC','Arc Strike','Surface','Low','Localized melting outside the weld groove from inadvertent electrode contact.','Operator error; poor work clamp location.','AWS D1.1 5.29','Grind smooth; verify no cracking by MT/PT.'),
(NULL,'BRN','Burn Through','Geometric','High','Excessive penetration causing molten metal to escape root.','Excessive heat input; insufficient root face; gap too wide.','ASME B31.3 341.3.2','Excavate and re-weld root with reduced heat input.'),
(NULL,'EXR','Excess Reinforcement','Geometric','Low','Weld face reinforcement exceeds specified maximum.','Slow travel; excessive filler deposition.','AWS D1.1 5.24','Grind to acceptable profile; blend toe.')
ON CONFLICT DO NOTHING;

-- inspection_defects
CREATE TABLE IF NOT EXISTS public.inspection_defects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  weld_id uuid REFERENCES public.welds(id) ON DELETE SET NULL,
  catalog_id uuid REFERENCES public.defect_catalog(id) ON DELETE SET NULL,
  category public.defect_category NOT NULL DEFAULT 'Discontinuity',
  defect_type text NOT NULL,
  severity public.severity_level NOT NULL DEFAULT 'Medium',
  location text, code_reference text, measurement text,
  repair_recommendation text, disposition public.defect_disposition,
  photo_url text, notes text,
  detected_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  detected_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inspection_defects_insp ON public.inspection_defects(inspection_id);
CREATE INDEX IF NOT EXISTS idx_inspection_defects_company ON public.inspection_defects(company_id);
CREATE INDEX IF NOT EXISTS idx_inspection_defects_weld ON public.inspection_defects(weld_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspection_defects TO authenticated;
GRANT ALL ON public.inspection_defects TO service_role;
ALTER TABLE public.inspection_defects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read defects" ON public.inspection_defects;
CREATE POLICY "members read defects" ON public.inspection_defects FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());
DROP POLICY IF EXISTS "editors insert defects" ON public.inspection_defects;
CREATE POLICY "editors insert defects" ON public.inspection_defects FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id() AND public.is_editor(auth.uid()));
DROP POLICY IF EXISTS "editors update defects" ON public.inspection_defects;
CREATE POLICY "editors update defects" ON public.inspection_defects FOR UPDATE TO authenticated
  USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()));
DROP POLICY IF EXISTS "editors delete defects" ON public.inspection_defects;
CREATE POLICY "editors delete defects" ON public.inspection_defects FOR DELETE TO authenticated
  USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()));
DROP TRIGGER IF EXISTS trg_inspection_defects_updated ON public.inspection_defects;
CREATE TRIGGER trg_inspection_defects_updated BEFORE UPDATE ON public.inspection_defects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS audit_inspection_defects ON public.inspection_defects;
CREATE TRIGGER audit_inspection_defects AFTER INSERT OR UPDATE OR DELETE ON public.inspection_defects
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- Extend ncrs
ALTER TABLE public.ncrs
  ADD COLUMN IF NOT EXISTS containment_action text,
  ADD COLUMN IF NOT EXISTS responsible_person text,
  ADD COLUMN IF NOT EXISTS target_date date,
  ADD COLUMN IF NOT EXISTS effectiveness_review_at timestamptz,
  ADD COLUMN IF NOT EXISTS effectiveness_review_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS effectiveness_result text,
  ADD COLUMN IF NOT EXISTS closure_approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS closure_approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS accepted_as_is_reason text,
  ADD COLUMN IF NOT EXISTS spool_id uuid;

-- ncr_defect_links
CREATE TABLE IF NOT EXISTS public.ncr_defect_links (
  ncr_id uuid NOT NULL REFERENCES public.ncrs(id) ON DELETE CASCADE,
  defect_id uuid NOT NULL REFERENCES public.inspection_defects(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (ncr_id, defect_id)
);
CREATE INDEX IF NOT EXISTS idx_ncr_defect_links_company ON public.ncr_defect_links(company_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ncr_defect_links TO authenticated;
GRANT ALL ON public.ncr_defect_links TO service_role;
ALTER TABLE public.ncr_defect_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read ncr_defect_links" ON public.ncr_defect_links;
CREATE POLICY "members read ncr_defect_links" ON public.ncr_defect_links FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());
DROP POLICY IF EXISTS "editors write ncr_defect_links" ON public.ncr_defect_links;
CREATE POLICY "editors write ncr_defect_links" ON public.ncr_defect_links FOR ALL TO authenticated
  USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()))
  WITH CHECK (company_id = public.current_company_id() AND public.is_editor(auth.uid()));

-- rca_analyses
CREATE TABLE IF NOT EXISTS public.rca_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  ncr_id uuid NOT NULL REFERENCES public.ncrs(id) ON DELETE CASCADE,
  method public.rca_method NOT NULL DEFAULT '5 Why',
  primary_cause public.rca_cause_category,
  primary_cause_detail text,
  contributing_causes jsonb NOT NULL DEFAULT '[]'::jsonb,
  evidence text, conclusion text,
  performed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  performed_by_name text,
  performed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rca_ncr ON public.rca_analyses(ncr_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rca_analyses TO authenticated;
GRANT ALL ON public.rca_analyses TO service_role;
ALTER TABLE public.rca_analyses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read rca" ON public.rca_analyses;
CREATE POLICY "members read rca" ON public.rca_analyses FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());
DROP POLICY IF EXISTS "editors write rca" ON public.rca_analyses;
CREATE POLICY "editors write rca" ON public.rca_analyses FOR ALL TO authenticated
  USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()))
  WITH CHECK (company_id = public.current_company_id() AND public.is_editor(auth.uid()));
DROP TRIGGER IF EXISTS trg_rca_updated ON public.rca_analyses;
CREATE TRIGGER trg_rca_updated BEFORE UPDATE ON public.rca_analyses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS audit_rca ON public.rca_analyses;
CREATE TRIGGER audit_rca AFTER INSERT OR UPDATE OR DELETE ON public.rca_analyses
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- capa_actions
CREATE TABLE IF NOT EXISTS public.capa_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  ncr_id uuid NOT NULL REFERENCES public.ncrs(id) ON DELETE CASCADE,
  action_type public.capa_type NOT NULL DEFAULT 'Corrective',
  description text NOT NULL,
  owner uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  owner_name text, target_date date,
  status public.capa_status NOT NULL DEFAULT 'Proposed',
  completion_evidence text, completed_at timestamptz,
  effectiveness_verified_at timestamptz,
  effectiveness_verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  effectiveness_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_capa_ncr ON public.capa_actions(ncr_id);
CREATE INDEX IF NOT EXISTS idx_capa_status ON public.capa_actions(company_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.capa_actions TO authenticated;
GRANT ALL ON public.capa_actions TO service_role;
ALTER TABLE public.capa_actions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read capa" ON public.capa_actions;
CREATE POLICY "members read capa" ON public.capa_actions FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());
DROP POLICY IF EXISTS "editors write capa" ON public.capa_actions;
CREATE POLICY "editors write capa" ON public.capa_actions FOR ALL TO authenticated
  USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()))
  WITH CHECK (company_id = public.current_company_id() AND public.is_editor(auth.uid()));
DROP TRIGGER IF EXISTS trg_capa_updated ON public.capa_actions;
CREATE TRIGGER trg_capa_updated BEFORE UPDATE ON public.capa_actions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS audit_capa ON public.capa_actions;
CREATE TRIGGER audit_capa AFTER INSERT OR UPDATE OR DELETE ON public.capa_actions
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- rework_jobs
CREATE TABLE IF NOT EXISTS public.rework_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  ncr_id uuid NOT NULL REFERENCES public.ncrs(id) ON DELETE CASCADE,
  weld_id uuid REFERENCES public.welds(id) ON DELETE SET NULL,
  rework_wps_id uuid REFERENCES public.procedures(id) ON DELETE SET NULL,
  repair_method text, welder_name text,
  welder_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  planned_start date, started_at timestamptz, completed_at timestamptz,
  status public.rework_status NOT NULL DEFAULT 'Planned',
  reinspection_id uuid REFERENCES public.inspections(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rework_ncr ON public.rework_jobs(ncr_id);
CREATE INDEX IF NOT EXISTS idx_rework_status ON public.rework_jobs(company_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rework_jobs TO authenticated;
GRANT ALL ON public.rework_jobs TO service_role;
ALTER TABLE public.rework_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read rework" ON public.rework_jobs;
CREATE POLICY "members read rework" ON public.rework_jobs FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());
DROP POLICY IF EXISTS "editors write rework" ON public.rework_jobs;
CREATE POLICY "editors write rework" ON public.rework_jobs FOR ALL TO authenticated
  USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()))
  WITH CHECK (company_id = public.current_company_id() AND public.is_editor(auth.uid()));
DROP TRIGGER IF EXISTS trg_rework_updated ON public.rework_jobs;
CREATE TRIGGER trg_rework_updated BEFORE UPDATE ON public.rework_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS audit_rework ON public.rework_jobs;
CREATE TRIGGER audit_rework AFTER INSERT OR UPDATE OR DELETE ON public.rework_jobs
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- transition_ncr RPC
CREATE OR REPLACE FUNCTION public.transition_ncr(
  _id uuid, _to public.ncr_status, _reason text DEFAULT NULL, _comment text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _cid uuid; _from public.ncr_status; _uid uuid := auth.uid();
  _is_super boolean; _is_qaqc boolean; _is_editor boolean; _can_approve boolean;
  _now timestamptz := now(); _allowed boolean := false;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id, status INTO _cid, _from FROM public.ncrs WHERE id = _id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'NCR not found'; END IF;
  IF _cid <> public.current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF _from = _to THEN RAISE EXCEPTION 'NCR already %', _to; END IF;
  _is_super := public.has_role(_uid,'super_admin'::public.app_role);
  _is_qaqc  := public.has_role(_uid,'qa_qc_manager'::public.app_role);
  _is_editor:= public.is_editor(_uid);
  _can_approve := _is_super OR _is_qaqc;
  _allowed := CASE _from
    WHEN 'Draft' THEN _to IN ('Open','Rejected')
    WHEN 'Open' THEN _to IN ('Under Investigation','Rejected','Accepted As-Is','Closed')
    WHEN 'Under Investigation' THEN _to IN ('Root Cause','Corrective Action Proposed','Rejected','Accepted As-Is')
    WHEN 'Root Cause' THEN _to IN ('Corrective Action Proposed','CA Pending')
    WHEN 'Corrective Action Proposed' THEN _to IN ('Awaiting Approval','CA Pending','Rejected')
    WHEN 'Awaiting Approval' THEN _to IN ('CA Pending','Rework Required','Accepted As-Is','Rejected')
    WHEN 'CA Pending' THEN _to IN ('Rework Required','In Review','Repaired')
    WHEN 'Rework Required' THEN _to IN ('Repaired','Re-Inspection Required')
    WHEN 'Repaired' THEN _to IN ('Re-Inspection Required','In Review')
    WHEN 'Re-Inspection Required' THEN _to IN ('In Review','Closed','Rework Required')
    WHEN 'In Review' THEN _to IN ('Closed','Rework Required','Accepted As-Is','Rejected')
    WHEN 'Accepted As-Is' THEN _to IN ('Closed')
    WHEN 'Rejected' THEN _to IN ('Open','Draft')
    WHEN 'Closed' THEN false
    ELSE true
  END;
  IF NOT _allowed THEN RAISE EXCEPTION 'Invalid NCR transition: % -> %', _from, _to; END IF;
  IF _to IN ('Awaiting Approval','Closed','Accepted As-Is','Rejected') THEN
    IF NOT _can_approve THEN RAISE EXCEPTION 'Approver role required (super_admin or QA/QC manager) for %', _to; END IF;
  ELSIF NOT _is_editor THEN
    RAISE EXCEPTION 'Editor role required';
  END IF;
  IF _to IN ('Rejected','Accepted As-Is') AND (_reason IS NULL OR length(trim(_reason)) = 0) THEN
    RAISE EXCEPTION 'Reason required for %', _to;
  END IF;
  UPDATE public.ncrs SET
    status = _to, updated_at = _now,
    closed_at = CASE WHEN _to = 'Closed' THEN _now ELSE closed_at END,
    closed_by = CASE WHEN _to = 'Closed' THEN _uid ELSE closed_by END,
    closure_approved_at = CASE WHEN _to = 'Closed' THEN _now ELSE closure_approved_at END,
    closure_approved_by = CASE WHEN _to = 'Closed' THEN _uid ELSE closure_approved_by END,
    accepted_as_is_reason = CASE WHEN _to = 'Accepted As-Is' THEN _reason ELSE accepted_as_is_reason END
  WHERE id = _id;
  INSERT INTO public.ncr_events (company_id, ncr_id, kind, actor_id, comment, payload)
  VALUES (_cid, _id, 'transition', _uid, _comment,
          jsonb_build_object('from', _from, 'to', _to, 'reason', _reason));
END $$;

-- open_ncr_from_defect
CREATE OR REPLACE FUNCTION public.open_ncr_from_defect(
  _inspection_id uuid, _defect_ids uuid[], _title text, _severity public.severity_level DEFAULT 'Medium'
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid uuid; _ncr_id uuid; _no text; _proj uuid; _weld uuid; _did uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id, project_id, weld_id INTO _cid, _proj, _weld FROM public.inspections WHERE id = _inspection_id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Inspection not found'; END IF;
  IF _cid <> public.current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.is_editor(auth.uid()) THEN RAISE EXCEPTION 'Editor role required'; END IF;
  _no := 'NCR-' || to_char(now(),'YYYYMMDD') || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,6);
  INSERT INTO public.ncrs (company_id, ncr_no, project_id, weld_id, inspection_id, raised_by, severity, status, title)
  VALUES (_cid, _no, _proj, _weld, _inspection_id, auth.uid(), _severity, 'Open', _title)
  RETURNING id INTO _ncr_id;
  IF _defect_ids IS NOT NULL THEN
    FOREACH _did IN ARRAY _defect_ids LOOP
      INSERT INTO public.ncr_defect_links (ncr_id, defect_id, company_id)
      VALUES (_ncr_id, _did, _cid) ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;
  UPDATE public.inspections
     SET workflow_status = 'NCR Raised', ncr_code = _no, updated_at = now()
   WHERE id = _inspection_id AND workflow_status NOT IN ('Closed');
  INSERT INTO public.ncr_events (company_id, ncr_id, kind, actor_id, payload)
  VALUES (_cid, _ncr_id, 'created', auth.uid(), jsonb_build_object('inspection_id', _inspection_id));
  RETURN _ncr_id;
END $$;

-- start_rework
CREATE OR REPLACE FUNCTION public.start_rework(
  _ncr_id uuid, _wps_id uuid, _welder_name text, _method text
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid uuid; _wid uuid; _job uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT company_id, weld_id INTO _cid, _wid FROM public.ncrs WHERE id = _ncr_id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'NCR not found'; END IF;
  IF _cid <> public.current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.is_editor(auth.uid()) THEN RAISE EXCEPTION 'Editor role required'; END IF;
  INSERT INTO public.rework_jobs (company_id, ncr_id, weld_id, rework_wps_id, repair_method, welder_name, status, started_at)
  VALUES (_cid, _ncr_id, _wid, _wps_id, _method, _welder_name, 'In Progress', now())
  RETURNING id INTO _job;
  UPDATE public.ncrs SET status = 'Rework Required', updated_at = now() WHERE id = _ncr_id;
  INSERT INTO public.ncr_events (company_id, ncr_id, kind, actor_id, payload)
  VALUES (_cid, _ncr_id, 'rework_started', auth.uid(),
          jsonb_build_object('job_id', _job, 'wps_id', _wps_id, 'welder', _welder_name));
  RETURN _job;
END $$;

-- complete_rework_and_reinspect
CREATE OR REPLACE FUNCTION public.complete_rework_and_reinspect(_rework_id uuid, _notes text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _cid uuid; _ncr uuid; _wid uuid; _orig_ins uuid; _orig_type text; _proj uuid;
  _new_ins uuid; _no text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT r.company_id, r.ncr_id, r.weld_id INTO _cid, _ncr, _wid FROM public.rework_jobs r WHERE r.id = _rework_id;
  IF _cid IS NULL THEN RAISE EXCEPTION 'Rework not found'; END IF;
  IF _cid <> public.current_company_id() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT public.is_editor(auth.uid()) THEN RAISE EXCEPTION 'Editor role required'; END IF;
  SELECT n.inspection_id INTO _orig_ins FROM public.ncrs n WHERE n.id = _ncr;
  SELECT inspection_type, project_id INTO _orig_type, _proj FROM public.inspections WHERE id = _orig_ins;
  _no := 'INS-RI-' || to_char(now(),'YYYYMMDD') || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,6);
  INSERT INTO public.inspections (
    company_id, inspection_no, inspection_type, project_id, weld_id, workflow_status, status, notes, requested_at
  ) VALUES (
    _cid, _no, COALESCE(_orig_type,'VT'), _proj, _wid, 'Requested', 'Open',
    'Auto-generated re-inspection for NCR ' || _ncr::text, now()
  ) RETURNING id INTO _new_ins;
  UPDATE public.rework_jobs SET
    status = 'Completed', completed_at = now(), reinspection_id = _new_ins,
    notes = COALESCE(_notes, notes), updated_at = now()
  WHERE id = _rework_id;
  UPDATE public.ncrs SET status = 'Re-Inspection Required', updated_at = now() WHERE id = _ncr;
  INSERT INTO public.ncr_events (company_id, ncr_id, kind, actor_id, comment, payload)
  VALUES (_cid, _ncr, 'rework_completed', auth.uid(), _notes,
          jsonb_build_object('rework_id', _rework_id, 'reinspection_id', _new_ins));
  RETURN _new_ins;
END $$;
