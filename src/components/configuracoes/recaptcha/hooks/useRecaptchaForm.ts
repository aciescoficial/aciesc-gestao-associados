
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { RecaptchaFormValues, RecaptchaConfigValues } from '../types';

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
    version: z.enum(['v2', 'v3']).default('v2'),
  });

  const form = useForm<RecaptchaFormValues>({
    resolver: zodResolver(recaptchaSchema),
    defaultValues: {
      enabled: false,
      siteKey: '',
      secretKey: '',
      threshold: 0.5,
      version: 'v2',
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
          // Type assertion with a safer approach
          const configData = data.configuracoes as unknown;
          
          if (typeof configData === 'object' && configData !== null) {
            const configObj = configData as Record<string, any>;
            
            const safeConfig: RecaptchaConfigValues = {
              enabled: !!configObj.enabled,
              siteKey: configObj.siteKey || '',
              secretKey: configObj.secretKey || '',
              version: (configObj.version === 'v3' ? 'v3' : 'v2') as 'v2' | 'v3',
              scoreThreshold: Number(configObj.scoreThreshold) || 0.5,
            };
            
            setConfig(safeConfig);
            
            form.reset({
              enabled: safeConfig.enabled,
              siteKey: safeConfig.siteKey,
              secretKey: safeConfig.secretKey,
              threshold: safeConfig.scoreThreshold,
              version: safeConfig.version,
            });
          }
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
        version: values.version,
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
