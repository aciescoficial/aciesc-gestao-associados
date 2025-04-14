
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { recaptchaSchema, RecaptchaFormValues } from '../types';

interface UseRecaptchaFormProps {
  toast: any;
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
          .single();
          
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
      const { error } = await extendedSupabase
        .from('configuracoes')
        .upsert({
          tipo: 'recaptcha',
          configuracoes: values,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'tipo'
        });
        
      if (error) throw error;
      
      toast({
        title: 'Configurações salvas',
        description: 'As configurações do reCAPTCHA foram salvas com sucesso.',
      });
    } catch (error: any) {
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
