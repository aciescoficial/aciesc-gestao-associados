
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
  const availableTags = getUserTags();

  useEffect(() => {
    if (isOpen) {
      fetchAssociados();
      fetchEmpresas();
    }
  }, [isOpen, fetchAssociados, fetchEmpresas]);

  const handleTagToggle = (tagId: UserTag, checked: boolean) => {
    const currentTags = newUser.tags || [];
    let newTags: UserTag[];
    
    if (checked) {
      newTags = [...currentTags, tagId];
    } else {
      newTags = currentTags.filter(tag => tag !== tagId);
    }
    
    onNewUserChange('tags', newTags);
  };

  const handleAssociadoSelect = (associadoId: string) => {
    const selectedAssociado = associados.find(a => a.id === associadoId);
    if (selectedAssociado) {
      onNewUserChange('associado_id', associadoId);
      onNewUserChange('associado_cpf', selectedAssociado.cpf);
      // Clear empresa selection when associado is selected
      onNewUserChange('empresa_id', undefined);
      onNewUserChange('empresa_cnpj', undefined);
    }
  };

  const handleEmpresaSelect = (empresaId: string) => {
    const selectedEmpresa = empresas.find(e => e.id === empresaId);
    if (selectedEmpresa) {
      onNewUserChange('empresa_id', empresaId);
      onNewUserChange('empresa_cnpj', selectedEmpresa.cnpj);
      // Clear associado selection when empresa is selected
      onNewUserChange('associado_id', undefined);
      onNewUserChange('associado_cpf', undefined);
    }
  };

  const handleDiretoriaSelect = (isDiretoria: boolean) => {
    if (isDiretoria) {
      const hasDiretoriaTag = newUser.tags?.includes('diretoria_aciesc') || false;
      if (!hasDiretoriaTag) {
        const newTags = [...(newUser.tags || []), 'diretoria_aciesc'];
        onNewUserChange('tags', newTags);
      }
      // Clear associado and empresa selections for diretoria
      onNewUserChange('associado_id', undefined);
      onNewUserChange('associado_cpf', undefined);
      onNewUserChange('empresa_id', undefined);
      onNewUserChange('empresa_cnpj', undefined);
    } else {
      const newTags = (newUser.tags || []).filter(tag => tag !== 'diretoria_aciesc');
      onNewUserChange('tags', newTags);
    }
  };

  const isDiretoria = newUser.tags?.includes('diretoria_aciesc') || false;

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
            <div className="space-y-2">
              <Label htmlFor="add-name">Nome</Label>
              <Input
                id="add-name"
                placeholder="Digite o nome completo"
                value={newUser.name || ''}
                onChange={(e) => onNewUserChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                placeholder="Digite o email"
                value={newUser.email || ''}
                onChange={(e) => onNewUserChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-role">Tipo de Usuário</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => onNewUserChange('role', value as UserRole)}
                required
              >
                <SelectTrigger id="add-role">
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
                      id={`new-tag-${tag.id}`}
                      checked={newUser.tags?.includes(tag.id) || false}
                      onCheckedChange={(checked) => handleTagToggle(tag.id, checked === true)}
                    />
                    <Label 
                      htmlFor={`new-tag-${tag.id}`}
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
              <Tabs defaultValue={isDiretoria ? "diretoria" : (newUser.associado_id ? "associado" : "empresa")}>
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
                      value={newUser.associado_id}
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
                      value={newUser.empresa_id}
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
            <Button type="submit">Adicionar Usuário</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
