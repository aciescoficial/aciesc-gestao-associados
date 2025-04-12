
import React from 'react';
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
import { User, UserRole, UserTag } from '../types';
import { getUserTags } from '../utils/roleUtils';

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newUser: Partial<User>;
  onNewUserChange: (field: string, value: any) => void;
  onAddUser: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  isOpen,
  onOpenChange,
  newUser,
  onNewUserChange,
  onAddUser
}) => {
  const availableTags = getUserTags();

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
