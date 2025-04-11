
import React from 'react';
import MensagensForm from './MensagensForm';

const MensagensPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="wp-header">Sistema de Mensagens</h1>
      </div>
      
      <div className="wp-card">
        <h2 className="text-xl font-semibold mb-4">Enviar Nova Mensagem</h2>
        <MensagensForm />
      </div>
    </div>
  );
};

export default MensagensPage;
