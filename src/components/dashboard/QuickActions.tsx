
import React from 'react';
import { Button } from '@/components/ui/button';

export const QuickActions: React.FC = () => {
  return (
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
  );
};
