
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { User } from '../types';
import { useUserForm } from './hooks/useUserForm';
import { NameField, EmailField, RoleSelect, UserTagsField } from './form-fields/UserFormFields';
import { UserLinkTabs } from './form-fields/UserLinkTabs';
import { Loader2, Trash2 } from 'lucide-react';

interface EditUserFormSectionProps {
  selectedUser: User;
  onSelectedUserChange: (field: string, value: any) => void;
  onUpdateUser: () => Promise<boolean>;
  associados: Array<{id: string, cpf: string, nome: string, sobrenome: string}>;
  empresas: Array<{id: string, cnpj: string, nome_fantasia: string}>;
  loadingAssociados: boolean;
  loadingEmpresas: boolean;
  fetchAssociados: () => Promise<void>;
  fetchEmpresas: () => Promise<void>;
  onOpenPasswordModal: () => void;
  onOpenDeleteDialog: () => void;
  isDeleting: boolean;
  isAdmin: boolean;
  closeDialog: () => void;
}

const EditUserFormSection: React.FC<EditUserFormSectionProps> = ({
  selectedUser,
  onSelectedUserChange,
  onUpdateUser,
  associados,
  empresas,
  loadingAssociados,
  loadingEmpresas,
  fetchAssociados,
  fetchEmpresas,
  onOpenPasswordModal,
  onOpenDeleteDialog,
  isDeleting,
  isAdmin,
  closeDialog
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isDiretoria,
    handleTagToggle,
    handleAssociadoSelect,
    handleEmpresaSelect,
    handleDiretoriaSelect
  } = useUserForm({
    user: selectedUser,
    onUserChange: onSelectedUserChange,
    fetchAssociados,
    fetchEmpresas,
    isOpen: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await onUpdateUser();
      if (success) {
        closeDialog();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogDescription>
          Atualize os dados do usuário abaixo.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <NameField
            id="edit-name"
            value={selectedUser.name || ''}
            onChange={(value) => onSelectedUserChange('name', value)}
          />
          <EmailField
            id="edit-email"
            value={selectedUser.email || ''}
            onChange={(value) => onSelectedUserChange('email', value)}
          />
          <RoleSelect
            id="edit-role"
            value={selectedUser.role}
            onChange={(value) => onSelectedUserChange('role', value)}
          />
          <UserTagsField
            prefix="edit"
            selectedTags={selectedUser.tags}
            onTagChange={handleTagToggle}
          />
          <UserLinkTabs
            isDiretoria={isDiretoria}
            associadoId={selectedUser.associado_id}
            empresaId={selectedUser.empresa_id}
            associados={associados}
            empresas={empresas}
            loadingAssociados={loadingAssociados}
            loadingEmpresas={loadingEmpresas}
            onDiretoriaSelect={handleDiretoriaSelect}
            onAssociadoSelect={handleAssociadoSelect}
            onEmpresaSelect={handleEmpresaSelect}
          />
          <div className="border-t pt-4 mt-4 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onOpenPasswordModal}
              disabled={isSubmitting}
            >
              Modificar Senha
            </Button>
            {isAdmin && (
              <Button
                type="button"
                variant="destructive"
                className="ml-auto"
                onClick={onOpenDeleteDialog}
                disabled={isSubmitting || isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Excluindo..." : "Excluir Usuário"}
              </Button>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeDialog}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default EditUserFormSection;
