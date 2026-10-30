
import React, { useEffect, useState } from 'react';
import { PendingHeader } from './components/PendingHeader';
import { PendingTable } from './components/PendingTable';
import { PendingFilters } from './components/PendingFilters';
import { useAprovacoes } from './hooks/useAprovacoes';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Aprovacoes: React.FC = () => {
  const { pendentes, isLoading, handleApprove, handleReject, fetchPendentes, statusFilter, setStatusFilter } = useAprovacoes();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"pendentes" | "aprovados" | "rejeitados">("pendentes");

  // Efeito para atualizar o filtro de status quando a aba é alterada
  useEffect(() => {
    switch(activeTab) {
      case "pendentes":
        setStatusFilter('pendente');
        break;
      case "aprovados":
        setStatusFilter('ativo');
        break;
      case "rejeitados":
        setStatusFilter('inativo');
        break;
    }
  }, [activeTab, setStatusFilter]);
  
  // Carregamento inicial
  useEffect(() => {
    fetchPendentes().catch(error => {
      toast({
        title: "Erro ao carregar aprovações",
        description: "Não foi possível carregar as aprovações",
        variant: "destructive"
      });
    });
  }, []);
  
  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'empresa':
        return <Badge className="bg-purple-100 text-purple-800">Empresa</Badge>;
      case 'associado':
        return <Badge className="bg-blue-100 text-blue-800">Associado</Badge>;
      default:
        return <Badge>{tipo}</Badge>;
    }
  };

  const handleRefresh = () => {
    fetchPendentes().catch(error => {
      toast({
        title: "Erro ao carregar aprovações",
        description: "Não foi possível carregar as aprovações",
        variant: "destructive"
      });
    });
  };

  const getEmptyStateMessage = () => {
    switch(statusFilter) {
      case 'pendente': 
        return (
          <div className="wp-notice-success">
            <p className="font-medium">Parabéns!</p>
            <p>Não há aprovações pendentes no momento.</p>
          </div>
        );
      case 'ativo': 
        return (
          <div className="wp-notice">
            <p>Nenhum item aprovado encontrado.</p>
          </div>
        );
      case 'inativo': 
        return (
          <div className="wp-notice">
            <p>Nenhum item rejeitado encontrado.</p>
          </div>
        );
      default: 
        return (
          <div className="wp-notice">
            <p>Nenhum item encontrado.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Aprovações</h1>
        
        <Button 
          onClick={handleRefresh} 
          size="sm" 
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Carregando...' : 'Atualizar'}
        </Button>
      </div>
      
      <Tabs defaultValue="pendentes" value={activeTab} onValueChange={(value) => setActiveTab(value as "pendentes" | "aprovados" | "rejeitados")}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pendentes" className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-amber-500" />
            Pendentes
          </TabsTrigger>
          <TabsTrigger value="aprovados" className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            Aprovados
          </TabsTrigger>
          <TabsTrigger value="rejeitados" className="flex items-center">
            <XCircle className="h-4 w-4 mr-2 text-red-500" />
            Rejeitados
          </TabsTrigger>
        </TabsList>
        
        {/* Conteúdo da aba "Pendentes" */}
        <TabsContent value="pendentes">
          {isLoading ? (
            <div className="wp-card flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : pendentes.length === 0 ? (
            getEmptyStateMessage()
          ) : (
            <div className="wp-card">
              <PendingHeader pendingCount={pendentes.length} statusFilter={statusFilter} />
              <PendingTable 
                pendentes={pendentes}
                onApprove={handleApprove}
                onReject={handleReject}
                getTipoBadge={getTipoBadge}
                statusFilter={statusFilter}
              />
            </div>
          )}
        </TabsContent>
        
        {/* Conteúdo da aba "Aprovados" */}
        <TabsContent value="aprovados">
          {isLoading ? (
            <div className="wp-card flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : pendentes.length === 0 ? (
            getEmptyStateMessage()
          ) : (
            <div className="wp-card">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium">{pendentes.length} {pendentes.length === 1 ? 'Item aprovado' : 'Itens aprovados'}</h2>
              </div>
              <PendingTable 
                pendentes={pendentes}
                onApprove={handleApprove}
                onReject={handleReject}
                getTipoBadge={getTipoBadge}
                statusFilter={statusFilter}
              />
            </div>
          )}
        </TabsContent>
        
        {/* Conteúdo da aba "Rejeitados" */}
        <TabsContent value="rejeitados">
          {isLoading ? (
            <div className="wp-card flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : pendentes.length === 0 ? (
            getEmptyStateMessage()
          ) : (
            <div className="wp-card">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium">{pendentes.length} {pendentes.length === 1 ? 'Item rejeitado' : 'Itens rejeitados'}</h2>
              </div>
              <PendingTable 
                pendentes={pendentes}
                onApprove={handleApprove}
                onReject={handleReject}
                getTipoBadge={getTipoBadge}
                statusFilter={statusFilter}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Aprovacoes;
