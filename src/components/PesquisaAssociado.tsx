
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserCheck, UserX, Clock, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type AssociadoStatus = 'pendente' | 'ativo' | 'inativo';

interface Associado {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  telefone: string;
  cidade: string;
  creci?: string;
  status: AssociadoStatus;
}

const PesquisaAssociado: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cpf' | 'creci'>('nome');
  const [statusFilter, setStatusFilter] = useState<AssociadoStatus | 'todos'>('todos');
  const [cidadeFilter, setcidadeFilter] = useState<string>('todas');
  const [cidades, setCidades] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Associado[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCidades();
  }, []);

  const fetchCidades = async () => {
    try {
      const { data, error } = await supabase
        .from('associados')
        .select('cidade')
        .order('cidade');
      
      if (error) throw error;
      
      // Type assertion to handle the data
      const associadosData = data as { cidade: string }[];
      const uniqueCidades = Array.from(new Set(associadosData.map(item => item.cidade) || []));
      setCidades(uniqueCidades);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

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
      let query = supabase.from('associados').select('*');
      
      if (searchType === 'nome') {
        query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%`);
      } else if (searchType === 'cpf') {
        query = query.ilike('cpf', `%${searchTerm}%`);
      } else if (searchType === 'creci') {
        query = query.ilike('creci', `%${searchTerm}%`);
      }
      
      if (statusFilter !== 'todos') {
        // Fix: Explicitly cast statusFilter to AssociadoStatus when it's not 'todos'
        query = query.eq('status', statusFilter as AssociadoStatus);
      }
      
      if (cidadeFilter !== 'todas') {
        query = query.eq('cidade', cidadeFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Type assertion to handle the data
      setResults(data as Associado[]);
      
      if (!data || data.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontrados associados com os critérios informados.",
        });
      }
    } catch (error) {
      console.error('Error searching associados:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: AssociadoStatus) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><UserCheck className="h-3 w-3 mr-1" />Ativo</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'inativo':
        return <Badge variant="destructive"><UserX className="h-3 w-3 mr-1" />Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Pesquisar Associados</h1>
      
      <div className="wp-card">
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
                  className="pl-10"
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
                <SelectTrigger>
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
                onValueChange={(value) => setcidadeFilter(value)}
              >
                <SelectTrigger>
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
              <Button 
                type="submit" 
                className="w-full"
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
        
        {results.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Resultados da Busca</h2>
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>CRECI</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((associado) => (
                    <TableRow key={associado.id}>
                      <TableCell className="font-medium">
                        {associado.nome} {associado.sobrenome}
                      </TableCell>
                      <TableCell>{associado.cpf}</TableCell>
                      <TableCell>{associado.cidade}</TableCell>
                      <TableCell>{associado.creci || "-"}</TableCell>
                      <TableCell className="text-sm">
                        <div>{associado.email}</div>
                        <div>{associado.telefone}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(associado.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Ver</Button>
                          <Button size="sm" variant="default">Editar</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <div className="text-center p-12 text-gray-500">
              Use os filtros acima para buscar associados
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PesquisaAssociado;
