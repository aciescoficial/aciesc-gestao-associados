
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AvatarUploadProps {
  user: any;
  avatarUrl: string | null;
  onAvatarUpdate: (url: string) => void;
}

export const AvatarUpload = ({ user, avatarUrl, onAvatarUpdate }: AvatarUploadProps) => {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { toast } = useToast();
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;
    
    setIsUploadingAvatar(true);
    
    try {
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      onAvatarUpdate(data.publicUrl);
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar foto",
        description: error.message,
      });
    } finally {
      setIsUploadingAvatar(false);
    }
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
        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-aciesc-primary text-white rounded-full p-1.5 cursor-pointer hover:bg-aciesc-dark transition-colors">
          <Camera className="h-4 w-4" />
          <input 
            id="avatar-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleAvatarUpload}
            disabled={isUploadingAvatar}
          />
        </label>
      </div>
      {isUploadingAvatar && <p className="text-xs text-muted-foreground">Enviando...</p>}
    </div>
  );
};
