
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define interface for the recaptcha configuration
interface RecaptchaConfig {
  enabled: boolean;
  siteKey: string;
}

export const useRecaptchaV2 = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [siteKey, setSiteKey] = useState<string>('');
  const recaptchaRef = useRef<HTMLDivElement | null>(null);

  // Load recaptcha configuration
  useEffect(() => {
    const loadRecaptchaConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('recaptcha_config')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading reCAPTCHA config:', error);
          return;
        }

        if (data) {
          setIsEnabled(data.enabled || false);
          setSiteKey(data.site_key || '');
        }
      } catch (error) {
        console.error('Failed to fetch reCAPTCHA config:', error);
      }
    };

    loadRecaptchaConfig();
  }, []);

  // Load the reCAPTCHA script
  useEffect(() => {
    if (!isEnabled || !siteKey || document.querySelector('script[src*="recaptcha"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [isEnabled, siteKey]);

  // Initialize reCAPTCHA when loaded
  useEffect(() => {
    if (!isLoaded || !isEnabled || !siteKey || !recaptchaRef.current || !window.grecaptcha?.render) {
      return;
    }

    try {
      window.grecaptcha.render(recaptchaRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          setRecaptchaToken(token);
        },
        'expired-callback': () => {
          setRecaptchaToken(null);
        },
        'error-callback': () => {
          console.error('reCAPTCHA error');
          setRecaptchaToken(null);
        },
      });
    } catch (error) {
      console.error('Error rendering reCAPTCHA:', error);
    }
  }, [isLoaded, isEnabled, siteKey]);

  return {
    recaptchaRef,
    isEnabled: isEnabled && !!siteKey,
    recaptchaToken,
    resetRecaptcha: () => {
      if (window.grecaptcha?.reset) {
        window.grecaptcha.reset();
        setRecaptchaToken(null);
      }
    },
  };
};
