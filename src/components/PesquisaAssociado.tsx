
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserCheck, UserX, Clock, RefreshCw, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

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
  avatar_url?: string;
}

const PesquisaAssociado: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cpf' | 'creci'>('nome');
  const [statusFilter, setStatusFilter] = useState<AssociadoStatus | 'todos'>('todos');
  const [cidadeFilter, setCidadeFilter] = useState<string>('todas');
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
      let query = supabase.from('associados').select('*, profiles(avatar_url)');
      
      if (searchType === 'nome') {
        query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%`);
      } else if (searchType === 'cpf') {
        query = query.ilike('cpf', `%${searchTerm}%`);
      } else if (searchType === 'creci') {
        query = query.ilike('creci', `%${searchTerm}%`);
      }
      
      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter as AssociadoStatus);
      }
      
      if (cidadeFilter !== 'todas') {
        query = query.eq('cidade', cidadeFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map the data to include profile avatar_url
      const associadosWithAvatars = data?.map(item => {
        return {
          ...item,
          avatar_url: item.profiles?.avatar_url || null
        };
      }) as Associado[];
      
      setResults(associadosWithAvatars || []);
      
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
      
      <div className="wp-card bg-gradient-to-br from-white to-gray-50">
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
        
        {results.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Resultados da Busca</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((associado) => (
                <Card key={associado.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="p-0">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-3"></div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-24 h-24 rounded overflow-hidden border-2 border-gray-200">
                        {associado.avatar_url ? (
                          <img 
                            src={associado.avatar_url} 
                            alt={`${associado.nome}`} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                            Sem foto
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {associado.nome} {associado.sobrenome}
                          </h3>
                          <div className="ml-2">
                            {getStatusBadge(associado.status)}
                          </div>
                        </div>
                        
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">CPF:</span> {associado.cpf}
                          </p>
                          {associado.creci && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">CRECI:</span> {associado.creci}
                            </p>
                          )}
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin size={14} className="mr-1" />
                            {associado.cidade}
                          </div>
                        </div>
                        
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs">Ver Detalhes</Button>
                          <Button size="sm" variant="default" className="text-xs">Gerar Carteirinha</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
