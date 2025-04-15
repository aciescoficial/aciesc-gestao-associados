
import { useState, useEffect } from 'react';
import { RecaptchaFormValues, RecaptchaConfigValues } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface UseRecaptchaFormOptions {
  toast?: any;
}

export const useRecaptchaForm = (options?: UseRecaptchaFormOptions) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<RecaptchaConfigValues>({
    enabled: false,
    siteKey: '',
    secretKey: '',
    version: 'v2',
    scoreThreshold: 0.5,
  });

  const recaptchaSchema = z.object({
    siteKey: z.string().min(1, 'Chave do site é obrigatória'),
    secretKey: z.string().min(1, 'Chave secreta é obrigatória'),
    enabled: z.boolean().default(true),
    threshold: z.number().min(0).max(1).default(0.5),
  });

  const form = useForm<RecaptchaFormValues>({
    resolver: zodResolver(recaptchaSchema),
    defaultValues: {
      enabled: false,
      siteKey: '',
      secretKey: '',
      threshold: 0.5,
    },
  });

  // Check authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Auth check error:', error);
        options?.toast?.({
          title: 'Erro',
          description: 'Erro ao verificar autenticação',
          variant: 'destructive',
        });
        return false;
      }
      return !!data.session;
    };
    
    checkAuth().then(setIsAuthenticated);
  }, [options]);

  useEffect(() => {
    const fetchConfig = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('configuracoes')
          .select('*')
          .eq('tipo', 'recaptcha')
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data && data.configuracoes) {
          const configData = data.configuracoes;
          
          setConfig({
            enabled: configData.enabled || false,
            siteKey: configData.siteKey || '',
            secretKey: configData.secretKey || '',
            version: configData.version || 'v2',
            scoreThreshold: configData.scoreThreshold || 0.5,
          });
          
          form.reset({
            enabled: configData.enabled || false,
            siteKey: configData.siteKey || '',
            secretKey: configData.secretKey || '',
            threshold: configData.scoreThreshold || 0.5,
          });
        }
      } catch (error: any) {
        console.error('Error fetching reCAPTCHA config:', error);
        options?.toast?.({
          title: 'Erro',
          description: error.message || 'Erro ao carregar configurações',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [isAuthenticated, form, options]);

  const saveConfig = async (values: RecaptchaFormValues) => {
    if (!isAuthenticated) {
      options?.toast?.({
        title: 'Acesso negado',
        description: 'Você precisa estar autenticado para salvar configurações',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsSaving(true);
    try {
      const configData = {
        enabled: values.enabled,
        siteKey: values.siteKey,
        secretKey: values.secretKey,
        version: 'v2', // Default to v2 for now
        scoreThreshold: values.threshold,
      };
      
      const { error } = await supabase
        .from('configuracoes')
        .upsert({
          tipo: 'recaptcha',
          configuracoes: configData,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'tipo',
        });

      if (error) throw error;
      
      setConfig(configData);
      
      options?.toast?.({
        title: 'Sucesso',
        description: 'Configurações salvas com sucesso',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error saving reCAPTCHA config:', error);
      options?.toast?.({
        title: 'Erro',
        description: error.message || 'Erro ao salvar configurações',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveSettings = async (values: RecaptchaFormValues) => {
    return saveConfig(values);
  };

  return {
    config,
    isLoading,
    isSaving,
    saveConfig,
    form,
    saveSettings,
  };
};
