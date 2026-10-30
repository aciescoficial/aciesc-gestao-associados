
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PendingFiltersProps {
  statusFilter: 'pendente' | 'ativo' | 'inativo' | 'todos';
  onFilterChange: (status: 'pendente' | 'ativo' | 'inativo' | 'todos') => void;
}

export const PendingFilters: React.FC<PendingFiltersProps> = ({ 
  statusFilter,
  onFilterChange
}) => {
  return (
    <div className="flex items-center gap-4 px-6 py-2 border-b">
      <span className="text-sm text-gray-500">Filtrar por status:</span>
      <Select 
        defaultValue={statusFilter} 
        onValueChange={(value) => onFilterChange(value as any)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="pendente">Pendentes</SelectItem>
          <SelectItem value="ativo">Aprovados</SelectItem>
          <SelectItem value="inativo">Rejeitados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
