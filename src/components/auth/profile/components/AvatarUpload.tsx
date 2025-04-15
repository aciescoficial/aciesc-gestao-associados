
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logUserActivity } from '@/components/audit/services/userActivityService';
import { ImageCropper } from './ImageCropper';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface AvatarUploadProps {
  user: any;
  avatarUrl: string | null;
  onAvatarUpdate: (url: string) => void;
}

export const AvatarUpload = ({ user, avatarUrl, onAvatarUpdate }: AvatarUploadProps) => {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [fileToCrop, setFileToCrop] = useState<File | null>(null);
  const [showSizeAlert, setShowSizeAlert] = useState(false);
  const { toast } = useToast();
  
  const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
  const RECOMMENDED_SIZE = "400x400";
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    const file = e.target.files[0];
    
    // Validate file size
    if (file.size > FILE_SIZE_LIMIT) {
      setShowSizeAlert(true);
      return;
    }
    
    // Create object URL for the cropper
    const objectUrl = URL.createObjectURL(file);
    setCroppingImage(objectUrl);
    setFileToCrop(file);
  };
  
  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!fileToCrop) return;
    
    setIsUploadingAvatar(true);
    setCroppingImage(null);
    
    try {
      // Create a new file from the cropped blob
      const fileExt = fileToCrop.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      const croppedFile = new File([croppedBlob], fileName, { type: `image/${fileExt}` });
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, croppedFile, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update user with avatar URL
      const { error: updateError } = await supabase
        .from('user')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Log user activity
      await logUserActivity(user.id, 'Atualização de foto de perfil');
      
      onAvatarUpdate(data.publicUrl);
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar foto",
        description: error.message || "Não foi possível atualizar a foto de perfil.",
      });
    } finally {
      setIsUploadingAvatar(false);
      // Clean up object URL
      if (croppingImage) {
        URL.revokeObjectURL(croppingImage);
      }
    }
  };
  
  const handleCropCancel = () => {
    if (croppingImage) {
      URL.revokeObjectURL(croppingImage);
    }
    setCroppingImage(null);
    setFileToCrop(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-24 h-24 border-2 border-aciesc-primary">
          <AvatarImage src={avatarUrl || undefined} alt="User avatar" />
          <AvatarFallback>
            {user.email?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <label 
          htmlFor="avatar-upload" 
          className="absolute bottom-0 right-0 bg-aciesc-primary text-white rounded-full p-1.5 cursor-pointer hover:bg-aciesc-dark transition-colors"
        >
          <Camera className="h-4 w-4" />
          <input 
            id="avatar-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileSelect}
            disabled={isUploadingAvatar}
          />
        </label>
      </div>
      
      {isUploadingAvatar && <p className="text-xs text-muted-foreground">Enviando...</p>}
      
      <p className="text-xs text-muted-foreground">
        Tamanho recomendado: {RECOMMENDED_SIZE} pixels. Máx: 5MB
      </p>
      
      {croppingImage && (
        <ImageCropper 
          imageUrl={croppingImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1}
        />
      )}
      
      <AlertDialog open={showSizeAlert} onOpenChange={setShowSizeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arquivo muito grande</AlertDialogTitle>
            <AlertDialogDescription>
              O arquivo selecionado é muito grande. Por favor, escolha uma imagem com até 5MB.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSizeAlert(false)}>Entendi</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
