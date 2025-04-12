
import React, { useEffect } from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';
import { NotificationMessage } from '@/components/layout/NotificationBanner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Example messages are defined once outside the component to avoid recreations
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
  
  useEffect(() => {
    // Only set example messages if they don't exist yet to prevent constant writes
    if (!window.localStorage.getItem('demoMessages')) {
      window.localStorage.setItem('demoMessages', JSON.stringify(exampleMessages));
      
      // Clear after 30 seconds to demonstrate the banner disappearing
      const timer = setTimeout(() => {
        window.localStorage.removeItem('demoMessages');
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Dashboard</h1>
        <Button 
          onClick={refreshData} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin mr-1" : "mr-1"} />
          {loading ? "Atualizando..." : "Atualizar dados"}
        </Button>
      </div>
      
      {/* Stats Grid */}
      <DashboardStats stats={stats} loading={loading} />
      
      {/* Recent Activity */}
      <RecentActivity recentActivity={recentActivity} loading={loading} />
      
      {/* Quick Actions and System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActions />
        <SystemStatus systemStatus={systemStatus} />
      </div>
    </div>
  );
};

export default Dashboard;
