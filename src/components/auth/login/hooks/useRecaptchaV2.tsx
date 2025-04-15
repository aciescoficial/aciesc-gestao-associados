
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
          .from('configuracoes')
          .select('*')
          .eq('tipo', 'recaptcha')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading reCAPTCHA config:', error);
          return;
        }

        if (data && data.configuracoes) {
          setIsEnabled(data.configuracoes.enabled || false);
          setSiteKey(data.configuracoes.siteKey || '');
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

  // Function to execute reCAPTCHA
  const executeRecaptcha = async (action = 'login'): Promise<string> => {
    if (!isLoaded || !siteKey || !window.grecaptcha) {
      return '';
    }
    
    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      setRecaptchaToken(token);
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution error:', error);
      return '';
    }
  };

  return {
    recaptchaRef,
    isEnabled: isEnabled && !!siteKey,
    recaptchaToken,
    recaptchaLoaded: isLoaded,
    executeRecaptcha,
    resetRecaptcha: () => {
      if (window.grecaptcha && window.grecaptcha.reset) {
        window.grecaptcha.reset();
        setRecaptchaToken(null);
      } else {
        setRecaptchaToken(null);
      }
    },
  };
};
