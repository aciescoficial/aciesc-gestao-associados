
import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';

type NichoType = Database['public']['Enums']['nicho_type'];
type StatusType = Database['public']['Enums']['status_type'];

interface EmpresaData {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  cidade: string;
  nicho: NichoType;
  status: StatusType;
}

const PesquisaEmpresa: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cnpj' | 'nicho'>('nome');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Campo de busca vazio",
        description: "Por favor, insira um termo para realizar a busca.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Search in Supabase based on search criteria
      let query = supabase
        .from('empresas')
        .select('*');
      
      if (searchType === 'nome') {
        query = query.or(`nome_fantasia.ilike.%${searchTerm}%,razao_social.ilike.%${searchTerm}%`);
      } else if (searchType === 'cnpj') {
        query = query.ilike('cnpj', `%${searchTerm}%`);
      } else if (searchType === 'nicho') {
        // We'll search for any nicho that contains the search term
        query = query.ilike('nicho', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setResults(data as EmpresaData[]);
      } else {
        setResults([]);
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontradas empresas com os critérios informados.",
        });
      }
    } catch (error: any) {
      console.error("Error searching data:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'ativo':
        return <span className="wp-badge-success flex items-center gap-1"><Check size={14} />Ativo</span>;
      case 'pendente':
        return <span className="wp-badge-warning">Pendente</span>;
      case 'inativo':
        return <span className="wp-badge-error flex items-center gap-1"><X size={14} />Inativo</span>;
      default:
        return <span className="wp-badge">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Pesquisar Empresas Conveniadas</h1>
      
      <div className="wp-card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Termo de busca</label>
              <div className="relative">
                <input
                  type="text"
                  className="wp-input w-full pl-10"
                  placeholder={`Buscar por ${searchType === 'nome' ? 'nome' : searchType === 'cnpj' ? 'CNPJ' : 'nicho'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Buscar por</label>
              <select 
                className="wp-input w-full"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'nome' | 'cnpj' | 'nicho')}
              >
                <option value="nome">Nome</option>
                <option value="cnpj">CNPJ</option>
                <option value="nicho">Nicho</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                type="submit" 
                className="wp-button w-full"
                disabled={isSearching}
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {results.length > 0 && (
        <div className="wp-card">
          <h2 className="wp-subheader">Resultados da Busca</h2>
          <div className="overflow-x-auto">
            <table className="wp-table">
              <thead>
                <tr>
                  <th>Nome Fantasia</th>
                  <th>Razão Social</th>
                  <th>CNPJ</th>
                  <th>Nicho</th>
                  <th>Cidade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nome_fantasia}</td>
                    <td>{item.razao_social}</td>
                    <td>{item.cnpj}</td>
                    <td>{item.nicho}</td>
                    <td>{item.cidade}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button className="wp-button-secondary text-xs py-1 px-2">Ver</button>
                        <button className="wp-button text-xs py-1 px-2">Editar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PesquisaEmpresa;
