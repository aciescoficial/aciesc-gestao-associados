
import { useState, useEffect } from 'react';

interface SystemConfig {
  showSystemMessages: boolean;
}

export function useSystemConfig(debug = false) {
  const [config, setConfig] = useState<SystemConfig>({
    showSystemMessages: true
  });
  
  // Load configuration from localStorage or use defaults
  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem('systemConfig');
      
      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig);
        setConfig(prev => ({
          ...prev,
          ...parsedConfig
        }));
        
        if (debug) {
          console.log('Loaded system config from storage:', parsedConfig);
        }
      }
    } catch (error) {
      console.error('Error loading system config:', error);
    }
  }, [debug]);
  
  // Function to update configuration
  const updateConfig = (newConfig: Partial<SystemConfig>) => {
    try {
      const updatedConfig = {
        ...config,
        ...newConfig
      };
      
      // Save to localStorage
      localStorage.setItem('systemConfig', JSON.stringify(updatedConfig));
      
      // Update state
      setConfig(updatedConfig);
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('system-config-updated', {
        detail: updatedConfig
      }));
      
      if (debug) {
        console.log('Updated system config:', updatedConfig);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating system config:', error);
      return false;
    }
  };
  
  return {
    ...config,
    updateConfig
  };
}
