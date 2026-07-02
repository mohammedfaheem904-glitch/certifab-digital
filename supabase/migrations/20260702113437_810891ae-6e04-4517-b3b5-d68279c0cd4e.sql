ALTER TABLE public.welds ADD COLUMN aws_classification text;
COMMENT ON COLUMN public.welds.aws_classification IS 'AWS filler metal classification inherited from the linked WPS';