ALTER TABLE public.qualifications ALTER COLUMN process_type SET DEFAULT 'Manual';
UPDATE public.qualifications SET process_type = 'Manual' WHERE process_type IS NULL;
