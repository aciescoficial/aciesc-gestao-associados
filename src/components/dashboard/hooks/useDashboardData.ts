
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      // Check Asaas integration status
      const { data: asaasConfig } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'ASAAS_API_KEY')
        .maybeSingle()
        .abortSignal(controller.signal);
      
      clearTimeout(timeoutId);
      
      const asaasActive = !!asaasConfig?.value;
      
      // Check Stripe integration status
      const { data: stripeConfig } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'STRIPE_SECRET_KEY')
        .maybeSingle();
      
      const stripeActive = !!stripeConfig?.value;
      
      // Check GHL integration status for email functionality
      const { data: ghlConfig } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'GO_HIGH_LEVEL_API_KEY')
        .maybeSingle();
      
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
      // If aborted due to timeout, set default values
      setSystemStatus({
        asaas: { active: false, message: 'Verificação falhou (timeout)' },
        stripe: { active: false, message: 'Verificação falhou (timeout)' },
        emails: { active: false, message: 'Verificação falhou (timeout)' }
      });
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Create a controller to abort the request if it takes too long
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // Promise.allSettled to fetch all data concurrently
      const [associadosResult, empresasResult, pendentesResult, carteirasResult, recentAssociadosResult, recentEmpresasResult] = 
        await Promise.allSettled([
          // Fetch associados count
          supabase
            .from('associados')
            .select('*', { count: 'exact', head: true })
            .abortSignal(controller.signal),
          
          // Fetch empresas count
          supabase
            .from('empresas')
            .select('*', { count: 'exact', head: true })
            .abortSignal(controller.signal),
          
          // Fetch pending approvals count
          supabase
            .from('associados')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pendente')
            .abortSignal(controller.signal),
          
          // Fetch pending carteirinhas count
          supabase
            .from('carteirinha_solicitacoes')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pendente_pagamento')
            .abortSignal(controller.signal),
          
          // Fetch recent associados
          supabase
            .from('associados')
            .select('nome, sobrenome, status, created_at')
            .order('created_at', { ascending: false })
            .limit(3)
            .abortSignal(controller.signal),
          
          // Fetch recent empresas
          supabase
            .from('empresas')
            .select('nome_fantasia, status, created_at')
            .order('created_at', { ascending: false })
            .limit(3)
            .abortSignal(controller.signal)
        ]);
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Process associados count
      const associadosCount = associadosResult.status === 'fulfilled' ? associadosResult.value.count || 0 : 0;
      
      // Process empresas count
      const empresasCount = empresasResult.status === 'fulfilled' ? empresasResult.value.count || 0 : 0;
      
      // Process pendentes count
      const pendentesCount = pendentesResult.status === 'fulfilled' ? pendentesResult.value.count || 0 : 0;
      
      // Process carteiras pendentes count
      const carteirasPendentesCount = carteirasResult.status === 'fulfilled' ? carteirasResult.value.count || 0 : 0;
      
      // Update stats
      setStats({
        associados: associadosCount,
        empresas: empresasCount,
        pendentes: pendentesCount,
        carteirasPendentes: carteirasPendentesCount
      });
      
      // Process recent activity
      const recentAssociados = recentAssociadosResult.status === 'fulfilled' ? recentAssociadosResult.value.data || [] : [];
      const recentEmpresas = recentEmpresasResult.status === 'fulfilled' ? recentEmpresasResult.value.data || [] : [];
      
      // Combine and format recent activity
      const formattedActivity = [
        ...recentAssociados.map(item => ({
          type: 'associado' as const,
          name: `${item.nome} ${item.sobrenome}`,
          action: item.status === 'pendente' ? 'pendente' : 'cadastrado',
          date: new Date(item.created_at).toLocaleDateString()
        })),
        ...recentEmpresas.map(item => ({
          type: 'empresa' as const,
          name: item.nome_fantasia,
          action: item.status === 'pendente' ? 'pendente' : 'conveniada',
          date: new Date(item.created_at).toLocaleDateString()
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4); // Get only the 4 most recent activities
      
      setRecentActivity(formattedActivity);
      
      // Check payment systems status in parallel
      checkSystemStatus().catch(console.error);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // If it's an abort error, set a specific message
      if (error.name === 'AbortError') {
        console.warn('Dashboard data fetch timed out');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    recentActivity,
    loading,
    systemStatus,
    refreshData: fetchDashboardData
  };
};
