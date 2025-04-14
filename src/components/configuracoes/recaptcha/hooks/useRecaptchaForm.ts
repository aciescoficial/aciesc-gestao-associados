
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { recaptchaSchema, RecaptchaFormValues } from '../types';
import { type ToastProps } from '@/components/ui/toast';

interface UseRecaptchaFormProps {
  toast: (props: ToastProps) => { id: string; dismiss: () => void; update: (props: any) => void };
}

export const useRecaptchaForm = ({ toast }: UseRecaptchaFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<RecaptchaFormValues>({
    resolver: zodResolver(recaptchaSchema),
    defaultValues: {
      siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Chave de teste do Google reCAPTCHA
      secretKey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe', // Chave secreta de teste
      enabled: true,
      threshold: 0.5,
    },
  });

  // Carregar configurações do reCAPTCHA
  useEffect(() => {
    const loadRecaptchaSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await extendedSupabase
          .from('configuracoes')
          .select('*')
          .eq('tipo', 'recaptcha')
          .maybeSingle();
          
        if (error) {
          console.error('Erro ao carregar configurações do reCAPTCHA:', error);
          return;
        }
        
        if (data) {
          const settings = data.configuracoes || {};
          form.reset({
            siteKey: settings.siteKey || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
            secretKey: settings.secretKey || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
            enabled: settings.enabled !== undefined ? settings.enabled : true,
            threshold: settings.threshold || 0.5,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecaptchaSettings();
  }, [form]);

  const saveSettings = async (values: RecaptchaFormValues) => {
    setIsLoading(true);
    try {
      // First check if a record exists for this configuration type
      const { data: existingConfig } = await extendedSupabase
        .from('configuracoes')
        .select('id')
        .eq('tipo', 'recaptcha')
        .maybeSingle();
        
      let error;
      
      if (existingConfig) {
        // If exists, update it
        const result = await extendedSupabase
          .from('configuracoes')
          .update({
            configuracoes: values,
            updated_at: new Date().toISOString(),
          })
          .eq('tipo', 'recaptcha');
          
        error = result.error;
      } else {
        // If not, insert a new record
        const result = await extendedSupabase
          .from('configuracoes')
          .insert({
            tipo: 'recaptcha',
            configuracoes: values,
            updated_at: new Date().toISOString(),
          });
          
        error = result.error;
      }
        
      if (error) throw error;
      
      toast({
        title: 'Configurações salvas',
        description: 'As configurações do reCAPTCHA foram salvas com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro ao salvar configurações',
        description: error.message || 'Ocorreu um erro ao salvar as configurações do reCAPTCHA.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    saveSettings
  };
};
