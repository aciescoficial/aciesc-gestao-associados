
import React, { useState } from 'react';
import { User } from '../types';
import UserDeleteConfirmationDialog from './UserDeleteConfirmationDialog';
import { useToast } from '@/hooks/use-toast';

interface DeleteUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedUser: User | null;
  onSuccess: () => void;
  deleteUser: (userId: string, deleteAssociado: boolean) => Promise<boolean>;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedUser,
  onSuccess,
  deleteUser,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteWithAssociado, setDeleteWithAssociado] = useState(false);
  const { toast } = useToast();

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      setIsDeleting(true);
      const success = await deleteUser(selectedUser.id, deleteWithAssociado);
      
      if (success) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erro ao excluir usuário",
        description: error.message || "Ocorreu um erro ao excluir o usuário.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  if (!selectedUser) return null;

  return (
    <UserDeleteConfirmationDialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      userEmail={selectedUser.email}
      onConfirm={handleConfirmDelete}
      isLoading={isDeleting}
      hasAssociado={!!selectedUser.associado_id}
      deleteWithAssociado={deleteWithAssociado}
      setDeleteWithAssociado={setDeleteWithAssociado}
    />
  );
};

export default DeleteUserDialog;
