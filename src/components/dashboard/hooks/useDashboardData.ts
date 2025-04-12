
import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardStats, DashboardStats } from '../services/statsService';
import { fetchRecentActivity, RecentActivity } from '../services/activityService';
import { checkSystemStatus, SystemStatus } from '../services/systemStatusService';
import { useTimeout } from './useTimeout';
import { toast } from '@/components/ui/use-toast';

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

  // Use timeout hook with appropriate default values
  const statsTimeout = useTimeout(2500, {
    associados: 0,
    empresas: 0,
    pendentes: 0,
    carteirasPendentes: 0
  });
  
  const activityTimeout = useTimeout(2500, []);
  
  const statusTimeout = useTimeout(2000, {
    asaas: { active: false, message: 'Verificação falhou (timeout)' },
    stripe: { active: false, message: 'Verificação falhou (timeout)' },
    emails: { active: false, message: 'Verificação falhou (timeout)' }
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    
    try {
      // Fetch data in parallel using the timeout wrapper
      const statsPromise = statsTimeout.withTimeout(fetchDashboardStats());
      const activityPromise = activityTimeout.withTimeout(fetchRecentActivity());
      const statusPromise = statusTimeout.withTimeout(checkSystemStatus());
      
      // Use Promise.allSettled to handle partial failures
      const [statsResult, activityResult, statusResult] = await Promise.allSettled([
        statsPromise,
        activityPromise,
        statusPromise
      ]);
      
      // Handle stats result
      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
      } else {
        console.error('Failed to fetch stats:', statsResult.reason);
      }
      
      // Handle activity result
      if (activityResult.status === 'fulfilled') {
        setRecentActivity(activityResult.value);
      } else {
        console.error('Failed to fetch recent activity:', activityResult.reason);
      }
      
      // Handle system status result
      if (statusResult.status === 'fulfilled') {
        setSystemStatus(statusResult.value);
      } else {
        console.error('Failed to fetch system status:', statusResult.reason);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erro ao carregar dados do dashboard",
        description: "Tente atualizar a página",
        variant: "destructive"
      });
    } finally {
      // Always set loading to false, even if there are errors
      setLoading(false);
    }
  }, [statsTimeout, activityTimeout, statusTimeout]);

  useEffect(() => {
    // Set a maximum timeout for the entire loading process
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);
    
    fetchDashboardData();
    
    // Set up an interval to refresh the data every 5 minutes
    const intervalId = setInterval(fetchDashboardData, 300000);
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
      clearTimeout(loadingTimeout);
    };
  }, [fetchDashboardData]);

  return {
    stats,
    recentActivity,
    loading,
    systemStatus,
    refreshData: fetchDashboardData
  };
};
