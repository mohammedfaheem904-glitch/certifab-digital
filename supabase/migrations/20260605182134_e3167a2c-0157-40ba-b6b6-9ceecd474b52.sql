
CREATE POLICY "members read equipment-files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'equipment-files' AND (storage.foldername(name))[1] = current_company_id()::text);

CREATE POLICY "editors write equipment-files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'equipment-files' AND (storage.foldername(name))[1] = current_company_id()::text AND is_editor(auth.uid()));

CREATE POLICY "editors update equipment-files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'equipment-files' AND (storage.foldername(name))[1] = current_company_id()::text AND is_editor(auth.uid()));

CREATE POLICY "editors delete equipment-files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'equipment-files' AND (storage.foldername(name))[1] = current_company_id()::text AND is_editor(auth.uid()));
