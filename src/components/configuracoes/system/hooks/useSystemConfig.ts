
import { useState, useEffect } from 'react';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { SystemConfigValues } from '../../types/systemConfig';

export const useSystemConfig = () => {
  const [config, setConfig] = useState<SystemConfigValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await extendedSupabase
          .from('configuracoes')
          .select('*')
          .eq('tipo', 'sistema')
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setConfig(data.configuracoes as SystemConfigValues);
        } else {
          // Default configuration if none exists
          setConfig({
            showSystemMessages: true,
          });
        }
      } catch (err) {
        console.error('Error fetching system config:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        
        // Set default values on error
        setConfig({
          showSystemMessages: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const saveConfig = async (values: SystemConfigValues): Promise<void> => {
    try {
      // Check if config already exists
      const { data: existingConfig } = await extendedSupabase
        .from('configuracoes')
        .select('id')
        .eq('tipo', 'sistema')
        .single();

      if (existingConfig) {
        // Update existing configuration
        const { error } = await extendedSupabase
          .from('configuracoes')
          .update({
            configuracoes: values,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingConfig.id);

        if (error) throw error;
      } else {
        // Create new configuration
        const { error } = await extendedSupabase
          .from('configuracoes')
          .insert({
            tipo: 'sistema',
            configuracoes: values,
          });

        if (error) throw error;
      }

      // Update local state
      setConfig(values);
      
      // Update localStorage to immediately reflect changes
      localStorage.setItem('systemConfig', JSON.stringify(values));
      
      // Dispatch an event so other components can react
      window.dispatchEvent(new CustomEvent('system-config-updated', { 
        detail: values 
      }));
    } catch (err) {
      console.error('Error saving system config:', err);
      throw err;
    }
  };

  return {
    config,
    isLoading,
    error,
    saveConfig,
  };
};
