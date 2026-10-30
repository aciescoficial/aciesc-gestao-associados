
import React from 'react';
import { useAprovacoes } from './hooks/useAprovacoes';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PendingHeader } from './components/PendingHeader';
import { PendingTable } from './components/PendingTable';
import { PendingFilters } from './components/PendingFilters';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AprovacoesHistorico: React.FC = () => {
  const { pendentes, isLoading, handleApprove, handleReject, fetchPendentes, statusFilter, setStatusFilter } = useAprovacoes();
  
  // Set the initial status to show approved items
  React.useEffect(() => {
    setStatusFilter('ativo');
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

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Histórico de Aprovações</h1>
      
      <Tabs defaultValue="ativo" onValueChange={(value) => setStatusFilter(value as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ativo">Aprovados</TabsTrigger>
          <TabsTrigger value="inativo">Rejeitados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ativo" className="mt-4">
          {isLoading ? (
            <div className="wp-card flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : pendentes.length === 0 ? (
            <div className="wp-notice">
              <p>Nenhum item aprovado encontrado.</p>
            </div>
          ) : (
            <div className="wp-card">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-medium">
                  {pendentes.length} {pendentes.length === 1 ? 'Item aprovado' : 'Itens aprovados'}
                </h2>
                <Button 
                  onClick={fetchPendentes} 
                  size="sm" 
                  variant="outline"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
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
        
        <TabsContent value="inativo" className="mt-4">
          {isLoading ? (
            <div className="wp-card flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : pendentes.length === 0 ? (
            <div className="wp-notice">
              <p>Nenhum item rejeitado encontrado.</p>
            </div>
          ) : (
            <div className="wp-card">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-medium">
                  {pendentes.length} {pendentes.length === 1 ? 'Item rejeitado' : 'Itens rejeitados'}
                </h2>
                <Button 
                  onClick={fetchPendentes} 
                  size="sm" 
                  variant="outline"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
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

export default AprovacoesHistorico;
