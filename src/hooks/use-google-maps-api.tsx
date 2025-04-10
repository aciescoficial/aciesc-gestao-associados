
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export const useGoogleMapsApi = () => {
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('google_maps_api_key') || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      setIsLoading(true);
      
      // First try to get from localStorage (for compatibility)
      const localKey = localStorage.getItem('google_maps_api_key');
      
      if (!localKey) {
        try {
          // If not found in localStorage, try to fetch from database
          // Using custom type assertion for system_config table
          const { data, error } = await supabase
            .from('system_config')
            .select('*')
            .eq('key', 'google_maps_api_key')
            .maybeSingle() as { data: SystemConfig | null, error: any };

          if (!error && data && data.value) {
            localStorage.setItem('google_maps_api_key', data.value);
            setApiKey(data.value);
          }
        } catch (err) {
          console.error("Error fetching API key:", err);
        }
      }
      
      setIsLoading(false);
    };

    fetchApiKey();
  }, []);

  return { apiKey, isLoading };
};
