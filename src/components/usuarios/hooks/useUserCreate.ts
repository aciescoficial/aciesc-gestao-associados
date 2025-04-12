
import { useState, useCallback } from 'react';
import { User, UserRole, UserTag } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { mapToDbRole } from '../utils/roleUtils';

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
    try {
      // Step 1: Create the user in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email!,
        email_confirm: true,
        password: 'temporary-password', // Temporary password, will be changed on first login
        user_metadata: {
          name: newUser.name,
          role: mapToDbRole(newUser.role as UserRole),
          tags: newUser.tags,
          active: true,
          associado_id: newUser.associado_id,
          empresa_id: newUser.empresa_id
        }
      });

      if (authError) throw authError;

      // Step 2: Update the profile with role, tags, and linked entities
      if (authData && authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: newUser.name,
            role: mapToDbRole(newUser.role as UserRole),
            tags: newUser.tags || [],
            email: newUser.email,
            associado_id: newUser.associado_id,
            empresa_id: newUser.empresa_id
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

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

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating user:", error);
      return false;
    }
  }, [newUser, onSuccess]);

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
