
import React, { useState } from 'react';
import { Search, Check, X, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface ConveniadoData {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  creci: string;
  status: 'ativo' | 'pendente' | 'inativo';
  email: string;
  telefone: string;
  placa_principal?: string;
  placa_secundaria?: string;
  foto?: string;
}

const PesquisaConveniado: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cpf' | 'creci' | 'placa'>('nome');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ConveniadoData[]>([]);
  const { toast } = useToast();

  // Mock data - would be fetched from API in real implementation
  const mockData: ConveniadoData[] = [
    { 
      id: '1', 
      nome: 'João', 
      sobrenome: 'Silva', 
      cpf: '123.456.789-00', 
      creci: '12345', 
      status: 'ativo', 
      email: 'joao@example.com', 
      telefone: '(47) 99999-1111',
      placa_principal: 'ABC1234',
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    { 
      id: '2', 
      nome: 'Maria', 
      sobrenome: 'Oliveira', 
      cpf: '987.654.321-00', 
      creci: '54321', 
      status: 'ativo', 
      email: 'maria@example.com', 
      telefone: '(47) 99999-2222',
      placa_principal: 'XYZ9876',
      placa_secundaria: 'DEF5432',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    { 
      id: '3', 
      nome: 'Pedro', 
      sobrenome: 'Santos', 
      cpf: '456.789.123-00', 
      creci: '67890', 
      status: 'pendente', 
      email: 'pedro@example.com', 
      telefone: '(47) 99999-3333',
      placa_principal: 'GHI7890'
    },
    { 
      id: '4', 
      nome: 'Ana', 
      sobrenome: 'Costa', 
      cpf: '789.123.456-00', 
      creci: '09876', 
      status: 'inativo', 
      email: 'ana@example.com', 
      telefone: '(47) 99999-4444',
      placa_principal: 'JKL4567'
    },
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
      } else if (searchType === 'placa') {
        const term = searchTerm.toLowerCase();
        filteredResults = mockData.filter(
          item => 
            (item.placa_principal && item.placa_principal.toLowerCase().includes(term)) || 
            (item.placa_secundaria && item.placa_secundaria.toLowerCase().includes(term))
        );
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
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 flex items-center gap-1"><Check size={14} />Ativo</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600">Pendente</Badge>;
      case 'inativo':
        return <Badge variant="destructive" className="flex items-center gap-1"><X size={14} />Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
                <Input
                  className="pl-10"
                  placeholder={`Buscar por ${
                    searchType === 'nome' ? 'nome' : 
                    searchType === 'cpf' ? 'CPF' : 
                    searchType === 'creci' ? 'número CRECI' : 
                    'placa do veículo'
                  }`}
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
                onChange={(e) => setSearchType(e.target.value as 'nome' | 'cpf' | 'creci' | 'placa')}
              >
                <option value="nome">Nome</option>
                <option value="cpf">CPF</option>
                <option value="creci">CRECI</option>
                <option value="placa">Placa do Veículo</option>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conveniado</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>CRECI</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Placa Principal</TableHead>
                  <TableHead>Placa Secundária</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={item.foto} alt={`${item.nome} ${item.sobrenome}`} />
                          <AvatarFallback>{item.nome.charAt(0)}{item.sobrenome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{`${item.nome} ${item.sobrenome}`}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.cpf}</TableCell>
                    <TableCell>{item.creci}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      {item.placa_principal && (
                        <div className="flex items-center space-x-1">
                          <Car size={16} />
                          <span>{item.placa_principal}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.placa_secundaria && (
                        <div className="flex items-center space-x-1">
                          <Car size={16} />
                          <span>{item.placa_secundaria}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{item.email}</p>
                        <p>{item.telefone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button className="wp-button-secondary text-xs py-1 px-2">Ver</button>
                        <button className="wp-button text-xs py-1 px-2">Carteirinha</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PesquisaConveniado;
