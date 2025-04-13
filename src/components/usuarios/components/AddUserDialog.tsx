
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

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newUser: Partial<User>;
  onNewUserChange: (field: string, value: any) => void;
  onAddUser: () => void;
  associados: Array<{id: string, cpf: string, nome: string, sobrenome: string}>;
  empresas: Array<{id: string, cnpj: string, nome_fantasia: string}>;
  loadingAssociados: boolean;
  loadingEmpresas: boolean;
  fetchAssociados: () => Promise<void>;
  fetchEmpresas: () => Promise<void>;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  isOpen,
  onOpenChange,
  newUser,
  onNewUserChange,
  onAddUser,
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
    user: newUser,
    onUserChange: onNewUserChange,
    fetchAssociados,
    fetchEmpresas,
    isOpen
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo usuário abaixo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          onAddUser();
        }}>
          <div className="space-y-4 py-4">
            <NameField 
              id="add-name"
              value={newUser.name || ''} 
              onChange={(value) => onNewUserChange('name', value)} 
            />
            
            <EmailField 
              id="add-email"
              value={newUser.email || ''} 
              onChange={(value) => onNewUserChange('email', value)} 
            />
            
            <RoleSelect 
              id="add-role"
              value={newUser.role} 
              onChange={(value) => onNewUserChange('role', value)} 
            />
            
            <UserTagsField 
              prefix="new"
              selectedTags={newUser.tags} 
              onTagChange={handleTagToggle} 
            />
            
            <UserLinkTabs 
              isDiretoria={isDiretoria}
              associadoId={newUser.associado_id}
              empresaId={newUser.empresa_id}
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
            <Button type="submit">Adicionar Usuário</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
