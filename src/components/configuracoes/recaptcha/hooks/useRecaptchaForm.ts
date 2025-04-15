
import { useState, useEffect } from 'react';
import { RecaptchaConfigValues, RecaptchaConfig } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

export const useRecaptchaForm = (onError?: (msg: string) => void) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<RecaptchaConfigValues>({
    enabled: false,
    siteKey: '',
    secretKey: '',
    version: 'v2',
    scoreThreshold: 0.5,
  });

  // Check authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Auth check error:', error);
        onError?.('Erro ao verificar autenticação');
        return false;
      }
      return !!data.session;
    };
    
    checkAuth().then(setIsAuthenticated);
  }, [onError]);

  useEffect(() => {
    const fetchConfig = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('recaptcha_config')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setConfig({
            enabled: data.enabled || false,
            siteKey: data.site_key || '',
            secretKey: data.secret_key || '',
            version: data.version || 'v2',
            scoreThreshold: data.score_threshold || 0.5,
          });
        }
      } catch (error: any) {
        console.error('Error fetching reCAPTCHA config:', error);
        onError?.(error.message || 'Erro ao carregar configurações');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [isAuthenticated, onError]);

  const saveConfig = async (values: RecaptchaConfigValues) => {
    if (!isAuthenticated) {
      onError?.('Você precisa estar autenticado para salvar configurações');
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('recaptcha_config')
        .upsert({
          id: 1, // Using a singleton approach with id=1
          enabled: values.enabled,
          site_key: values.siteKey,
          secret_key: values.secretKey,
          version: values.version,
          score_threshold: values.scoreThreshold,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      setConfig(values);
      return true;
    } catch (error: any) {
      console.error('Error saving reCAPTCHA config:', error);
      onError?.(error.message || 'Erro ao salvar configurações');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    config,
    isLoading,
    isSaving,
    saveConfig,
  };
};
