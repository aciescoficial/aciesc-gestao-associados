
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AssociadoTabContentProps {
  associadoId: string | undefined;
  associados: Array<{id: string, cpf: string, nome: string, sobrenome: string}>;
  loadingAssociados: boolean;
  onAssociadoSelect: (associadoId: string) => void;
  disabled: boolean;
}

export const AssociadoTabContent: React.FC<AssociadoTabContentProps> = ({
  associadoId,
  associados,
  loadingAssociados,
  onAssociadoSelect,
  disabled
}) => {
  if (loadingAssociados) {
    return <div className="text-center py-4">Carregando associados...</div>;
  }

  if (associados.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Não há associados disponíveis para vinculação.
      </div>
    );
  }

  return (
    <Select
      value={associadoId}
      onValueChange={onAssociadoSelect}
      disabled={disabled}
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
  );
};
