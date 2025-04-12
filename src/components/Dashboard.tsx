
import React from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';

const Dashboard: React.FC = () => {
  const { stats, recentActivity, loading, systemStatus, refreshData } = useDashboardData();

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
