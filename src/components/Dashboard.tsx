import React, { useEffect, useMemo } from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';
import { NotificationMessage } from '@/components/layout/NotificationBanner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/auth/hooks/useAuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import SituacaoPagamentoCard from '@/components/associado/dashboard/SituacaoPagamentoCard';
import UltimasEmpresas from '@/components/associado/dashboard/UltimasEmpresas';

const exampleMessages: NotificationMessage[] = [
  {
    id: '1',
    text: 'Sua Anuidade ACIESC está vencendo em 3 dia(s).',
    type: 'payment',
    action: {
      url: '/meus-pagamentos',
      text: 'Pagar agora'
    }
  },
  {
    id: '2',
    text: 'VOCÊ ESTÁ INATIVO NO MOMENTO! A sua Anuidade ACIESC venceu.',
    type: 'inactive',
    action: {
      url: '/reativar',
      text: 'Reativar agora'
    }
  },
  {
    id: '3',
    text: 'PRÓXIMO EVENTO! Festa dos AMIGOS em Itapema.',
    type: 'event',
    action: {
      url: '/eventos/festa-amigos',
      text: 'Saiba mais'
    }
  }
];

const Dashboard: React.FC = () => {
  const { stats, recentActivity, loading, systemStatus, refreshData } = useDashboardData();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!window.localStorage.getItem('demoMessages')) {
      window.localStorage.setItem('demoMessages', JSON.stringify(exampleMessages));
      
      const timer = setTimeout(() => {
        window.localStorage.removeItem('demoMessages');
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleRefresh = useMemo(() => refreshData, [refreshData]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!user) {
      console.log('No authenticated user, dashboard might not show data');
      timeoutId = setTimeout(() => {
        console.log('Triggering refresh to ensure auth state is current');
        handleRefresh();
      }, 1500);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, handleRefresh]);

  const isAssociado = user?.role === 'user' && user?.associado_id;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Dashboard</h1>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner size="small" text="" centered={false} className="mr-1" />
              Atualizando...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="mr-1" />
              Atualizar dados
            </>
          )}
        </Button>
      </div>
      
      {process.env.NODE_ENV !== 'production' && (
        <div className="p-2 bg-amber-50 text-amber-800 rounded-md text-xs">
          Status de autenticação: {user ? `Autenticado (${user.email})` : 'Não autenticado'} 
          {!user && ' - Os dados podem não aparecer sem autenticação'}
        </div>
      )}
      
      {!isAssociado && <DashboardStats stats={stats} loading={loading} />}
      
      {isAssociado && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SituacaoPagamentoCard />
          <UltimasEmpresas />
        </div>
      )}
      
      <RecentActivity recentActivity={recentActivity} loading={loading} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActions />
        {!isAssociado && <SystemStatus systemStatus={systemStatus} />}
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
