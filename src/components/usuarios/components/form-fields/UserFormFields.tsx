
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UserRole, UserTag } from '../../types';
import { getRoles, getUserTags } from '../../utils/roleUtils';

// FIELD COMPONENTS

export const NameField: React.FC<{
  id: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ id, value, onChange }) => (
  <div>
    <Label htmlFor={id} className="text-muted-foreground">
      Nome
    </Label>
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Nome completo"
      className="mt-1"
    />
  </div>
);

export const EmailField: React.FC<{
  id: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ id, value, onChange }) => (
  <div>
    <Label htmlFor={id} className="text-muted-foreground">
      Email
    </Label>
    <Input
      id={id}
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="email@exemplo.com"
      className="mt-1"
    />
  </div>
);

export const RoleSelect: React.FC<{
  id: string;
  value: UserRole;
  onChange: (value: UserRole) => void;
  disabled?: boolean;
}> = ({ id, value, onChange, disabled = false }) => {
  const roles = getRoles();
  
  return (
    <div>
      <Label htmlFor={id} className="text-muted-foreground">
        Tipo de Usuário
      </Label>
      <Select 
        value={value} 
        onValueChange={onChange as (value: string) => void}
        disabled={disabled}
      >
        <SelectTrigger id={id} className="mt-1">
          <SelectValue placeholder="Selecione um tipo" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const UserTagsField: React.FC<{
  prefix: string;
  selectedTags: UserTag[] | undefined;
  onTagChange: (tag: UserTag, checked: boolean) => void;
}> = ({ prefix, selectedTags, onTagChange }) => {
  const tags = getUserTags();
  const selectedTagIds = selectedTags || [];

  // Verifica se tem a tag 'diretoria_aciesc'
  const hasDiretoriaTag = selectedTagIds.includes('diretoria_aciesc');
  
  return (
    <div className="space-y-3">
      <Label className="text-muted-foreground">Tags do Usuário</Label>
      <div className="grid grid-cols-2 gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`${prefix}-tag-${tag.id}`}
              checked={selectedTagIds.includes(tag.id)}
              onCheckedChange={(checked) => onTagChange(tag.id, !!checked)}
            />
            <Label 
              htmlFor={`${prefix}-tag-${tag.id}`}
              className="text-sm font-normal cursor-pointer"
            >
              {tag.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
