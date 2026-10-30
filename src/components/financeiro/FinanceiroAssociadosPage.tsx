
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Pagamento } from '../associado/types/pagamentos';
import { formatDate } from '@/lib/utils';
import { Eye, FileText, RefreshCcw, Search } from 'lucide-react';
import { pagamentoVerificacaoService } from '../associado/services/pagamentoVerificacaoService';

// Utility function to format currency
const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function FinanceiroAssociadosPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [filteredPagamentos, setFilteredPagamentos] = useState<Pagamento[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'pago' | 'cancelado'>('todos');
  const [loading, setLoading] = useState(true);

  // Carregar pagamentos
  const fetchPagamentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pagamentos_associado')
        .select(`
          *,
          associado:associado_id (
            id,
            nome,
            sobrenome,
            email,
            cpf
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedPagamentos = (data || []).map(item => ({
        ...item,
        status: item.status as 'pendente' | 'pago' | 'cancelado',
      }));

      setPagamentos(typedPagamentos);
      setFilteredPagamentos(typedPagamentos);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagamentos();
  }, []);

  // Filtrar pagamentos
  useEffect(() => {
    let filtered = pagamentos;

    // Filtrar por status
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => {
        const associadoData = p.associado ? 
          `${p.associado.nome || ''} ${p.associado.sobrenome || ''} ${p.associado.email || ''} ${p.associado.cpf || ''}`.toLowerCase() 
          : '';
        
        return associadoData.includes(term) || 
               (p.descricao || '').toLowerCase().includes(term);
      });
    }

    setFilteredPagamentos(filtered);
  }, [statusFilter, searchTerm, pagamentos]);

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pago':
        return <Badge variant="success">Pago</Badge>;
      case 'pendente':
        return <Badge variant="warning">Pendente</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  // Verificar pagamento
  const handleVerificarPagamento = async (pagamentoId: string) => {
    try {
      const result = await pagamentoVerificacaoService.verificarStatusPagamento(pagamentoId);
      
      if (result.success) {
        // Recarregar dados após verificação bem-sucedida
        await fetchPagamentos();
      } else {
        alert(`Erro na verificação: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      alert('Erro ao verificar pagamento. Consulte o console para mais detalhes.');
    }
  };

  // Verificar todos os pagamentos pendentes
  const handleVerificarTodosPendentes = async () => {
    try {
      const result = await pagamentoVerificacaoService.verificarTodosPagamentosPendentes();
      
      if (result.success) {
        await fetchPagamentos();
        alert(`Verificação concluída. ${result.atualizados} de ${result.total} pagamentos foram confirmados.`);
      } else {
        alert(`Erro na verificação em massa: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao verificar pagamentos em massa:', error);
      alert('Erro ao verificar pagamentos. Consulte o console para mais detalhes.');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financeiro - Associados</h1>
          <p className="text-muted-foreground">
            Gerencie os pagamentos e financeiro dos associados.
          </p>
        </div>
        <Button 
          onClick={handleVerificarTodosPendentes} 
          className="w-full md:w-auto gap-1"
        >
          <RefreshCcw className="h-4 w-4" /> 
          Verificar Pagamentos Pendentes
        </Button>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Pagamentos</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pagamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchPagamentos}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Tabs defaultValue="todos" value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pendente">Pendentes</TabsTrigger>
              <TabsTrigger value="pago">Pagos</TabsTrigger>
              <TabsTrigger value="cancelado">Cancelados</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPagamentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Nenhum pagamento encontrado</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Não há pagamentos registrados com os filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Associado</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Valor</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Data</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Ano Ref.</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Método</th>
                    <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPagamentos.map((pagamento) => (
                    <tr key={pagamento.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        {pagamento.associado ? (
                          <>
                            <div className="font-medium">
                              {pagamento.associado.nome} {pagamento.associado.sobrenome}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {pagamento.associado.email}
                            </div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">
                            {pagamento.associado_id.substring(0, 8)}...
                          </span>
                        )}
                      </td>
                      <td className="p-4 align-middle font-medium">
                        {formatter.format(pagamento.valor)}
                      </td>
                      <td className="p-4 align-middle">
                        {formatDate(pagamento.data_pagamento || '')}
                      </td>
                      <td className="p-4 align-middle">
                        {pagamento.ano_referencia}
                      </td>
                      <td className="p-4 align-middle">
                        {getStatusBadge(pagamento.status)}
                      </td>
                      <td className="p-4 align-middle">
                        {pagamento.metodo || pagamento.origem || '-'}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          {pagamento.status === 'pendente' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerificarPagamento(pagamento.id)}
                            >
                              <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                              Verificar
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => alert(`Visualizar detalhes do pagamento ${pagamento.id}`)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Detalhes
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FinanceiroAssociadosPage;
