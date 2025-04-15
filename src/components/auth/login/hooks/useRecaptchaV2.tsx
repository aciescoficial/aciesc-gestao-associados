
import { useState, useEffect, useCallback } from 'react';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { RecaptchaFormValues } from '@/components/configuracoes/recaptcha/types';
import { useAuth } from '@/components/auth/context/AuthContext';

interface UseRecaptchaV2Return {
  recaptchaLoaded: boolean;
  isLoading: boolean;
  isEnabled: boolean;
  siteKey: string;
  executeRecaptcha: (action?: string) => Promise<string>;
  verifyRecaptcha: (token: string) => Promise<boolean>;
}

/**
 * Hook for interacting with Google reCAPTCHA v2 implementation
 * @returns Methods and state for reCAPTCHA operations
 */
export const useRecaptchaV2 = (): UseRecaptchaV2Return => {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [config, setConfig] = useState<RecaptchaFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load reCAPTCHA configuration from database
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data, error } = await extendedSupabase
          .from('configuracoes')
          .select('*')
          .eq('tipo', 'recaptcha')
          .maybeSingle();

        if (error) {
          console.error('Error loading reCAPTCHA configuration:', error);
          // Use default configuration if none exists
          setConfig({
            siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Google test key
            secretKey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe', // Google test secret
            enabled: true,
            threshold: 0.5,
          });
          return;
        }

        if (data && data.configuracoes) {
          setConfig({
            siteKey: data.configuracoes.siteKey || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
            secretKey: data.configuracoes.secretKey || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
            enabled: data.configuracoes.enabled !== undefined ? data.configuracoes.enabled : true,
            threshold: data.configuracoes.threshold || 0.5,
          });
        } else {
          // Use default configuration if none exists
          setConfig({
            siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
            secretKey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
            enabled: true,
            threshold: 0.5,
          });
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
        // Use default configuration if error occurs
        setConfig({
          siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
          secretKey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
          enabled: true,
          threshold: 0.5,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Initialize reCAPTCHA script
  useEffect(() => {
    if (!config || isLoading) return;

    // Skip if reCAPTCHA is disabled in settings
    if (!config.enabled) {
      setRecaptchaLoaded(true);
      return;
    }

    const loadRecaptchaScript = () => {
      if (window.grecaptcha) {
        setRecaptchaLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${config.siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.grecaptcha?.ready(() => {
          console.log('reCAPTCHA loaded successfully');
          setRecaptchaLoaded(true);
        });
      };
      
      script.onerror = (error) => {
        console.error('Error loading reCAPTCHA script:', error);
      };
      
      document.body.appendChild(script);
    };

    loadRecaptchaScript();

    return () => {
      // Cleanup function
      window.onRecaptchaLoad = () => {};
    };
  }, [config, isLoading]);

  // Execute reCAPTCHA verification
  const executeRecaptcha = useCallback(async (action = 'login'): Promise<string> => {
    if (!config?.enabled) return 'recaptcha-disabled';
    if (!recaptchaLoaded || !window.grecaptcha) {
      console.warn('reCAPTCHA not loaded yet');
      return '';
    }

    try {
      console.log('Executing reCAPTCHA with site key:', config.siteKey);
      const token = await window.grecaptcha.execute(config.siteKey, { action });
      console.log('reCAPTCHA token generated:', token.substring(0, 10) + '...');
      return token;
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error);
      return '';
    }
  }, [recaptchaLoaded, config]);

  // Verify reCAPTCHA token on the backend
  const verifyRecaptcha = useCallback(async (token: string): Promise<boolean> => {
    if (!config?.enabled) return true;
    if (!token) return false;

    // In a real implementation, this would call an edge function to verify the token
    // For now, we're just checking if the token exists and is not empty
    return token.length > 10;
  }, [config]);

  return {
    recaptchaLoaded,
    isLoading,
    executeRecaptcha,
    verifyRecaptcha,
    isEnabled: config?.enabled || false,
    siteKey: config?.siteKey || '',
  };
};

// Type declaration for global grecaptcha object
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: string | HTMLElement, parameters: any) => number;
    };
    onRecaptchaLoad: () => void;
  }
}
