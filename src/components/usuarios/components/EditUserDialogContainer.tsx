
import React, { useState } from "react";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { User } from '../types';
import EditUserFormSection from "./EditUserFormSection";
import UserPasswordChangeModal from "./UserPasswordChangeModal";
import UserDeleteConfirmationDialog from "./UserDeleteConfirmationDialog";
import { useToast } from '@/hooks/use-toast';
import { useAdminPermission } from '@/hooks/use-admin-permission';
import { supabase } from '@/integrations/supabase/client';
import { logOperation } from '@/components/audit/services/logOperationService';

interface EditUserDialogContainerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  onSelectedUserChange: (field: string, value: any) => void;
  onUpdateUser: () => Promise<boolean>;
  associados: Array<{id: string, cpf: string, nome: string, sobrenome: string}>;
  empresas: Array<{id: string, cnpj: string, nome_fantasia: string}>;
  loadingAssociados: boolean;
  loadingEmpresas: boolean;
  fetchAssociados: () => Promise<void>;
  fetchEmpresas: () => Promise<void>;
}

const EditUserDialogContainer: React.FC<EditUserDialogContainerProps> = ({
  isOpen,
  onOpenChange,
  selectedUser,
  onSelectedUserChange,
  onUpdateUser,
  associados,
  empresas,
  loadingAssociados,
  loadingEmpresas,
  fetchAssociados,
  fetchEmpresas
}) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteWithAssociado, setDeleteWithAssociado] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAdminPermission();

  // Enhanced user deletion function that checks for linked associado
  const handleDeleteUser = async () => {
    if (!selectedUser || !isAdmin) return;
    setIsDeleting(true);
    
    try {
      console.log("Deleting user:", selectedUser.id);
      
      // Check if user has an associated associado record
      const hasAssociado = !!selectedUser.associado_id;
      
      if (hasAssociado && deleteWithAssociado) {
        console.log("Also deleting associated associado:", selectedUser.associado_id);
        // Delete the associated associado record first
        const { error: associadoError } = await supabase
          .from('associados')
          .delete()
          .eq('id', selectedUser.associado_id);
          
        if (associadoError) {
          console.error("Error deleting associado:", associadoError);
          throw new Error(`Falha ao excluir associado: ${associadoError.message}`);
        }
      }

      // Delete user from the user table directly
      const { error: userError } = await supabase
        .from('user')
        .delete()
        .eq('id', selectedUser.id);
        
      if (userError) throw userError;

      // For auth.users deletion, we would need admin rights and would typically
      // handle this through a server-side function or edge function
      // For now, we'll just focus on deleting from the user table

      await logOperation({
        eventType: 'delete',
        entityType: 'user',
        details: `Usuário ${selectedUser.email} excluído${hasAssociado && deleteWithAssociado ? ' junto com associado vinculado' : ''}`,
        recordCount: 1,
      });

      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
        variant: "default"
      });
      
      onOpenChange(false);
    } catch (e: any) {
      console.error("Error in user deletion:", e);
      toast({
        title: "Erro ao excluir usuário",
        description: e.message || 'Falha ao excluir usuário.',
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (!selectedUser) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <EditUserFormSection
            selectedUser={selectedUser}
            onSelectedUserChange={onSelectedUserChange}
            onUpdateUser={onUpdateUser}
            associados={associados}
            empresas={empresas}
            loadingAssociados={loadingAssociados}
            loadingEmpresas={loadingEmpresas}
            fetchAssociados={fetchAssociados}
            fetchEmpresas={fetchEmpresas}
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
            onOpenDeleteDialog={() => setIsDeleteDialogOpen(true)}
            isDeleting={isDeleting}
            isAdmin={isAdmin}
            closeDialog={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>

      <UserPasswordChangeModal
        isOpen={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
        userId={selectedUser.id}
        userEmail={selectedUser.email}
      />

      <UserDeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userEmail={selectedUser.email || ''}
        onConfirm={handleDeleteUser}
        isLoading={isDeleting}
        hasAssociado={!!selectedUser.associado_id}
        deleteWithAssociado={deleteWithAssociado}
        setDeleteWithAssociado={setDeleteWithAssociado}
      />
    </>
  );
};

export default EditUserDialogContainer;
