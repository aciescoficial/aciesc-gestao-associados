
import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmpresaData {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  cidade: string;
  nicho: string;
  status: 'ativo' | 'pendente' | 'inativo';
}

const PesquisaEmpresa: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cnpj' | 'nicho'>('nome');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const { toast } = useToast();

  // Mock data - would be fetched from API in real implementation
  const mockData: EmpresaData[] = [
    { id: '1', razaoSocial: 'Farmácia ABC Ltda', nomeFantasia: 'Farmácia Saúde', cnpj: '00.000.000/0001-00', responsavel: 'João Silva', telefone: '(47) 3333-1111', email: 'contato@farmaciasaude.com.br', cidade: 'São José', nicho: 'Saúde', status: 'ativo' },
    { id: '2', razaoSocial: 'Restaurante Bom Sabor Ltda', nomeFantasia: 'Bom Sabor', cnpj: '11.111.111/0001-11', responsavel: 'Maria Oliveira', telefone: '(47) 3333-2222', email: 'contato@bomsabor.com.br', cidade: 'Florianópolis', nicho: 'Alimentação', status: 'ativo' },
    { id: '3', razaoSocial: 'Academia Fitness Ltda', nomeFantasia: 'Academia Fitness', cnpj: '22.222.222/0001-22', responsavel: 'Pedro Santos', telefone: '(47) 3333-3333', email: 'contato@academiafitness.com.br', cidade: 'Palhoça', nicho: 'Saúde', status: 'pendente' },
    { id: '4', razaoSocial: 'Livraria Leitura Ltda', nomeFantasia: 'Leitura Fácil', cnpj: '33.333.333/0001-33', responsavel: 'Ana Costa', telefone: '(47) 3333-4444', email: 'contato@leiturafacil.com.br', cidade: 'Biguaçu', nicho: 'Educação', status: 'inativo' },
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
      let filteredResults: EmpresaData[] = [];
      
      if (searchType === 'nome') {
        const term = searchTerm.toLowerCase();
        filteredResults = mockData.filter(
          item => item.nomeFantasia.toLowerCase().includes(term) || item.razaoSocial.toLowerCase().includes(term)
        );
      } else if (searchType === 'cnpj') {
        filteredResults = mockData.filter(item => item.cnpj.includes(searchTerm));
      } else if (searchType === 'nicho') {
        const term = searchTerm.toLowerCase();
        filteredResults = mockData.filter(item => item.nicho.toLowerCase().includes(term));
      }
      
      setResults(filteredResults);
      
      if (filteredResults.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontradas empresas com os critérios informados.",
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
                    <td>{item.nomeFantasia}</td>
                    <td>{item.razaoSocial}</td>
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
