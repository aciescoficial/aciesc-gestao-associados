
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { statusOptions } from './StatusBadge';

interface SolicitacoesSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export const SolicitacoesSearch: React.FC<SolicitacoesSearchProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  handleSearch,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <h2 className="text-xl font-semibold">Solicitações de Carteirinha</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <Input
            placeholder="Buscar por nome"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
