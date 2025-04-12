
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { User, UserRole, UserTag } from '../types';
import { getUserTags } from '../utils/roleUtils';

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
  const availableTags = getUserTags();

  useEffect(() => {
    if (isOpen) {
      fetchAssociados();
      fetchEmpresas();
    }
  }, [isOpen, fetchAssociados, fetchEmpresas]);

  if (!selectedUser) return null;

  const handleTagToggle = (tagId: UserTag, checked: boolean) => {
    const currentTags = selectedUser.tags || [];
    let newTags: UserTag[];
    
    if (checked) {
      newTags = [...currentTags, tagId];
    } else {
      newTags = currentTags.filter(tag => tag !== tagId);
    }
    
    onSelectedUserChange('tags', newTags);
  };

  const handleAssociadoSelect = (associadoId: string) => {
    const selectedAssociado = associados.find(a => a.id === associadoId);
    if (selectedAssociado) {
      onSelectedUserChange('associado_id', associadoId);
      onSelectedUserChange('associado_cpf', selectedAssociado.cpf);
      // Clear empresa selection when associado is selected
      onSelectedUserChange('empresa_id', undefined);
      onSelectedUserChange('empresa_cnpj', undefined);
    }
  };

  const handleEmpresaSelect = (empresaId: string) => {
    const selectedEmpresa = empresas.find(e => e.id === empresaId);
    if (selectedEmpresa) {
      onSelectedUserChange('empresa_id', empresaId);
      onSelectedUserChange('empresa_cnpj', selectedEmpresa.cnpj);
      // Clear associado selection when empresa is selected
      onSelectedUserChange('associado_id', undefined);
      onSelectedUserChange('associado_cpf', undefined);
    }
  };

  const handleDiretoriaSelect = (isDiretoria: boolean) => {
    if (isDiretoria) {
      const hasDiretoriaTag = selectedUser.tags?.includes('diretoria_aciesc') || false;
      if (!hasDiretoriaTag) {
        const newTags = [...(selectedUser.tags || []), 'diretoria_aciesc'];
        onSelectedUserChange('tags', newTags);
      }
      // Clear associado and empresa selections for diretoria
      onSelectedUserChange('associado_id', undefined);
      onSelectedUserChange('associado_cpf', undefined);
      onSelectedUserChange('empresa_id', undefined);
      onSelectedUserChange('empresa_cnpj', undefined);
    } else {
      const newTags = (selectedUser.tags || []).filter(tag => tag !== 'diretoria_aciesc');
      onSelectedUserChange('tags', newTags);
    }
  };

  const isDiretoria = selectedUser.tags?.includes('diretoria_aciesc') || false;
  const activeTab = isDiretoria ? "diretoria" : (selectedUser.associado_id ? "associado" : "empresa");

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
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                placeholder="Digite o nome completo"
                value={selectedUser.name || ''}
                onChange={(e) => onSelectedUserChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Digite o email"
                value={selectedUser.email || ''}
                onChange={(e) => onSelectedUserChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Tipo de Usuário</Label>
              <Select
                value={selectedUser.role}
                onValueChange={(value) => onSelectedUserChange('role', value as UserRole)}
                required
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Associado</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tags do Usuário</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {availableTags.map((tag) => (
                  <div className="flex items-center space-x-2" key={tag.id}>
                    <Checkbox 
                      id={`edit-tag-${tag.id}`}
                      checked={selectedUser.tags?.includes(tag.id) || false}
                      onCheckedChange={(checked) => handleTagToggle(tag.id, checked === true)}
                    />
                    <Label 
                      htmlFor={`edit-tag-${tag.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <Label>Vínculo do Usuário</Label>
              <Tabs defaultValue={activeTab}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger 
                    value="associado"
                    onClick={() => handleDiretoriaSelect(false)}
                  >
                    Associado
                  </TabsTrigger>
                  <TabsTrigger 
                    value="empresa"
                    onClick={() => handleDiretoriaSelect(false)}
                  >
                    Empresa
                  </TabsTrigger>
                  <TabsTrigger 
                    value="diretoria"
                    onClick={() => handleDiretoriaSelect(true)}
                  >
                    Diretoria
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="associado" className="space-y-4 mt-4">
                  {loadingAssociados ? (
                    <div className="text-center py-4">Carregando associados...</div>
                  ) : (
                    <Select
                      value={selectedUser.associado_id}
                      onValueChange={handleAssociadoSelect}
                      disabled={isDiretoria}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um associado" />
                      </SelectTrigger>
                      <SelectContent>
                        {associados.map((associado) => (
                          <SelectItem key={associado.id} value={associado.id}>
                            {associado.nome} {associado.sobrenome} - CPF: {associado.cpf}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </TabsContent>
                
                <TabsContent value="empresa" className="space-y-4 mt-4">
                  {loadingEmpresas ? (
                    <div className="text-center py-4">Carregando empresas...</div>
                  ) : (
                    <Select
                      value={selectedUser.empresa_id}
                      onValueChange={handleEmpresaSelect}
                      disabled={isDiretoria}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {empresas.map((empresa) => (
                          <SelectItem key={empresa.id} value={empresa.id}>
                            {empresa.nome_fantasia} - CNPJ: {empresa.cnpj}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </TabsContent>
                
                <TabsContent value="diretoria" className="space-y-4 mt-4">
                  <div className="text-sm text-muted-foreground">
                    Este usuário será marcado como membro da Diretoria ACIESC.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
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
