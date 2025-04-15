
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export const useProfileData = (user: any) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [cpf, setCpf] = useState('');
  const [creci, setCreci] = useState('');
  const [associadoId, setAssociadoId] = useState<string | undefined>(undefined);
  const [empresaId, setEmpresaId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Query user table - using maybeSingle() instead of single() to handle case when no row is found
        const { data: userData, error: userError } = await supabase
          .from('user')
          .select('name, phone, role, avatar_url, city, state, cpf, creci, associado_id, empresa_id')
          .eq('id', user.id)
          .maybeSingle();
          
        if (userError) throw userError;
        
        if (userData) {
          setName(userData.name || '');
          setPhone(userData.phone || '');
          setRole(userData.role || '');
          setAvatarUrl(userData.avatar_url);
          setCity(userData.city || '');
          setState(userData.state || '');
          setCpf(userData.cpf || '');
          setCreci(userData.creci || '');
          setAssociadoId(userData.associado_id);
          setEmpresaId(userData.empresa_id);
        } else {
          // No user found, create a new user record
          const { error: insertError } = await supabase
            .from('user')
            .insert({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.name || '',
              role: 'user'
            });
            
          if (insertError) {
            console.error('Error creating user record:', insertError);
            toast({
              variant: "destructive",
              title: "Erro ao criar perfil",
              description: "Não foi possível criar seu perfil. Por favor, tente novamente mais tarde."
            });
          } else {
            // Set defaults after creating user
            setName(user.user_metadata?.name || '');
            setRole('user');
          }
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
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
    city,
    setCity,
    state,
    setState,
    cpf,
    setCpf,
    creci,
    setCreci,
    associadoId,
    empresaId,
    setAssociadoId,
    setEmpresaId,
    isLoading
  };
};
