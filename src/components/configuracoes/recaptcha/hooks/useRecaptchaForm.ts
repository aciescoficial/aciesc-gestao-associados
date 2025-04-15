
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { RecaptchaFormValues } from '../types';
import { useAuth } from '@/components/auth/context/AuthContext';

// Schema for form validation
const recaptchaFormSchema = z.object({
  enabled: z.boolean(),
  siteKey: z.string().min(1, 'Site key é obrigatório'),
  secretKey: z.string().min(1, 'Secret key é obrigatório'),
  threshold: z.number().min(0).max(1),
});

export const useRecaptchaForm = ({ toast }: { toast: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<RecaptchaFormValues>({
    resolver: zodResolver(recaptchaFormSchema),
    defaultValues: {
      enabled: true,
      siteKey: '',
      secretKey: '',
      threshold: 0.5,
    },
  });
  
  // Load existing settings
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await extendedSupabase
          .from('configuracoes')
          .select('configuracoes')
          .eq('tipo', 'recaptcha')
          .maybeSingle();
          
        if (error) {
          console.error('Error loading reCAPTCHA settings:', error);
          return;
        }
        
        if (data?.configuracoes) {
          const settings = data.configuracoes as RecaptchaFormValues;
          form.reset({
            enabled: settings.enabled !== undefined ? settings.enabled : true,
            siteKey: settings.siteKey || '',
            secretKey: settings.secretKey || '',
            threshold: settings.threshold || 0.5,
          });
        }
      } catch (error) {
        console.error('Failed to load reCAPTCHA settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadSettings();
    }
  }, [form, user]);
  
  // Save settings
  const saveSettings = async (values: RecaptchaFormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erro de autenticação',
        description: 'Você precisa estar autenticado para salvar as configurações.',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if settings already exist
      const { data: existingData, error: existingError } = await extendedSupabase
        .from('configuracoes')
        .select('id')
        .eq('tipo', 'recaptcha')
        .maybeSingle();
      
      if (existingError) {
        throw new Error('Erro ao verificar configurações existentes: ' + existingError.message);
      }
      
      let result;
      
      if (existingData?.id) {
        // Update existing
        result = await extendedSupabase
          .from('configuracoes')
          .update({ 
            configuracoes: values,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingData.id)
          .select();
      } else {
        // Insert new
        result = await extendedSupabase
          .from('configuracoes')
          .insert({ 
            tipo: 'recaptcha', 
            configuracoes: values,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select();
      }
      
      if (result.error) {
        throw new Error('Erro ao salvar configurações: ' + result.error.message);
      }
      
      toast({
        title: 'Configurações salvas',
        description: 'As configurações do reCAPTCHA foram atualizadas com sucesso.',
      });
    } catch (error: any) {
      console.error('Failed to save reCAPTCHA settings:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar configurações',
        description: error.message || 'Ocorreu um erro ao salvar as configurações.',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { form, isLoading, saveSettings };
};
