
import { useState } from 'react';
import { UserRole, User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mapToDbRole } from '../utils/roleUtils';

export const useUserCreate = (onSuccess: (user: User) => void) => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as UserRole,
    password: ''
  });
  const { toast } = useToast();

  const handleNewUserChange = (field: string, value: string) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const addUser = async () => {
    try {
      // Validate input
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      // Create the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            name: newUser.name,
          }
        }
      });

      if (authError) throw authError;
      
      if (authData && authData.user) {
        // Map the role properly
        const dbRole = mapToDbRole(newUser.role);
        
        // Set the user role in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: newUser.name,
            role: dbRole
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
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Erro ao criar usuário",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "Não foi possível criar o usuário.",
        variant: "destructive"
      });
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
    handleNewUserChange,
    addUser,
    resetNewUser
  };
};
