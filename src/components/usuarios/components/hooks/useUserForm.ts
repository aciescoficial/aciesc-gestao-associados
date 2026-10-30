
import { useState, useEffect, useCallback } from 'react';
import { User, UserTag } from '../../types';

type EntityType = 'associado' | 'empresa' | 'diretoria';

interface UserFormHookProps {
  user: Partial<User> | null;
  onUserChange: (field: string, value: any) => void;
  fetchAssociados: () => Promise<void>;
  fetchEmpresas: () => Promise<void>;
  isOpen: boolean;
}

export const useUserForm = ({
  user,
  onUserChange,
  fetchAssociados,
  fetchEmpresas,
  isOpen
}: UserFormHookProps) => {
  // Determine if the user is a diretoria member
  const isDiretoria = user?.tags?.includes('diretoria_aciesc') || false;
  const isAdmin = user?.role === 'admin';
  // Flag to better identify if the user is associated with a company
  const isEmpresa = user?.role === 'empresa' || !!user?.empresa_id;

  useEffect(() => {
    if (isOpen) {
      fetchAssociados();
      fetchEmpresas();
    }
  }, [isOpen, fetchAssociados, fetchEmpresas]);

  const handleTagToggle = (tagId: UserTag, checked: boolean) => {
    if (!user) return;
    
    const currentTags = user.tags || [];
    let newTags: UserTag[];
    
    if (checked) {
      newTags = [...currentTags, tagId];
      
      // Special handling for diretoria_aciesc tag
      if (tagId === 'diretoria_aciesc') {
        onUserChange('role', 'diretoria');
      }
      // Special handling for administrador tag
      else if (tagId === 'administrador' && !currentTags.includes('diretoria_aciesc')) {
        onUserChange('role', 'admin');
      }
    } else {
      newTags = currentTags.filter(tag => tag !== tagId);
      
      // Special handling when removing diretoria_aciesc tag
      if (tagId === 'diretoria_aciesc' && user.role === 'diretoria') {
        if (newTags.includes('administrador')) {
          onUserChange('role', 'admin');
        } else if (user.empresa_id) {
          onUserChange('role', 'empresa');
        } else {
          onUserChange('role', 'user');
        }
      }
      // Special handling when removing administrador tag
      else if (tagId === 'administrador' && user.role === 'admin' && !newTags.includes('diretoria_aciesc')) {
        if (user.empresa_id) {
          onUserChange('role', 'empresa');
        } else {
          onUserChange('role', 'user');
        }
      }
    }
    
    onUserChange('tags', newTags);
  };

  const handleAssociadoSelect = (associadoId: string) => {
    onUserChange('associado_id', associadoId);
    onUserChange('empresa_id', undefined);
    onUserChange('empresa_cnpj', undefined);
    
    // If not diretoria or admin, define as associado (user)
    if (!isDiretoria && !isAdmin) {
      onUserChange('role', 'user');
    }
  };

  const handleEmpresaSelect = (empresaId: string) => {
    onUserChange('empresa_id', empresaId);
    onUserChange('associado_id', undefined);
    onUserChange('associado_cpf', undefined);
    
    // If not diretoria or admin, define as empresa
    if (!isDiretoria && !isAdmin) {
      onUserChange('role', 'empresa');
    }
  };

  const handleDiretoriaSelect = (isDiretoria: boolean) => {
    if (!user) return;
    
    if (isDiretoria) {
      const hasDiretoriaTag = user.tags?.includes('diretoria_aciesc') || false;
      if (!hasDiretoriaTag) {
        const newTags = [...(user.tags || []), 'diretoria_aciesc'];
        onUserChange('tags', newTags);
      }
      // Clear associado and empresa selections for diretoria
      onUserChange('associado_id', undefined);
      onUserChange('associado_cpf', undefined);
      onUserChange('empresa_id', undefined);
      onUserChange('empresa_cnpj', undefined);
      // Garantir que o papel seja atualizado para diretoria
      onUserChange('role', 'diretoria');
    } else {
      const newTags = (user.tags || []).filter(tag => tag !== 'diretoria_aciesc');
      onUserChange('tags', newTags);
      
      // Restaurar o papel adequado com base nas seleções e tags
      if (newTags.includes('administrador')) {
        onUserChange('role', 'admin');
      } else if (user.associado_id) {
        onUserChange('role', 'user');
      } else if (user.empresa_id) {
        onUserChange('role', 'empresa');
      }
    }
  };
  
  return {
    isDiretoria,
    isAdmin,
    isEmpresa,
    handleTagToggle,
    handleAssociadoSelect,
    handleEmpresaSelect,
    handleDiretoriaSelect
  };
};
