
import React, { useEffect } from 'react';
import { PendingHeader } from './aprovacoes/components/PendingHeader';
import { PendingTable } from './aprovacoes/components/PendingTable';
import { useAprovacoes } from './aprovacoes/hooks/useAprovacoes';
import { useToast } from '@/hooks/use-toast';

const AprovacoesPendentes: React.FC = () => {
  const { pendentes, isLoading, handleApprove, handleReject, fetchPendentes, statusFilter, setStatusFilter } = useAprovacoes();
  const { toast } = useToast();
  
  useEffect(() => {
    // Initial load of data
    fetchPendentes().catch(error => {
      toast({
        title: "Erro ao carregar aprovações",
        description: "Não foi possível carregar as aprovações pendentes",
        variant: "destructive"
      });
    });
  }, []);
  
  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'empresa':
        return <span className="wp-badge bg-purple-100 text-purple-800">Empresa</span>;
      default:
        return <span className="wp-badge">{tipo}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Aprovações Pendentes</h1>
      
      {isLoading ? (
        <div className="wp-card flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : pendentes.length === 0 ? (
        <div className="wp-notice-success">
          <p className="font-medium">Parabéns!</p>
          <p>Não há aprovações pendentes no momento.</p>
        </div>
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
    </div>
  );
};

export default AprovacoesPendentes;
