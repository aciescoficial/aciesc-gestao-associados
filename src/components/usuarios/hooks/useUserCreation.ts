
import { useState, useCallback } from 'react';
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { handleError } from '@/utils/errorHandling';

export const useUserCreation = (onSuccess: (newUser: User) => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const addUser = useCallback(async (newUser: Partial<User>) => {
    if (!newUser.email || !newUser.name) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha pelo menos o nome e email do usuário.",
        variant: "destructive"
      });
      return false;
    }
    
    setLoading(true);
    
    try {
      console.log("Creating user:", newUser);
      
      // Prepare user data
      const userData = {
        email: newUser.email,
        nome: newUser.name.split(' ')[0] || newUser.name,
        sobrenome: newUser.name.split(' ').slice(1).join(' ') || '',
        role: newUser.role,
        tags: newUser.tags || [],
        associado_id: newUser.associado_id,
        empresa_id: newUser.empresa_id,
        active: newUser.active === undefined ? true : newUser.active
      };
      
      // Try to use the edge function to create the user
      try {
        console.log("Attempting to create user via Edge Function");
        const { data, error } = await supabase.functions.invoke('create-user', {
          body: userData
        });
        
        if (error) {
          console.error("Edge function error:", error);
          throw error;
        }
        
        console.log("Edge function response:", data);
        
        const userId = data.userId || data.user?.id;
        
        if (!userId) {
          throw new Error('Falha ao obter ID do usuário criado');
        }
        
        // Construct a complete user object to return
        const createdUser: User = {
          id: userId,
          name: newUser.name || '',
          email: newUser.email || '',
          role: newUser.role || 'user',
          tags: newUser.tags || [],
          active: newUser.active === undefined ? true : newUser.active,
          createdAt: new Date(),
          associado_id: newUser.associado_id,
          empresa_id: newUser.empresa_id,
        };

        // Call the success callback with the created user
        onSuccess(createdUser);
        
        toast({
          title: "Usuário criado",
          description: "O usuário foi criado com sucesso.",
          variant: "default"
        });
        
        return true;
      } catch (edgeFunctionError) {
        console.error("Edge function failed, attempting direct database creation:", edgeFunctionError);
        
        // Fallback to direct database insertion if edge function fails
        return await createUserDirectly(newUser, onSuccess, toast);
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [onSuccess, toast]);

  // Fallback function to create user directly in the database
  const createUserDirectly = async (
    newUser: Partial<User>, 
    onSuccess: (newUser: User) => void,
    toast: any
  ) => {
    try {
      console.log("Creating user directly in database");
      
      // Generate a UUID for the user
      const userId = uuidv4();
      
      // Create user record directly in the database
      const { error: userError } = await supabase
        .from("user")
        .insert({
          id: userId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role || 'user',
          tags: newUser.tags || [],
          associado_id: newUser.associado_id,
          empresa_id: newUser.empresa_id,
          active: newUser.active === undefined ? true : newUser.active,
          require_password_reset: true
        });
        
      if (userError) {
        console.error("Error creating user directly:", userError);
        throw userError;
      }
      
      // Construct a complete user object to return
      const createdUser: User = {
        id: userId,
        name: newUser.name || '',
        email: newUser.email || '',
        role: newUser.role || 'user',
        tags: newUser.tags || [],
        active: newUser.active === undefined ? true : newUser.active,
        createdAt: new Date(),
        associado_id: newUser.associado_id,
        empresa_id: newUser.empresa_id,
      };

      // Call the success callback with the created user
      onSuccess(createdUser);
      
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado diretamente no banco de dados. É necessário enviar um convite por email manualmente.",
        variant: "default"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error creating user directly:", error);
      handleError(error, "Falha ao criar usuário diretamente no banco de dados", "createUserDirectly");
      return false;
    }
  };

  return {
    loading,
    addUser
  };
};
