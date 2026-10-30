
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface ImportCreateUsersOptionProps {
  criarUsuarios: boolean;
  setCriarUsuarios: (value: boolean) => void;
}

export const ImportCreateUsersOption: React.FC<ImportCreateUsersOptionProps> = ({ 
  criarUsuarios, 
  setCriarUsuarios 
}) => {
  return (
    <div className="space-y-4 my-4">
      <h4 className="font-medium">Configurações de Usuário</h4>
      
      <div className="bg-muted/30 rounded-md p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="create-users" 
            checked={criarUsuarios} 
            onCheckedChange={(checked) => setCriarUsuarios(!!checked)} 
          />
          <label 
            htmlFor="create-users" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Criar usuários automaticamente
          </label>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {criarUsuarios 
            ? "Usuários serão criados para todos os associados importados. Um email será enviado automaticamente para cada associado definir sua senha."
            : "Os associados importados precisarão criar suas contas manualmente no sistema."
          }
        </p>
      </div>
    </div>
  );
};
