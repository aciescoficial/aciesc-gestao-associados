
import { useState } from 'react';
import { UserRole, User } from '../types';
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mapToDbRole } from '../utils/roleUtils';

export const useUserCreate = (onSuccess: (user: User) => void) => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as UserRole,
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNewUserChange = (field: string, value: string) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const addUser = async () => {
    setIsLoading(true);
    try {
      // Validate input
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Map the role properly before sending to Supabase
      const dbRole = mapToDbRole(newUser.role);

      // Create the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            name: newUser.name,
            role: dbRole
          }
        }
      });

      if (authError) throw authError;
      
      if (authData && authData.user) {
        // Set the user role in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: newUser.name,
            role: dbRole as any // Use type assertion to bypass TypeScript check
          })
          .eq('id', authData.user.id);
        
        if (profileError) {
          console.error("Error updating profile role:", profileError);
          // Continue anyway since the user was created
        }
        
        const createdUser: User = {
          id: authData.user.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          active: true,
          createdAt: new Date()
        };
        
        onSuccess(createdUser);
        resetNewUser();
        
        toast({
          title: "Usuário criado",
          description: `O usuário ${createdUser.name} foi criado com sucesso.`
        });
      } else {
        throw new Error('Não foi possível criar o usuário. Nenhum dado retornado.');
      }
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      
      toast({
        title: "Erro ao criar usuário",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetNewUser = () => {
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      password: ''
    });
  };

  return {
    newUser,
    isLoading,
    handleNewUserChange,
    addUser,
    resetNewUser
  };
};
