
import React, { useState, useEffect } from 'react';
import { Users, Building, Clock, Calendar, Wallet, Mail, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    associados: 0,
    empresas: 0,
    pendentes: 0,
    carteirasPendentes: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<{
    type: 'associado' | 'empresa';
    name: string;
    action: string;
    date: string;
  }[]>([]);
  
  const [loading, setLoading] = useState(true);
  
  // System status
  const [systemStatus, setSystemStatus] = useState({
    asaas: { active: false, message: 'Verificando...' },
    stripe: { active: false, message: 'Verificando...' },
    emails: { active: false, message: 'Verificando...' }
  });

  useEffect(() => {
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
    
    fetchDashboardData();
  }, []);
  
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

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="wp-card flex items-center">
          <div className="mr-4 bg-blue-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-wp-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Associados</p>
            <p className="text-2xl font-semibold">{stats.associados}</p>
          </div>
        </div>
        
        <div className="wp-card flex items-center">
          <div className="mr-4 bg-green-100 p-3 rounded-full">
            <Building className="h-6 w-6 text-wp-success" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Empresas Conveniadas</p>
            <p className="text-2xl font-semibold">{stats.empresas}</p>
          </div>
        </div>
        
        <div className="wp-card flex items-center">
          <div className="mr-4 bg-yellow-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-wp-warning" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Aprovações Pendentes</p>
            <p className="text-2xl font-semibold">{stats.pendentes}</p>
          </div>
        </div>
        
        <div className="wp-card flex items-center">
          <div className="mr-4 bg-purple-100 p-3 rounded-full">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Carteirinhas Pendentes</p>
            <p className="text-lg font-semibold">{stats.carteirasPendentes}</p>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="wp-card">
        <h2 className="wp-subheader">Atividade Recente</h2>
        <div className="overflow-x-auto">
          <table className="wp-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nome</th>
                <th>Ação</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">Carregando atividades...</td>
                </tr>
              ) : recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">Nenhuma atividade recente encontrada</td>
                </tr>
              ) : (
                recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td>
                      {activity.type === 'associado' ? (
                        <span className="wp-badge-success">Associado</span>
                      ) : (
                        <span className="wp-badge-warning">Empresa</span>
                      )}
                    </td>
                    <td>{activity.name}</td>
                    <td>{activity.action}</td>
                    <td>{activity.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="wp-card">
          <h2 className="wp-subheader">Ações Rápidas</h2>
          <div className="space-y-2">
            <button className="wp-button w-full justify-center">
              Cadastrar Novo Associado
            </button>
            <button className="wp-button-secondary w-full justify-center">
              Cadastrar Nova Empresa
            </button>
            <button className="wp-button-secondary w-full justify-center">
              Gerenciar Aprovações Pendentes
            </button>
          </div>
        </div>
        
        <div className="wp-card">
          <h2 className="wp-subheader">Estado do Sistema</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border-b">
              <span className="flex items-center">
                <Wallet className="h-4 w-4 mr-2" />
                Pagamentos
              </span>
              <Badge variant={systemStatus.asaas.active || systemStatus.stripe.active ? "default" : "destructive"}>
                {systemStatus.asaas.active || systemStatus.stripe.active ? 'Conectado' : 'Desconectado'}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-2 border-b">
              <span>API Asaas</span>
              <Badge variant={systemStatus.asaas.active ? "default" : "destructive"}>
                {systemStatus.asaas.message}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-2 border-b">
              <span>API Stripe</span>
              <Badge variant={systemStatus.stripe.active ? "default" : "destructive"}>
                {systemStatus.stripe.message}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-2">
              <span className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Emails
              </span>
              <Badge variant={systemStatus.emails.active ? "default" : "destructive"}>
                {systemStatus.emails.message}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
