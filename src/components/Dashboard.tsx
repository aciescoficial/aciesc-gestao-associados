
import React, { useEffect, useState } from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';
import { NotificationMessage } from '@/components/layout/NotificationBanner';

const Dashboard: React.FC = () => {
  const { stats, recentActivity, loading, systemStatus, refreshData } = useDashboardData();
  
  // Example messages for testing the notification banner
  const [exampleMessages, setExampleMessages] = useState<NotificationMessage[]>([
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
  ]);
  
  useEffect(() => {
    // Set example messages in localStorage for the Header component to use
    window.localStorage.setItem('demoMessages', JSON.stringify(exampleMessages));
    
    // Clear after 30 seconds to demonstrate the banner disappearing
    const timer = setTimeout(() => {
      window.localStorage.removeItem('demoMessages');
    }, 30000);
    
    return () => clearTimeout(timer);
  }, [exampleMessages]);

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
