
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserPlus, Building, ClipboardCheck } from 'lucide-react';

export const QuickActions: React.FC = () => {
  return (
    <div className="wp-card">
      <h2 className="wp-subheader">Ações Rápidas</h2>
      <div className="space-y-2">
        <Link to="/associados/cadastrar" className="w-full block">
          <button className="wp-button w-full justify-start flex items-center gap-2 px-4">
            <UserPlus size={18} />
            Cadastrar Novo Associado
          </button>
        </Link>
        <Link to="/empresas/cadastrar" className="w-full block">
          <button className="wp-button-secondary w-full justify-start flex items-center gap-2 px-4">
            <Building size={18} />
            Cadastrar Nova Empresa
          </button>
        </Link>
        <Link to="/associados/pendentes" className="w-full block">
          <button className="wp-button-secondary w-full justify-start flex items-center gap-2 px-4">
            <ClipboardCheck size={18} />
            Gerenciar Aprovações Pendentes
          </button>
        </Link>
      </div>
    </div>
  );
};
