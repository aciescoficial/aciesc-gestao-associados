
-- Remove reCAPTCHA configuration if it exists
DELETE FROM public.configuracoes WHERE tipo = 'recaptcha';

-- Disable captcha requirement in auth settings
UPDATE auth.config 
SET enable_signup_captcha = false,
    enable_email_signup_captcha = false,
    enable_phone_signup_captcha = false;
