
import { useState, useCallback } from 'react';
import { User, UserRole, UserTag } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { mapToDbRole } from '../utils/roleUtils';
import { useToast } from '@/hooks/use-toast';

export const useUserCreate = (onSuccess: (user: User) => void) => {
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'user' as UserRole,
    tags: [] as UserTag[],
    active: true,
    associado_id: undefined,
    associado_cpf: undefined,
    empresa_id: undefined,
    empresa_cnpj: undefined
  });

  const [associados, setAssociados] = useState<Array<{id: string, cpf: string, nome: string, sobrenome: string}>>([]);
  const [empresas, setEmpresas] = useState<Array<{id: string, cnpj: string, nome_fantasia: string}>>([]);
  const [loadingAssociados, setLoadingAssociados] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const { toast } = useToast();

  const fetchAssociados = useCallback(async () => {
    setLoadingAssociados(true);
    try {
      const { data, error } = await supabase
        .from('associados')
        .select('id, cpf, nome, sobrenome')
        .eq('status', 'ativo');
        
      if (error) throw error;
      setAssociados(data || []);
    } catch (error) {
      console.error("Error fetching associados:", error);
    } finally {
      setLoadingAssociados(false);
    }
  }, []);

  const fetchEmpresas = useCallback(async () => {
    setLoadingEmpresas(true);
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, cnpj, nome_fantasia')
        .eq('status', 'ativo');
        
      if (error) throw error;
      setEmpresas(data || []);
    } catch (error) {
      console.error("Error fetching empresas:", error);
    } finally {
      setLoadingEmpresas(false);
    }
  }, []);

  const handleNewUserChange = (field: string, value: any) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const addUser = useCallback(async () => {
    console.log("Tentando adicionar usuário:", newUser);
    
    try {
      if (!newUser.email || !newUser.name) {
        toast({
          title: "Campos obrigatórios",
          description: "Email e nome são obrigatórios",
          variant: "destructive"
        });
        return false;
      }
      
      // Generate a random password
      const tempPassword = `temp${Math.random().toString(36).slice(2, 10)}`;
      
      console.log("Criando usuário com email:", newUser.email);
      
      // Step 1: Create the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: tempPassword,
        options: {
          data: {
            name: newUser.name,
            role: newUser.role,
            tags: newUser.tags,
            associado_id: newUser.associado_id,
            empresa_id: newUser.empresa_id
          }
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        toast({
          title: "Erro ao criar usuário",
          description: authError.message,
          variant: "destructive"
        });
        return false;
      }

      console.log("Usuário Auth criado:", authData);

      // Step 2: Update the user table with additional data
      if (authData && authData.user) {
        const userData = {
          id: authData.user.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          tags: newUser.tags || [],
          active: true,
          associado_id: newUser.associado_id,
          empresa_id: newUser.empresa_id
        };
        
        console.log("Atualizando dados do usuário:", userData);
        
        const { error: userError } = await supabase
          .from('user')
          .upsert(userData);

        if (userError) {
          console.error("User update error:", userError);
          toast({
            title: "Erro ao atualizar dados do usuário",
            description: userError.message,
            variant: "destructive"
          });
          return false;
        }

        // Return the created user to the caller
        onSuccess({
          id: authData.user.id,
          name: newUser.name!,
          email: newUser.email!,
          role: newUser.role as UserRole,
          tags: newUser.tags || [],
          active: true,
          createdAt: new Date(),
          associado_id: newUser.associado_id,
          associado_cpf: newUser.associado_cpf,
          empresa_id: newUser.empresa_id,
          empresa_cnpj: newUser.empresa_cnpj
        });

        // Reset the form
        setNewUser({
          name: '',
          email: '',
          role: 'user' as UserRole,
          tags: [] as UserTag[],
          active: true,
          associado_id: undefined,
          associado_cpf: undefined,
          empresa_id: undefined,
          empresa_cnpj: undefined
        });

        toast({
          title: "Usuário criado com sucesso",
          description: "Um email com instruções de acesso foi enviado para o usuário.",
        });

        return true;
      }
      
      toast({
        title: "Erro ao criar usuário",
        description: "Não foi possível obter os dados do usuário criado.",
        variant: "destructive"
      });
      return false;
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
      return false;
    }
  }, [newUser, onSuccess, toast]);

  return {
    newUser,
    handleNewUserChange,
    addUser,
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas,
  };
};
