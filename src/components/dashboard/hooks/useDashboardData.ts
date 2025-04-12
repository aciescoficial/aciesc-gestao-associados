
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  associados: number;
  empresas: number;
  pendentes: number;
  carteirasPendentes: number;
}

interface RecentActivity {
  type: 'associado' | 'empresa';
  name: string;
  action: string;
  date: string;
}

interface SystemStatus {
  asaas: { active: boolean; message: string };
  stripe: { active: boolean; message: string };
  emails: { active: boolean; message: string };
}

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

  const checkSystemStatus = async () => {
    try {
      // Create a controller to abort the request if it takes too long
      const timeoutId = setTimeout(() => {
        console.log('System status check timed out, using default values');
        setSystemStatus({
          asaas: { active: false, message: 'Verificação falhou (timeout)' },
          stripe: { active: false, message: 'Verificação falhou (timeout)' },
          emails: { active: false, message: 'Verificação falhou (timeout)' }
        });
      }, 3000);
      
      // Check Asaas integration status
      const { data: asaasConfig, error: asaasError } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'ASAAS_API_KEY')
        .maybeSingle();
      
      if (asaasError) {
        console.error('Error checking Asaas status:', asaasError);
      }
      
      // Check Stripe integration status
      const { data: stripeConfig, error: stripeError } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'STRIPE_SECRET_KEY')
        .maybeSingle();
      
      if (stripeError) {
        console.error('Error checking Stripe status:', stripeError);
      }
      
      // Check GHL integration status for email functionality
      const { data: ghlConfig, error: ghlError } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'GO_HIGH_LEVEL_API_KEY')
        .maybeSingle();
      
      if (ghlError) {
        console.error('Error checking GHL status:', ghlError);
      }
      
      clearTimeout(timeoutId);
      
      const asaasActive = !!asaasConfig?.value;
      const stripeActive = !!stripeConfig?.value;
      const ghlActive = !!ghlConfig?.value;
      
      setSystemStatus({
        asaas: { 
          active: asaasActive, 
          message: asaasActive ? 'Operacional' : 'Inativo (Token não cadastrado ou não funcionando)'
        },
        stripe: {
          active: stripeActive,
          message: stripeActive ? 'Operacional' : 'Inativo (Token não cadastrado ou não funcionando)'
        },
        emails: {
          active: ghlActive,
          message: ghlActive ? 'Ativos' : 'Inativos (Token não funcionando)'
        }
      });
      
    } catch (error) {
      console.error('Error checking system status:', error);
      // Set default values if there was an error
      setSystemStatus({
        asaas: { active: false, message: 'Verificação falhou' },
        stripe: { active: false, message: 'Verificação falhou' },
        emails: { active: false, message: 'Verificação falhou' }
      });
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Set a timeout for the whole operation
      const timeoutId = setTimeout(() => {
        console.log('Dashboard data fetch timed out, showing default values');
        setStats({
          associados: 0,
          empresas: 0,
          pendentes: 0,
          carteirasPendentes: 0
        });
        setRecentActivity([]);
        setLoading(false);
      }, 5000);
      
      // Fetch data separately to handle potential failures gracefully
      // Fetch associados count
      const { count: associadosCount, error: associadosError } = await supabase
        .from('associados')
        .select('*', { count: 'exact', head: true });
      
      if (associadosError) {
        console.error('Error fetching associados count:', associadosError);
      }
      
      // Fetch empresas count
      const { count: empresasCount, error: empresasError } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true });
      
      if (empresasError) {
        console.error('Error fetching empresas count:', empresasError);
      }
      
      // Fetch pending approvals count
      const { count: pendentesCount, error: pendentesError } = await supabase
        .from('associados')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');
      
      if (pendentesError) {
        console.error('Error fetching pendentes count:', pendentesError);
      }
      
      // Fetch pending carteirinhas count
      const { count: carteirasPendentesCount, error: carteirasError } = await supabase
        .from('carteirinha_solicitacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente_pagamento');
      
      if (carteirasError) {
        console.error('Error fetching carteiras pendentes count:', carteirasError);
      }
      
      // Fetch recent associados
      const { data: recentAssociados, error: recentAssociadosError } = await supabase
        .from('associados')
        .select('nome, sobrenome, status, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (recentAssociadosError) {
        console.error('Error fetching recent associados:', recentAssociadosError);
      }
      
      // Fetch recent empresas
      const { data: recentEmpresas, error: recentEmpresasError } = await supabase
        .from('empresas')
        .select('nome_fantasia, status, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (recentEmpresasError) {
        console.error('Error fetching recent empresas:', recentEmpresasError);
      }
      
      clearTimeout(timeoutId);
      
      // Update stats with the fetched data or default to 0 if there was an error
      setStats({
        associados: associadosCount || 0,
        empresas: empresasCount || 0,
        pendentes: pendentesCount || 0,
        carteirasPendentes: carteirasPendentesCount || 0
      });
      
      // Combine and format recent activity
      const formattedActivity = [
        ...(recentAssociados || []).map(item => ({
          type: 'associado' as const,
          name: `${item.nome} ${item.sobrenome}`,
          action: item.status === 'pendente' ? 'pendente' : 'cadastrado',
          date: new Date(item.created_at).toLocaleDateString()
        })),
        ...(recentEmpresas || []).map(item => ({
          type: 'empresa' as const,
          name: item.nome_fantasia,
          action: item.status === 'pendente' ? 'pendente' : 'conveniada',
          date: new Date(item.created_at).toLocaleDateString()
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4); // Get only the 4 most recent activities
      
      setRecentActivity(formattedActivity);
      
      // Check system status in parallel
      checkSystemStatus().catch(error => {
        console.error('Error in system status check:', error);
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up an interval to refresh the data every 5 minutes
    const intervalId = setInterval(fetchDashboardData, 300000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  return {
    stats,
    recentActivity,
    loading,
    systemStatus,
    refreshData: fetchDashboardData
  };
};
