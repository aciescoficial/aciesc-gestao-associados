
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

/**
 * File storage operations for associados
 */

export const uploadFoto = async (id: string, file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}.${fileExt}`;
    
    // Verificar se o bucket existe
    const { data: buckets } = await supabase
      .storage
      .listBuckets();
    
    let bucketExists = false;
    if (buckets) {
      bucketExists = buckets.some(bucket => bucket.name === 'associados');
    }
    
    // Criar bucket se não existir
    if (!bucketExists) {
      await supabase
        .storage
        .createBucket('associados', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
        });
    }
    
    const { error } = await supabase
      .storage
      .from('associados')
      .upload(fileName, file, {
        upsert: true
      });
      
    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
    
    // Get public URL
    const { data: publicUrl } = supabase
      .storage
      .from('associados')
      .getPublicUrl(fileName);
      
    return publicUrl.publicUrl;
  } catch (error) {
    const errorMsg = handleSupabaseError(error);
    console.error("Erro ao fazer upload da foto:", errorMsg);
    throw error;
  }
};
