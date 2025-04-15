
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define our own Json type since it's not available from the database types
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Define interface for the recaptcha configuration from the database JSONB field
export interface RecaptchaConfigData {
  enabled: boolean;
  siteKey: string;
  secretKey: string;
  version: string;
  scoreThreshold: number;
}

// Update the grecaptcha interface
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: string | HTMLElement, parameters: any) => number;
      reset?: (widgetId?: number) => void; // Make reset optional since it's only available after rendering
    };
    onRecaptchaLoad: () => void;
  }
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
          // Type assertion with a safer approach - first check if it's an object
          const configData = data.configuracoes as unknown;
          if (typeof configData === 'object' && configData !== null) {
            const config = configData as Record<string, any>;
            // Now safely access the properties
            setIsEnabled(!!config.enabled);
            setSiteKey(config.siteKey || '');
          } else {
            console.error('Invalid reCAPTCHA config format:', configData);
          }
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
      // Check if grecaptcha.reset exists before calling it
      if (window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
        window.grecaptcha.reset();
        setRecaptchaToken(null);
      } else {
        // Just reset the token if the reset function isn't available
        setRecaptchaToken(null);
      }
    },
  };
};
