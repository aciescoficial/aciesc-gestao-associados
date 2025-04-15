
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
import EmpresasDashboard from '@/components/empresa/dashboard/EmpresasDashboard';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { verificarSituacaoPagamento } from '@/components/associado/services/pagamentoService';
import { useState } from 'react';
import { SituacaoPagamento } from '@/components/associado/types/pagamentos';

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
  const [pagamentoStatus, setPagamentoStatus] = useState<SituacaoPagamento | null>(null);
  const [loadingPagamento, setLoadingPagamento] = useState<boolean>(false);
  
  useEffect(() => {
    // Check payment status if user is associate
    const checkPagamento = async () => {
      if (user?.role === 'user' && user?.associado_id) {
        try {
          setLoadingPagamento(true);
          const status = await verificarSituacaoPagamento(user.associado_id);
          setPagamentoStatus(status);
        } catch (error) {
          console.error("Error checking payment status:", error);
        } finally {
          setLoadingPagamento(false);
        }
      }
    };
    
    checkPagamento();
  }, [user]);
  
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

  // Redirect to company profile if user is company
  if (user?.role === 'empresa') {
    return <EmpresasDashboard />;
  }

  // Check if user is an associate
  const isAssociado = user?.role === 'user' && user?.associado_id;

  // For associate users, show different views based on payment status
  if (isAssociado) {
    if (loadingPagamento) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" text="Verificando status de pagamento..." />
        </div>
      );
    }

    // If payment is not up to date, only show payment status and user profile update options
    if (!pagamentoStatus?.emDia) {
      return (
        <div className="space-y-6">
          <h1 className="wp-header">Área do Associado</h1>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h2 className="text-amber-800 font-medium text-lg mb-2">Atenção! Pagamento Pendente</h2>
            <p className="text-amber-700 mb-2">
              Para acessar todas as funcionalidades do sistema, é necessário regularizar o pagamento da sua anuidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button 
                onClick={() => window.location.href = '/meus-pagamentos'}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Ver meus pagamentos
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/perfil/atualizar'}
              >
                Atualizar meus dados
              </Button>
            </div>
          </div>
          
          <SituacaoPagamentoCard />
        </div>
      );
    }

    // If payment is up to date, show full associate dashboard
    return (
      <div className="space-y-6">
        <h1 className="wp-header">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SituacaoPagamentoCard />
          <UltimasEmpresas />
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Todas as Empresas Conveniadas</h2>
          <iframe 
            src="/empresas-conveniadas" 
            className="w-full h-[600px] border-0 rounded-lg shadow-sm" 
            title="Empresas Conveniadas"
          />
        </div>
      </div>
    );
  }

  // Dashboard for Administrator
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
      
      <DashboardStats stats={stats} loading={loading} />
      <RecentActivity recentActivity={recentActivity} loading={loading} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActions />
        <SystemStatus systemStatus={systemStatus} />
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
