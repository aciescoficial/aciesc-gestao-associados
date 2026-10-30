
import { useState, useCallback } from 'react';
import { User } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useUserActions = (
  toggleUserActive: (userId: string, active: boolean) => Promise<boolean>,
  onActionComplete: () => void
) => {
  const [selectedUserForAction, setSelectedUserForAction] = useState<User | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleToggleActive = useCallback(async (userId: string, active: boolean) => {
    const success = await toggleUserActive(userId, active);
    if (success) {
      toast({
        title: active ? "Usuário ativado" : "Usuário desativado",
        description: `O usuário foi ${active ? "ativado" : "desativado"} com sucesso.`,
      });
      onActionComplete();
    }
  }, [toggleUserActive, toast, onActionComplete]);
  
  const handleChangePassword = useCallback((user: User) => {
    setSelectedUserForAction(user);
    setIsPasswordDialogOpen(true);
  }, []);
  
  const handleDelete = useCallback((user: User) => {
    setSelectedUserForAction(user);
    setIsDeleteDialogOpen(true);
  }, []);
  
  return {
    selectedUserForAction,
    isPasswordDialogOpen,
    setIsPasswordDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleToggleActive,
    handleChangePassword,
    handleDelete
  };
};
