ALTER TABLE public.qualifications
  ADD COLUMN IF NOT EXISTS test_thickness_mm numeric,
  ADD COLUMN IF NOT EXISTS test_diameter_mm numeric;