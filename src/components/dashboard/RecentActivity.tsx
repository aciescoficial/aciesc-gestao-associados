
import React from 'react';

interface RecentActivityProps {
  recentActivity: {
    type: 'associado' | 'empresa';
    name: string;
    action: string;
    date: string;
  }[];
  loading: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ recentActivity, loading }) => {
  return (
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
  );
};
