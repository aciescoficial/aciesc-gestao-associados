
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertCircle, 
  Check, 
  CreditCard, 
  FileText, 
  Filter, 
  Mail, 
  Package, 
  Search, 
  Truck, 
  XCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

type CarteirinhaSolicitacao = {
  id: string;
  associado_id: string;
  nome: string;
  sobrenome: string;
  endereco_entrega: string;
  complemento?: string;
  valor: number;
  status: string;
  created_at: string;
  updated_at: string;
  pagamento_id?: string;
  codigo_rastreio?: string;
  observacoes?: string;
  email?: string;
};

const statusColors = {
  'pendente_pagamento': 'bg-yellow-500',
  'pagamento_aprovado': 'bg-blue-500',
  'em_producao': 'bg-purple-500',
  'enviado': 'bg-indigo-500',
  'entregue': 'bg-green-500',
  'cancelado': 'bg-red-500',
};

const statusLabels = {
  'pendente_pagamento': 'Aguardando Pagamento',
  'pagamento_aprovado': 'Pagamento Aprovado',
  'em_producao': 'Em Produção',
  'enviado': 'Enviado',
  'entregue': 'Entregue',
  'cancelado': 'Cancelado',
};

const CarteirinhaSolicitacoes: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<CarteirinhaSolicitacao[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editSolicitacao, setEditSolicitacao] = useState<CarteirinhaSolicitacao | null>(null);
  const [rastreioCode, setRastreioCode] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSolicitacoes();
  }, [currentPage, statusFilter]);

  const fetchSolicitacoes = async () => {
    try {
      setIsLoading(true);
      
      // Calculate pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      // Build the query
      let query = supabase
        .from('carteirinha_solicitacoes')
        .select(`
          *,
          associados (email)
        `, { count: 'exact' });
      
      // Apply filters if provided
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%`);
      }
      
      // Apply pagination and order
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      const { data, count, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match our format
      const formattedData = data?.map(item => ({
        ...item,
        email: item.associados?.email
      }));
      
      setSolicitacoes(formattedData as CarteirinhaSolicitacao[] || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as solicitações de carteirinha.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchSolicitacoes();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openEditDialog = (solicitacao: CarteirinhaSolicitacao) => {
    setEditSolicitacao(solicitacao);
    setRastreioCode(solicitacao.codigo_rastreio || '');
    setObservacoes(solicitacao.observacoes || '');
    setDialogOpen(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!editSolicitacao) return;

    try {
      const { error } = await supabase
        .from('carteirinha_solicitacoes')
        .update({
          status: newStatus,
          codigo_rastreio: rastreioCode || null,
          observacoes: observacoes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editSolicitacao.id);
      
      if (error) throw error;
      
      toast({
        title: "Status atualizado",
        description: `O status da solicitação foi atualizado para ${statusLabels[newStatus as keyof typeof statusLabels]}.`
      });
      
      setDialogOpen(false);
      fetchSolicitacoes();
      
    } catch (error) {
      console.error('Erro ao atualizar solicitação:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status da solicitação.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    
    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );
    
    // First page
    items.push(
      <PaginationItem key="1">
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Last page if not the first
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );
    
    return items;
  };

  const renderActionButtons = (solicitacao: CarteirinhaSolicitacao) => {
    return (
      <div className="flex space-x-1">
        <Dialog open={dialogOpen && editSolicitacao?.id === solicitacao.id} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost" 
              size="icon" 
              onClick={() => openEditDialog(solicitacao)}
            >
              <FileText className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Atualizar Solicitação</DialogTitle>
              <DialogDescription>
                Altere o status ou adicione informações da solicitação
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-2">
              <div>
                <h4 className="text-sm font-medium mb-1">Solicitante</h4>
                <p>{`${editSolicitacao?.nome} ${editSolicitacao?.sobrenome}`}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Endereço de Entrega</h4>
                <p className="text-sm">{editSolicitacao?.endereco_entrega}</p>
                {editSolicitacao?.complemento && <p className="text-sm">{editSolicitacao.complemento}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select 
                  value={editSolicitacao?.status} 
                  onValueChange={(value) => {
                    if (editSolicitacao) {
                      setEditSolicitacao({ ...editSolicitacao, status: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente_pagamento">Aguardando Pagamento</SelectItem>
                    <SelectItem value="pagamento_aprovado">Pagamento Aprovado</SelectItem>
                    <SelectItem value="em_producao">Em Produção</SelectItem>
                    <SelectItem value="enviado">Enviado</SelectItem>
                    <SelectItem value="entregue">Entregue</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="rastreio" className="text-sm font-medium">
                  Código de Rastreio
                </label>
                <Input
                  id="rastreio"
                  value={rastreioCode}
                  onChange={(e) => setRastreioCode(e.target.value)}
                  placeholder="Código de rastreio da entrega"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="observacoes" className="text-sm font-medium">
                  Observações
                </label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Observações adicionais"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleStatusChange(editSolicitacao?.status || '')}
                disabled={!editSolicitacao}
              >
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button variant="ghost" size="icon">
          <Mail className="h-4 w-4" />
          <span className="sr-only">Enviar E-mail</span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <CreditCard className="h-4 w-4" />
          <span className="sr-only">Gerar Carteirinha</span>
        </Button>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente_pagamento':
        return <Badge variant="outline" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Aguardando Pagamento</Badge>;
      case 'pagamento_aprovado':
        return <Badge variant="outline" className="flex items-center gap-1 text-blue-600 border-blue-600"><Check className="h-3 w-3" /> Pagamento Aprovado</Badge>;
      case 'em_producao':
        return <Badge variant="outline" className="flex items-center gap-1 text-purple-600 border-purple-600"><CreditCard className="h-3 w-3" /> Em Produção</Badge>;
      case 'enviado':
        return <Badge variant="outline" className="flex items-center gap-1 text-indigo-600 border-indigo-600"><Package className="h-3 w-3" /> Enviado</Badge>;
      case 'entregue':
        return <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-600"><Check className="h-3 w-3" /> Entregue</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="flex items-center gap-1 text-red-600 border-red-600"><XCircle className="h-3 w-3" /> Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="wp-card">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Solicitações de Carteirinha</h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex w-full md:w-auto">
              <Input
                placeholder="Buscar por nome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mr-2"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="pendente_pagamento">Aguardando Pagamento</SelectItem>
                <SelectItem value="pagamento_aprovado">Pagamento Aprovado</SelectItem>
                <SelectItem value="em_producao">Em Produção</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Solicitante</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Carregando dados...
                  </TableCell>
                </TableRow>
              ) : solicitacoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {statusFilter ? (
                      <p>Nenhuma solicitação com este status foi encontrada.</p>
                    ) : (
                      <p>Nenhuma solicitação de carteirinha encontrada.</p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                solicitacoes.map((solicitacao) => (
                  <TableRow key={solicitacao.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{`${solicitacao.nome} ${solicitacao.sobrenome}`}</p>
                        <p className="text-sm text-muted-foreground">{solicitacao.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(solicitacao.valor)}</TableCell>
                    <TableCell>
                      {getStatusBadge(solicitacao.status)}
                      {solicitacao.codigo_rastreio && (
                        <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                          <Truck className="h-3 w-3" /> {solicitacao.codigo_rastreio}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDate(solicitacao.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      {renderActionButtons(solicitacao)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-end mt-4">
            <Pagination>
              <PaginationContent>
                {generatePaginationItems()}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarteirinhaSolicitacoes;
