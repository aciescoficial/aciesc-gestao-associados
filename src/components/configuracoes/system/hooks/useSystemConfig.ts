
import { useState, useEffect } from 'react';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { SystemConfigValues } from '../../types/systemConfig';
import { supabase } from '@/integrations/supabase/client';

export const useSystemConfig = () => {
  const [config, setConfig] = useState<SystemConfigValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        
        // First try to fetch from configuracoes table
        try {
          const { data, error } = await extendedSupabase
            .from('configuracoes')
            .select('*')
            .eq('tipo', 'sistema')
            .single();

          if (data) {
            setConfig(data.configuracoes as SystemConfigValues);
            return;
          }
        } catch (configError) {
          console.warn('Error fetching from configuracoes table, falling back to system_config:', configError);
        }
        
        // Fall back to system_config table
        const { data: systemConfigData } = await supabase
          .from('system_config')
          .select('*')
          .eq('key', 'SHOW_SYSTEM_MESSAGES')
          .single();
        
        if (systemConfigData) {
          setConfig({
            showSystemMessages: systemConfigData.value === 'true'
          });
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
      // Save to system_config table first for compatibility
      const { error: systemConfigError } = await supabase
        .from('system_config')
        .upsert({
          key: 'SHOW_SYSTEM_MESSAGES',
          value: values.showSystemMessages.toString()
        });
      
      if (systemConfigError) {
        console.error('Error saving to system_config:', systemConfigError);
      }
      
      // Try to save to configuracoes table if it exists
      try {
        // Check if config already exists
        const { data: existingConfig } = await extendedSupabase
          .from('configuracoes')
          .select('id')
          .eq('tipo', 'sistema')
          .single();

        if (existingConfig) {
          // Update existing configuration
          await extendedSupabase
            .from('configuracoes')
            .update({
              configuracoes: values,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingConfig.id);
        } else {
          // Create new configuration
          await extendedSupabase
            .from('configuracoes')
            .insert({
              tipo: 'sistema',
              configuracoes: values,
            });
        }
      } catch (configError) {
        console.warn('Error saving to configuracoes table, but saved to system_config:', configError);
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
