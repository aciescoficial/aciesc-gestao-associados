
import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConveniadoData {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  creci: string;
  status: 'ativo' | 'pendente' | 'inativo';
  email: string;
  telefone: string;
}

const PesquisaConveniado: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cpf' | 'creci'>('nome');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ConveniadoData[]>([]);
  const { toast } = useToast();

  // Mock data - would be fetched from API in real implementation
  const mockData: ConveniadoData[] = [
    { id: '1', nome: 'João', sobrenome: 'Silva', cpf: '123.456.789-00', creci: '12345', status: 'ativo', email: 'joao@example.com', telefone: '(47) 99999-1111' },
    { id: '2', nome: 'Maria', sobrenome: 'Oliveira', cpf: '987.654.321-00', creci: '54321', status: 'ativo', email: 'maria@example.com', telefone: '(47) 99999-2222' },
    { id: '3', nome: 'Pedro', sobrenome: 'Santos', cpf: '456.789.123-00', creci: '67890', status: 'pendente', email: 'pedro@example.com', telefone: '(47) 99999-3333' },
    { id: '4', nome: 'Ana', sobrenome: 'Costa', cpf: '789.123.456-00', creci: '09876', status: 'inativo', email: 'ana@example.com', telefone: '(47) 99999-4444' },
  ];

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
      // Mock API call - would call actual API in real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock data based on search criteria
      let filteredResults: ConveniadoData[] = [];
      
      if (searchType === 'nome') {
        const term = searchTerm.toLowerCase();
        filteredResults = mockData.filter(
          item => item.nome.toLowerCase().includes(term) || item.sobrenome.toLowerCase().includes(term)
        );
      } else if (searchType === 'cpf') {
        filteredResults = mockData.filter(item => item.cpf.includes(searchTerm));
      } else if (searchType === 'creci') {
        filteredResults = mockData.filter(item => item.creci.includes(searchTerm));
      }
      
      setResults(filteredResults);
      
      if (filteredResults.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontrados conveniados com os critérios informados.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
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
      <h1 className="wp-header">Pesquisar Conveniados</h1>
      
      <div className="wp-card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Termo de busca</label>
              <div className="relative">
                <input
                  type="text"
                  className="wp-input w-full pl-10"
                  placeholder={`Buscar por ${searchType === 'nome' ? 'nome' : searchType === 'cpf' ? 'CPF' : 'número CRECI'}`}
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
                onChange={(e) => setSearchType(e.target.value as 'nome' | 'cpf' | 'creci')}
              >
                <option value="nome">Nome</option>
                <option value="cpf">CPF</option>
                <option value="creci">CRECI</option>
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
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>CRECI</th>
                  <th>Status</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr key={item.id}>
                    <td>{`${item.nome} ${item.sobrenome}`}</td>
                    <td>{item.cpf}</td>
                    <td>{item.creci}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>{item.email}</td>
                    <td>{item.telefone}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button className="wp-button-secondary text-xs py-1 px-2">Ver</button>
                        <button className="wp-button text-xs py-1 px-2">Carteirinha</button>
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

export default PesquisaConveniado;
