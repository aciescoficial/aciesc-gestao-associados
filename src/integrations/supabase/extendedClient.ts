
import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { supabase } from './client';

// Extended client uses the service_role key
// WARNING: Only use service_role for server-side operations or trusted admin functions
const SUPABASE_URL = "https://wpcstzjczfgbfwgzwktf.supabase.co";
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY || ""; // Using Vite's environment variable syntax

// Create an extended client with admin privileges for special operations
// Note: This client should be used VERY carefully and only in appropriate contexts
export const extendedSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Add admin auth methods to the regular supabase client
// This makes it possible to use admin functions through the regular client
if (!supabase.auth.admin) {
  // @ts-ignore - Adding admin property to auth
  supabase.auth.admin = {
    // Function to create a user with admin privileges (bypassing RLS)
    createUser: async (userDetails: any) => {
      try {
        console.log("Admin createUser called with:", userDetails);
        
        // Use the regular signup method since we can't use service_role in the client
        const { data, error } = await supabase.auth.signUp({
          email: userDetails.email,
          password: userDetails.password,
          options: {
            data: userDetails.user_metadata,
            emailRedirectTo: undefined // Don't send confirmation email
          }
        });
        
        return { data, error };
      } catch (error) {
        console.error("Error in admin createUser:", error);
        return { data: null, error };
      }
    }
  };
}

// Generic error handling for Supabase operations
export const handleApiError = (error: PostgrestError | null): string => {
  if (!error) return '';
  
  console.error('API Error:', error);
  
  if (error.code === '23505') {
    return 'Este registro já existe no sistema.';
  } else if (error.code === '23503') {
    return 'Erro de referência: o registro relacionado não existe.';
  } else if (error.message.includes('violates row level security')) {
    return 'Você não tem permissão para realizar esta ação.';
  }
  
  return error.message || 'Ocorreu um erro na operação.';
};

// Add secure delete function for admin operations
export const secureDelete = async (table: string, id: string): Promise<void> => {
  try {
    // Cast table to any to bypass TypeScript's strict type checking
    const { error } = await supabase
      .from(table as any)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw new Error(`Failed to delete ${table} record: ${(error as Error).message}`);
  }
};
