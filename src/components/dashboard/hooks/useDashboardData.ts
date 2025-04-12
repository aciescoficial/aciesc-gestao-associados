
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
      // Check Asaas integration status
      const { data: asaasConfig } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'ASAAS_API_KEY')
        .maybeSingle();
      
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
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch associados count
      const { count: associadosCount, error: associadosError } = await supabase
        .from('associados')
        .select('*', { count: 'exact', head: true });
      
      if (associadosError) throw associadosError;
      
      // Fetch empresas count
      const { count: empresasCount, error: empresasError } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true });
      
      if (empresasError) throw empresasError;
      
      // Fetch pending approvals count
      const { count: pendentesCount, error: pendentesError } = await supabase
        .from('associados')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');
      
      if (pendentesError) throw pendentesError;
      
      // Fetch pending carteirinhas count
      const { count: carteirasPendentesCount, error: carteirasError } = await supabase
        .from('carteirinha_solicitacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente_pagamento');
      
      if (carteirasError) throw carteirasError;
      
      // Update stats
      setStats({
        associados: associadosCount || 0,
        empresas: empresasCount || 0,
        pendentes: pendentesCount || 0,
        carteirasPendentes: carteirasPendentesCount || 0
      });
      
      // Fetch recent activity (newest associados and empresas)
      const { data: recentAssociados, error: recentAssociadosError } = await supabase
        .from('associados')
        .select('nome, sobrenome, status, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (recentAssociadosError) throw recentAssociadosError;
      
      const { data: recentEmpresas, error: recentEmpresasError } = await supabase
        .from('empresas')
        .select('nome_fantasia, status, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (recentEmpresasError) throw recentEmpresasError;
      
      // Combine and format recent activity
      const formattedActivity = [
        ...(recentAssociados?.map(item => ({
          type: 'associado' as const,
          name: `${item.nome} ${item.sobrenome}`,
          action: item.status === 'pendente' ? 'pendente' : 'cadastrado',
          date: new Date(item.created_at).toLocaleDateString()
        })) || []),
        ...(recentEmpresas?.map(item => ({
          type: 'empresa' as const,
          name: item.nome_fantasia,
          action: item.status === 'pendente' ? 'pendente' : 'conveniada',
          date: new Date(item.created_at).toLocaleDateString()
        })) || [])
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4); // Get only the 4 most recent activities
      
      setRecentActivity(formattedActivity);
      
      // Check payment systems status
      await checkSystemStatus();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
