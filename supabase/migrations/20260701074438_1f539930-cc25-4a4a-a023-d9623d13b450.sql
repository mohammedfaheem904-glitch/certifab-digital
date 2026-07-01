ALTER TABLE public.qualification_tests
  ADD COLUMN IF NOT EXISTS acceptance_criteria text,
  ADD COLUMN IF NOT EXISTS findings text;