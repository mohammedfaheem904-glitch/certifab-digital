ALTER TABLE public.pwps ADD COLUMN IF NOT EXISTS supporting_pqr_ids uuid[] NOT NULL DEFAULT '{}';

GRANT SELECT, INSERT, UPDATE ON public.pwps TO authenticated;
GRANT ALL ON public.pwps TO service_role;
