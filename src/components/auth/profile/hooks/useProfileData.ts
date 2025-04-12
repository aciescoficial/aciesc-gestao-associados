
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

export const useProfileData = (user: any) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Query profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, phone, role, avatar_url')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        if (profileData) {
          setName(profileData.name || '');
          setPhone(profileData.phone || '');
          setRole(profileData.role || '');
          setAvatarUrl(profileData.avatar_url);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar perfil",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, toast]);

  return {
    name,
    setName,
    phone,
    setPhone,
    role,
    avatarUrl,
    setAvatarUrl,
    isLoading
  };
};
