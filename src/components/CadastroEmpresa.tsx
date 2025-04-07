
import React from 'react';
import EmpresaForm from './empresa/EmpresaForm';

const CadastroEmpresa: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="wp-header">Cadastrar Empresa Conveniada</h1>
      
      <div className="wp-card">
        <EmpresaForm />
      </div>
    </div>
  );
};

export default CadastroEmpresa;
