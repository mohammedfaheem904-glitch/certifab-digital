ALTER TABLE public.pwps ADD COLUMN IF NOT EXISTS f_no text;
ALTER TABLE public.pwps ADD COLUMN IF NOT EXISTS a_no text;

GRANT SELECT, INSERT, UPDATE ON public.pwps TO authenticated;
GRANT ALL ON public.pwps TO service_role;