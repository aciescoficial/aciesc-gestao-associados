
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, UserCheck, UserX, Clock, RefreshCw, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

type ConveniadoStatus = 'pendente' | 'ativo' | 'inativo';

interface Conveniado {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  telefone: string;
  cidade: string;
  creci?: string;
  placa_principal?: string;
  placa_secundaria?: string;
  status: ConveniadoStatus;
  created_at: string;
}

const ListaConveniados: React.FC = () => {
  const [conveniados, setConveniados] = useState<Conveniado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConveniadoStatus | 'todos'>('todos');
  const [cidadeFilter, setCidadeFilter] = useState<string>('');
  const [cidades, setCidades] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  // Fetch available cities for filter dropdown
  const fetchCidades = async () => {
    try {
      const { data, error } = await supabase
        .from('conveniados')
        .select('cidade')
        .order('cidade');
      
      if (error) throw error;
      
      // Extract unique cities
      const uniqueCidades = Array.from(new Set(data?.map(item => item.cidade) || []));
      setCidades(uniqueCidades);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    fetchCidades();
  }, []);

  const fetchConveniados = async () => {
    setLoading(true);
    try {
      // Build the query with filters
      let query = supabase
        .from('conveniados')
        .select('*', { count: 'exact' });

      // Apply status filter if not 'todos'
      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter);
      }
      
      // Apply city filter if provided
      if (cidadeFilter) {
        query = query.eq('cidade', cidadeFilter);
      }

      // Apply search term filter if provided
      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%,creci.ilike.%${searchTerm}%`);
      }

      // Add pagination if not showing all
      if (itemsPerPage !== -1) {
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        
        query = query
          .order('created_at', { ascending: false })
          .range(from, to);
      } else {
        // If showing all, just order them
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setConveniados(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching conveniados:', error);
      toast({
        title: 'Erro ao carregar conveniados',
        description: 'Não foi possível carregar a lista de conveniados.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConveniados();
  }, [currentPage, statusFilter, cidadeFilter, itemsPerPage]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchConveniados();
  };

  const getStatusBadge = (status: ConveniadoStatus) => {
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

  // Calculate total pages, accounting for "All" option
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Lista de Conveniados</h1>
      
      <div className="wp-card">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar por nome, CPF, CRECI, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <Button type="submit" variant="default">Buscar</Button>
          </form>
          
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Cidade:</span>
              <Select
                value={cidadeFilter}
                onValueChange={setCidadeFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {cidades.map((cidade) => (
                    <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as ConveniadoStatus | 'todos');
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => {
                setItemsPerPage(value === 'all' ? -1 : Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Por página" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
                <SelectItem value="100">100 por página</SelectItem>
                <SelectItem value="200">200 por página</SelectItem>
                <SelectItem value="500">500 por página</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => fetchConveniados()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border overflow-auto max-h-[600px]">
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : conveniados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Nenhum conveniado encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                conveniados.map((conveniado) => (
                  <TableRow key={conveniado.id}>
                    <TableCell className="font-medium">
                      {conveniado.nome} {conveniado.sobrenome}
                    </TableCell>
                    <TableCell>{conveniado.cpf}</TableCell>
                    <TableCell>{conveniado.cidade}</TableCell>
                    <TableCell>{conveniado.creci || "-"}</TableCell>
                    <TableCell className="text-sm">
                      <div>{conveniado.email}</div>
                      <div>{conveniado.telefone}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(conveniado.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Ver</Button>
                        <Button size="sm" variant="default">Editar</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Logic for showing pages around current page
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                  }
                  
                  if (pageNum <= 0) return null;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaConveniados;
