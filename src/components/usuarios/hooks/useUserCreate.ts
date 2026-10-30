
import { useState } from 'react';
import { User, UserRole, UserTag } from '../types';
import { useAssociatedEntities } from './useAssociatedEntities';
import { useUserCreation } from './useUserCreation';

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

  const { loading, addUser } = useUserCreation(onSuccess);
  
  const {
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas
  } = useAssociatedEntities();

  const handleNewUserChange = (field: string, value: any) => {
    if (field === 'role') {
      // Reset entity links when changing role
      setNewUser(prev => ({ 
        ...prev, 
        [field]: value,
        associado_id: undefined,
        empresa_id: undefined,
        tags: value === 'empresa' ? ['empresa_conveniada'] : []
      }));
    } else {
      setNewUser(prev => ({ ...prev, [field]: value }));
    }
  };

  const addNewUser = async () => {
    const success = await addUser(newUser);
    
    if (success) {
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
    }
    
    return success;
  };

  return {
    newUser,
    handleNewUserChange,
    addUser: addNewUser,
    loading,
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas,
  };
};
