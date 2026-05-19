
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS description text;

-- Drop any pre-existing FK on company_id (name unknown), then re-add with CASCADE
DO $$
DECLARE
  _c text;
BEGIN
  FOR _c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.projects'::regclass
      AND contype = 'f'
      AND conkey = ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid='public.projects'::regclass AND attname='company_id')]
  LOOP
    EXECUTE format('ALTER TABLE public.projects DROP CONSTRAINT %I', _c);
  END LOOP;
END $$;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_company_id_fkey
  FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;
