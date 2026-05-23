
-- heat_inputs: editor UPDATE
CREATE POLICY "editors update heat_inputs"
ON public.heat_inputs FOR UPDATE TO authenticated
USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()))
WITH CHECK (company_id = public.current_company_id() AND public.is_editor(auth.uid()));

-- instrument_calibrations: editor DELETE
CREATE POLICY "editors delete instrument_calibrations"
ON public.instrument_calibrations FOR DELETE TO authenticated
USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()));

-- qualification_continuity: editor UPDATE + DELETE
CREATE POLICY "editors update qualification_continuity"
ON public.qualification_continuity FOR UPDATE TO authenticated
USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()))
WITH CHECK (company_id = public.current_company_id() AND public.is_editor(auth.uid()));

CREATE POLICY "editors delete qualification_continuity"
ON public.qualification_continuity FOR DELETE TO authenticated
USING (company_id = public.current_company_id() AND public.is_editor(auth.uid()));

-- Storage: company-branding DELETE for super admins
CREATE POLICY "admins delete branding"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'company-branding'
  AND (storage.foldername(name))[1] = (public.current_company_id())::text
  AND public.has_role(auth.uid(), 'super_admin'::public.app_role)
);

-- Storage: welder-photos UPDATE + DELETE for editors
CREATE POLICY "editors update welder-photos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'welder-photos'
  AND (storage.foldername(name))[1] = (public.current_company_id())::text
  AND public.is_editor(auth.uid())
);

CREATE POLICY "editors delete welder-photos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'welder-photos'
  AND (storage.foldername(name))[1] = (public.current_company_id())::text
  AND public.is_editor(auth.uid())
);

-- Tighten public bucket listing: scope company-branding reads to own company folder
DROP POLICY IF EXISTS "members read branding" ON storage.objects;
CREATE POLICY "members read branding"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'company-branding'
  AND (storage.foldername(name))[1] = (public.current_company_id())::text
);
