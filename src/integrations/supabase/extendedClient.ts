
import { supabase } from "./client";
import { ExtendedDatabase } from "@/types/database";

// Extended supabase client with typed tables
export const extendedSupabase = supabase as unknown as ReturnType<typeof createExtendedClient<ExtendedDatabase>>;

// This is a type helper function, not meant to be called
function createExtendedClient<T>() {
  return supabase as any;
}

// Helper function to create storage bucket if it doesn't exist
export async function ensureStorageBucketExists(bucketName: string, isPublic: boolean = false) {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create bucket using standard storage API instead of RPC
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (error) throw error;
      console.log(`Created storage bucket: ${bucketName}`);
      return true;
    }
    return true;
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName} exists:`, error);
    return false;
  }
}

// Helper function to check if a user has admin role and can delete records
export async function checkAdminPermission(): Promise<boolean> {
  try {
    const { data: isAdmin, error } = await supabase.rpc('has_role', {
      user_id: (await supabase.auth.getUser()).data.user?.id,
      role_to_check: 'admin'
    });
    
    if (error) throw error;
    return !!isAdmin;
  } catch (error) {
    console.error("Error checking admin permission:", error);
    return false;
  }
}

// Function to secure delete operations for associates and companies
export async function secureDelete(tableName: string, id: string): Promise<boolean> {
  const isAdmin = await checkAdminPermission();
  
  if (!isAdmin) {
    throw new Error("Apenas administradores podem excluir registros");
  }
  
  // Using type assertion to allow dynamic table names
  const { error } = await supabase
    .from(tableName as any)
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
}
