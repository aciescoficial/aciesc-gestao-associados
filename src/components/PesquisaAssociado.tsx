
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const PesquisaAssociado: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="wp-header">Pesquisar Associados</h1>
      
      <div className="wp-card">
        <form className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">Buscar por nome, CPF ou CRECI</label>
              <div className="relative">
                <Input 
                  id="search"
                  placeholder="Digite o termo de busca..."
                  className="pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="sao-paulo">São Paulo</SelectItem>
                  <SelectItem value="rio-de-janeiro">Rio de Janeiro</SelectItem>
                  <SelectItem value="belo-horizonte">Belo Horizonte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select>
                <SelectTrigger>
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
              <Button type="submit" className="w-full">Buscar</Button>
            </div>
          </div>
        </form>
        
        <div className="mt-8">
          <div className="text-center p-12 text-gray-500">
            Use os filtros acima para buscar associados
          </div>
        </div>
      </div>
    </div>
  );
};

export default PesquisaAssociado;
