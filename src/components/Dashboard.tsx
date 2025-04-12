
import React, { useEffect, useState } from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';
import { NotificationMessage } from '@/components/layout/NotificationBanner';

const Dashboard: React.FC = () => {
  const { stats, recentActivity, loading, systemStatus, refreshData } = useDashboardData();
  
  // Exemplo de como definir mensagens importantes para teste
  const [exampleMessages, setExampleMessages] = useState<NotificationMessage[]>([
    {
      id: '1',
      text: 'Sua Anuidade ACIESC está vencendo em 3 dia(s).',
      type: 'payment',
      action: {
        url: '/meus-pagamentos',
        text: 'Pagar agora'
      }
    }
  ]);
  
  useEffect(() => {
    // Define as mensagens no localStorage para que o Header possa acessá-las
    // Esta é apenas uma simulação para demonstração - normalmente isso viria do backend
    window.localStorage.setItem('demoMessages', JSON.stringify(exampleMessages));
    
    // Limpa após alguns segundos para demonstrar o banner desaparecendo
    const timer = setTimeout(() => {
      window.localStorage.removeItem('demoMessages');
    }, 30000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Dashboard</h1>
      
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
