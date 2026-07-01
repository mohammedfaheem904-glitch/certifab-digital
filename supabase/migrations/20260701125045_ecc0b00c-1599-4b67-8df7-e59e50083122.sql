CREATE POLICY "editors delete wps_signatures" ON public.wps_signatures
  FOR DELETE USING (public.is_editor(auth.uid()) AND company_id = public.current_company_id());