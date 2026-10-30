
import React from 'react';
import { PendingHeader } from './components/PendingHeader';
import { PendingTable } from './components/PendingTable';
import { PendingFilters } from './components/PendingFilters';
import { useAprovacoes } from './hooks/useAprovacoes';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AprovacoesPendentes: React.FC = () => {
  const { pendentes, isLoading, handleApprove, handleReject, fetchPendentes, statusFilter, setStatusFilter } = useAprovacoes();
  const { toast } = useToast();
  
  const getStatusTitle = () => {
    switch(statusFilter) {
      case 'pendente': return 'Aprovações Pendentes';
      case 'ativo': return 'Itens Aprovados';
      case 'inativo': return 'Itens Rejeitados';
      case 'todos': return 'Todos os Itens';
      default: return 'Aprovações';
    }
  };
  
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
        description: "Não foi possível carregar as aprovações pendentes",
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

  const getStatusIcon = () => {
    switch(statusFilter) {
      case 'pendente': return <Clock className="h-5 w-5 text-amber-500 mr-2" />;
      case 'ativo': return <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />;
      case 'inativo': return <XCircle className="h-5 w-5 text-red-500 mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header flex items-center">
          {getStatusIcon()}
          {getStatusTitle()}
        </h1>
        
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
      
      {isLoading ? (
        <div className="wp-card flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : pendentes.length === 0 ? (
        getEmptyStateMessage()
      ) : (
        <div className="wp-card">
          <PendingHeader pendingCount={pendentes.length} statusFilter={statusFilter} />
          <PendingFilters statusFilter={statusFilter} onFilterChange={setStatusFilter} />
          <PendingTable 
            pendentes={pendentes}
            onApprove={handleApprove}
            onReject={handleReject}
            getTipoBadge={getTipoBadge}
            statusFilter={statusFilter}
          />
        </div>
      )}
    </div>
  );
};

export default AprovacoesPendentes;
