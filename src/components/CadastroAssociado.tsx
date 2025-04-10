
import React from 'react';
import AssociadoForm from './associado/AssociadoForm';

const CadastroAssociado: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="wp-header">Cadastrar Associado</h1>
      
      <div className="wp-card">
        <AssociadoForm />
      </div>
    </div>
  );
};

export default CadastroAssociado;
