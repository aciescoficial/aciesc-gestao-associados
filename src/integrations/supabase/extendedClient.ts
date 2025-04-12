
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
      // Create bucket via RPC call since storage.createBucket is not available
      await supabase.rpc('create_storage_bucket', {
        name: bucketName,
        public: isPublic,
        file_size_limit: 10485760 // 10MB
      });
      console.log(`Created storage bucket: ${bucketName}`);
      return true;
    }
    return true;
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName} exists:`, error);
    return false;
  }
}
