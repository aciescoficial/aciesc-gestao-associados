
-- Remove reCAPTCHA configuration if it exists
DELETE FROM public.configuracoes WHERE tipo = 'recaptcha';
