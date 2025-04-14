
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';

interface RecaptchaConfig {
  siteKey: string;
  enabled: boolean;
  threshold: number;
}

export const useRecaptchaV2 = () => {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [config, setConfig] = useState<RecaptchaConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configurações do reCAPTCHA do banco de dados
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data, error } = await extendedSupabase
          .from('configuracoes')
          .select('*')
          .eq('tipo', 'recaptcha')
          .single();

        if (error) {
          console.error('Erro ao carregar configurações do reCAPTCHA:', error);
          // Usar configurações padrão
          setConfig({
            siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Chave de teste do Google
            enabled: true,
            threshold: 0.5,
          });
          return;
        }

        if (data) {
          setConfig({
            siteKey: data.configuracoes?.siteKey || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
            enabled: data.configuracoes?.enabled !== undefined ? data.configuracoes.enabled : true,
            threshold: data.configuracoes?.threshold || 0.5,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Inicializar reCAPTCHA quando as configurações forem carregadas
  useEffect(() => {
    if (!config || isLoading || !config.enabled) return;

    // Inicializar reCAPTCHA
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        window.onRecaptchaLoad = () => {
          setRecaptchaLoaded(true);
        };
      }
    };

    // Carregar o script do reCAPTCHA se ainda não estiver carregado
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${config.siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => loadRecaptcha();
      document.body.appendChild(script);
    } else {
      loadRecaptcha();
    }

    return () => {
      // Cleanup
      window.onRecaptchaLoad = () => {};
    };
  }, [config, isLoading]);

  // Função para executar o reCAPTCHA
  const executeRecaptcha = useCallback(async (action = 'login'): Promise<string> => {
    if (!config?.enabled) return 'recaptcha-disabled';
    if (!recaptchaLoaded || !window.grecaptcha) {
      console.warn('reCAPTCHA não está carregado ainda');
      return '';
    }

    try {
      const token = await window.grecaptcha.execute(config.siteKey, { action });
      return token;
    } catch (error) {
      console.error('Erro ao executar reCAPTCHA:', error);
      return '';
    }
  }, [recaptchaLoaded, config]);

  // Função para verificar o token do reCAPTCHA (deve ser chamada no backend)
  const verifyRecaptcha = useCallback(async (token: string): Promise<boolean> => {
    if (!config?.enabled) return true;
    if (!token) return false;

    // Normalmente, essa verificação seria feita no backend
    // Esta é apenas uma simulação para fins de exemplo
    return token.length > 0;
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

// Tipo para o objeto grecaptcha no window
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
