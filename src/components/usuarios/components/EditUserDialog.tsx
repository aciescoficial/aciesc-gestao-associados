
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { User, UserTag } from '../types';
import { useUserForm } from './hooks/useUserForm';
import { NameField, EmailField, RoleSelect, UserTagsField } from './form-fields/UserFormFields';
import { UserLinkTabs } from './form-fields/UserLinkTabs';

interface EditUserDialogProps {
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

const EditUserDialog: React.FC<EditUserDialogProps> = ({
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
    isOpen
  });

  if (!selectedUser) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Altere os dados do usuário abaixo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          onUpdateUser();
        }}>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
