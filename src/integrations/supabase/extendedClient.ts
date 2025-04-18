
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wpcstzjczfgbfwgzwktf.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwY3N0empjemZnYmZ3Z3p3a3RmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk4NzU5NywiZXhwIjoyMDU5NTYzNTk3fQ.DYPmPYmExt3tIbNJuMu9qXxfCHBDpdUyZQvKpnmW4fo";

// Create an extended client with admin privileges for special operations
export const extendedSupabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Securely delete a record from a table using the extended client with admin privileges.
 * This bypasses RLS policies and should only be used by admin users.
 * 
 * @param table - The table name to delete from
 * @param id - The ID of the record to delete
 * @returns Promise with the delete operation result
 */
export const secureDelete = async (table: string, id: string): Promise<{ success: boolean, error: any | null }> => {
  try {
    const { error } = await extendedSupabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Exception deleting from ${table}:`, error);
    return { success: false, error };
  }
};

