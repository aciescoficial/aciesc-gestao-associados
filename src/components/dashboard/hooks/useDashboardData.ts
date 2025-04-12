
import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardStats, DashboardStats } from '../services/statsService';
import { fetchRecentActivity, RecentActivity } from '../services/activityService';
import { checkSystemStatus, SystemStatus } from '../services/systemStatusService';
import { useTimeout } from './useTimeout';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    associados: 0,
    empresas: 0,
    pendentes: 0,
    carteirasPendentes: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  
  const [loading, setLoading] = useState(true);
  
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    asaas: { active: false, message: 'Verificando...' },
    stripe: { active: false, message: 'Verificando...' },
    emails: { active: false, message: 'Verificando...' }
  });

  // Use our timeout hook with appropriate default values
  const statsTimeout = useTimeout(5000, {
    associados: 0,
    empresas: 0,
    pendentes: 0,
    carteirasPendentes: 0
  });
  
  const activityTimeout = useTimeout(5000, []);
  
  const statusTimeout = useTimeout(3000, {
    asaas: { active: false, message: 'Verificação falhou (timeout)' },
    stripe: { active: false, message: 'Verificação falhou (timeout)' },
    emails: { active: false, message: 'Verificação falhou (timeout)' }
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch data in parallel using the timeout wrapper
      const [statsData, activityData, statusData] = await Promise.all([
        statsTimeout.withTimeout(fetchDashboardStats()),
        activityTimeout.withTimeout(fetchRecentActivity()),
        statusTimeout.withTimeout(checkSystemStatus())
      ]);
      
      setStats(statsData);
      setRecentActivity(activityData);
      setSystemStatus(statusData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [statsTimeout, activityTimeout, statusTimeout]);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up an interval to refresh the data every 5 minutes
    const intervalId = setInterval(fetchDashboardData, 300000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchDashboardData]);

  return {
    stats,
    recentActivity,
    loading,
    systemStatus,
    refreshData: fetchDashboardData
  };
};
