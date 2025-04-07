
import React from 'react';
import { Users, Building, Clock, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock data - would be fetched from API in real implementation
  const stats = {
    associados: 127,
    empresas: 43,
    pendentes: 8,
    ultimaAtualizacao: new Date().toLocaleDateString()
  };

  // Recent activity mock data
  const recentActivity = [
    { type: 'associado', name: 'João Silva', action: 'cadastrado', date: '05/04/2025' },
    { type: 'empresa', name: 'Farmácia Saúde', action: 'conveniada', date: '04/04/2025' },
    { type: 'associado', name: 'Maria Oliveira', action: 'aprovado', date: '03/04/2025' },
    { type: 'empresa', name: 'Academia Fitness', action: 'aprovada', date: '02/04/2025' },
  ];

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
            <p className="text-sm text-gray-500">Última Atualização</p>
            <p className="text-lg font-semibold">{stats.ultimaAtualizacao}</p>
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
              {recentActivity.map((activity, index) => (
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
              ))}
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
              <span>Pagamentos</span>
              <span className="wp-badge-success">Conectado</span>
            </div>
            <div className="flex justify-between items-center p-2 border-b">
              <span>API Asaas</span>
              <span className="wp-badge-success">Operacional</span>
            </div>
            <div className="flex justify-between items-center p-2 border-b">
              <span>Carteirinha PDF</span>
              <span className="wp-badge-success">Funcionando</span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span>Emails</span>
              <span className="wp-badge-success">Ativos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
