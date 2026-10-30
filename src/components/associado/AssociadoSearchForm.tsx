
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, RefreshCw, Filter, Car, UserCheck, UserX, Clock } from 'lucide-react';
import { AssociadoStatus } from './types';
import { Badge } from '@/components/ui/badge';

interface AssociadoSearchFormProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchType: 'nome' | 'cpf' | 'creci' | 'placa';
  setSearchType: React.Dispatch<React.SetStateAction<'nome' | 'cpf' | 'creci' | 'placa'>>;
  statusFilter: AssociadoStatus | 'todos';
  setStatusFilter: React.Dispatch<React.SetStateAction<AssociadoStatus | 'todos'>>;
  cidadeFilter: string;
  setCidadeFilter: React.Dispatch<React.SetStateAction<string>>;
  cidades: string[];
  isSearching: boolean;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  fetchAssociados: () => Promise<void>;
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
  handleSearch,
  itemsPerPage,
  setItemsPerPage,
  fetchAssociados
}) => {
  const getSearchIcon = () => {
    if (searchType === 'placa') {
      return <Car className="h-5 w-5" />;
    }
    return <Search className="h-5 w-5" />;
  };
  
  const getStatusBadge = (status: AssociadoStatus | 'todos') => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><UserCheck className="h-3 w-3 mr-1" />Ativos</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" />Pendentes</Badge>;
      case 'inativo':
        return <Badge variant="destructive"><UserX className="h-3 w-3 mr-1" />Inativos</Badge>;
      default:
        return <Badge variant="outline">Todos</Badge>;
    }
  };
  
  return (
    <Card className="mb-6 border-none shadow-md">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                {getSearchIcon()}
                <span className="ml-2">
                  Buscar por {
                    searchType === 'nome' ? 'nome' : 
                    searchType === 'cpf' ? 'CPF' : 
                    searchType === 'creci' ? 'CRECI' :
                    'placa do veículo'
                  }
                </span>
              </div>
              <div className="relative">
                <Input 
                  placeholder={`Digite o ${
                    searchType === 'nome' ? 'nome' : 
                    searchType === 'cpf' ? 'CPF' : 
                    searchType === 'creci' ? 'CRECI' :
                    'placa do veículo'
                  } para buscar...`}
                  className="pl-10 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {searchType === 'placa' ? (
                    <Car className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Search className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-40">
              <div className="text-sm font-medium text-gray-700 mb-2">Buscar por</div>
              <Select 
                value={searchType}
                onValueChange={(value) => setSearchType(value as 'nome' | 'cpf' | 'creci' | 'placa')}
              >
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="Nome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nome">Nome</SelectItem>
                  <SelectItem value="cpf">CPF</SelectItem>
                  <SelectItem value="creci">CRECI</SelectItem>
                  <SelectItem value="placa">Placa do Veículo</SelectItem>
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
          </form>

          <div className="flex flex-wrap gap-3 items-center bg-gray-50 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500 font-medium">Filtros:</span>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Status</div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as AssociadoStatus | 'todos');
                }}
              >
                <SelectTrigger className="h-8 w-[140px]">
                  <SelectValue placeholder="Status">
                    {getStatusBadge(statusFilter)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Cidade</div>
              <Select
                value={cidadeFilter}
                onValueChange={setCidadeFilter}
              >
                <SelectTrigger className="h-8 w-[180px]">
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
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Itens por página</div>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(value) => {
                  setItemsPerPage(value === 'all' ? -1 : Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue placeholder="Por página" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 por página</SelectItem>
                  <SelectItem value="25">25 por página</SelectItem>
                  <SelectItem value="50">50 por página</SelectItem>
                  <SelectItem value="100">100 por página</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="ml-auto"
              onClick={() => fetchAssociados()}
              disabled={isSearching}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSearching ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociadoSearchForm;
