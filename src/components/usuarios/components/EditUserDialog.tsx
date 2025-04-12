
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  onSelectedUserChange: (field: string, value: any) => void;
  onUpdateUser: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedUser,
  onSelectedUserChange,
  onUpdateUser
}) => {
  if (!selectedUser) return null;

  const availableTags = getUserTags();

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Modifique os dados do usuário abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome</Label>
            <Input
              id="edit-name"
              value={selectedUser.name}
              onChange={(e) => onSelectedUserChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={selectedUser.email}
              onChange={(e) => onSelectedUserChange('email', e.target.value)}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role">Tipo de Usuário</Label>
            <Select
              value={selectedUser.role}
              onValueChange={(value) => onSelectedUserChange('role', value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue />
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
                    id={`tag-${tag.id}`}
                    checked={selectedUser.tags?.includes(tag.id) || false}
                    onCheckedChange={(checked) => handleTagToggle(tag.id, checked === true)}
                  />
                  <Label 
                    htmlFor={`tag-${tag.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {tag.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-active"
              checked={selectedUser.active}
              onCheckedChange={(checked) => onSelectedUserChange('active', checked)}
            />
            <Label htmlFor="edit-active">Usuário ativo</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onUpdateUser}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
