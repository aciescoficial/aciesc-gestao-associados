
import React from 'react';

const ApiKeyRedirect: React.FC = () => {
  return (
    <div className="wp-card p-4 mb-4">
      <h3 className="font-medium mb-2">Configuração do Google Maps Necessária</h3>
      <p className="text-sm text-gray-500 mb-4">
        Para utilizar o mapa, é necessário configurar a chave da API do Google Maps.
      </p>
      <a href="/configuracoes" className="wp-button inline-block">Ir para Configurações</a>
    </div>
  );
};

export default ApiKeyRedirect;
