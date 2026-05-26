
ALTER TABLE public.pqrs ADD COLUMN IF NOT EXISTS evaluation_snapshot jsonb;

ALTER TABLE public.qualification_signatures
  ADD COLUMN IF NOT EXISTS pqr_id uuid;

CREATE INDEX IF NOT EXISTS idx_qs_pqr ON public.qualification_signatures(pqr_id);

ALTER TABLE public.qualification_signatures
  ALTER COLUMN qualification_id DROP NOT NULL;

ALTER TABLE public.qualification_signatures
  DROP CONSTRAINT IF EXISTS qualification_signatures_target_chk;

ALTER TABLE public.qualification_signatures
  ADD CONSTRAINT qualification_signatures_target_chk
  CHECK (qualification_id IS NOT NULL OR pqr_id IS NOT NULL);
