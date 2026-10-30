
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmpresaTabContentProps {
  empresaId: string | undefined;
  empresas: Array<{id: string, cnpj: string, nome_fantasia: string}>;
  loadingEmpresas: boolean;
  onEmpresaSelect: (empresaId: string) => void;
  disabled: boolean;
}

export const EmpresaTabContent: React.FC<EmpresaTabContentProps> = ({
  empresaId,
  empresas,
  loadingEmpresas,
  onEmpresaSelect,
  disabled
}) => {
  if (loadingEmpresas) {
    return <div className="text-center py-4">Carregando empresas...</div>;
  }

  if (empresas.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Não há empresas disponíveis para vinculação.
      </div>
    );
  }

  return (
    <Select
      value={empresaId}
      onValueChange={onEmpresaSelect}
      disabled={disabled}
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
  );
};
