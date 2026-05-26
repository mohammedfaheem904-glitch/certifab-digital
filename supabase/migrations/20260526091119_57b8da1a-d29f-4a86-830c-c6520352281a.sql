-- Fix 1: Restrict pqr-attachments storage to owning tenant folder
DROP POLICY IF EXISTS "members read pqr attachments" ON storage.objects;
DROP POLICY IF EXISTS "editors upload pqr attachments" ON storage.objects;
DROP POLICY IF EXISTS "editors update pqr attachments" ON storage.objects;
DROP POLICY IF EXISTS "editors delete pqr attachments" ON storage.objects;

CREATE POLICY "members read pqr attachments" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'pqr-attachments'
  AND (storage.foldername(name))[1] = (public.current_company_id())::text
);

CREATE POLICY "editors upload pqr attachments" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'pqr-attachments'
  AND public.is_editor(auth.uid())
  AND (storage.foldername(name))[1] = (public.current_company_id())::text
);

CREATE POLICY "editors update pqr attachments" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'pqr-attachments'
  AND public.is_editor(auth.uid())
  AND (storage.foldername(name))[1] = (public.current_company_id())::text
)
WITH CHECK (
  bucket_id = 'pqr-attachments'
  AND public.is_editor(auth.uid())
  AND (storage.foldername(name))[1] = (public.current_company_id())::text
);

CREATE POLICY "editors delete pqr attachments" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'pqr-attachments'
  AND public.is_editor(auth.uid())
  AND (storage.foldername(name))[1] = (public.current_company_id())::text
);

-- Fix 2: Restrict invitation reads to super_admins (matches write policies)
DROP POLICY IF EXISTS "members read invitations" ON public.invitations;

CREATE POLICY "super_admin read invitations" ON public.invitations
FOR SELECT TO authenticated
USING (
  company_id = public.current_company_id()
  AND public.has_role(auth.uid(), 'super_admin'::public.app_role)
);