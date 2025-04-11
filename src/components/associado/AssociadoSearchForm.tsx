
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw } from 'lucide-react';
import { AssociadoStatus } from './AssociadoSearchResult';

interface AssociadoSearchFormProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchType: 'nome' | 'cpf' | 'creci';
  setSearchType: React.Dispatch<React.SetStateAction<'nome' | 'cpf' | 'creci'>>;
  statusFilter: AssociadoStatus | 'todos';
  setStatusFilter: React.Dispatch<React.SetStateAction<AssociadoStatus | 'todos'>>;
  cidadeFilter: string;
  setCidadeFilter: React.Dispatch<React.SetStateAction<string>>;
  cidades: string[];
  isSearching: boolean;
  handleSearch: (e: React.FormEvent) => Promise<void>;
}

const AssociadoSearchForm: React.FC<AssociadoSearchFormProps> = ({
  searchTerm,
  setSearchTerm,
  searchType,
  setSearchType,
  statusFilter,
  setStatusFilter,
  cidadeFilter,
  setCidadeFilter,
  cidades,
  isSearching,
  handleSearch
}) => {
  return (
    <form onSubmit={handleSearch} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Buscar por {
              searchType === 'nome' ? 'nome' : 
              searchType === 'cpf' ? 'CPF' : 'CRECI'
            }
          </label>
          <div className="relative">
            <Input 
              id="search"
              placeholder={`Digite o ${
                searchType === 'nome' ? 'nome' : 
                searchType === 'cpf' ? 'CPF' : 'CRECI'
              } para buscar...`}
              className="pl-10 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por</label>
          <Select 
            value={searchType}
            onValueChange={(value) => setSearchType(value as 'nome' | 'cpf' | 'creci')}
          >
            <SelectTrigger className="shadow-sm">
              <SelectValue placeholder="Nome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome">Nome</SelectItem>
              <SelectItem value="cpf">CPF</SelectItem>
              <SelectItem value="creci">CRECI</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
          <Select
            value={cidadeFilter}
            onValueChange={(value) => setCidadeFilter(value)}
          >
            <SelectTrigger className="shadow-sm">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {cidades.map((cidade) => (
                <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as AssociadoStatus | 'todos')}
          >
            <SelectTrigger className="shadow-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-auto">
          <Button 
            type="submit" 
            className="w-full shadow-sm"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Buscando...
              </>
            ) : 'Buscar'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AssociadoSearchForm;
