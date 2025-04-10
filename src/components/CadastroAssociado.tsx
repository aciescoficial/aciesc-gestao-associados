
import React from 'react';
import AssociadoForm from './associado/AssociadoForm';
import { ImportExportAssociado } from './associado/ImportExportAssociado';

const CadastroAssociado: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="wp-header">Cadastrar Associado</h1>
      
      <div className="wp-card">
        <AssociadoForm />
        <ImportExportAssociado />
      </div>
    </div>
  );
};

export default CadastroAssociado;
