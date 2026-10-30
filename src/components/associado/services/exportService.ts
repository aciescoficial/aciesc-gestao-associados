
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

/**
 * Exports all associados data
 * @returns Array of associados
 */
export const exportAssociados = async () => {
  try {
    const { data, error } = await supabase
      .from('associados')
      .select('*');
    
    if (error) {
      handleSupabaseError(error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error exporting associados:", error);
    return [];
  }
};

