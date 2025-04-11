
import React from 'react';
import { MapPin } from 'lucide-react';
import { EnderecoEntregaForm } from './carteirinha/EnderecoEntregaForm';
import { TaxaEntregaCard } from './carteirinha/TaxaEntregaCard';
import { useCarteirinhaSolicitacao } from './carteirinha/useCarteirinhaSolicitacao';

const SolicitarCarteirinhaPage = () => {
  const {
    userData,
    taxaEntrega,
    isLoading,
    handleSubmit,
    getDefaultValues
  } = useCarteirinhaSolicitacao({
    navigateToPayment: (url) => window.location.href = url
  });

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Solicitar Carteirinha</h1>
      
      <div className="wp-card">
        <h2 className="text-xl font-semibold mb-4">Solicitar Nova Carteirinha</h2>
        <p className="mb-6 text-muted-foreground">
          Para solicitar sua nova carteirinha, confirme seu endereço de entrega e efetue o pagamento da taxa de envio.
        </p>
        
        <div className="mb-6">
          <TaxaEntregaCard valor={taxaEntrega} />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-lg">Endereço de Entrega</h3>
          </div>
          
          <EnderecoEntregaForm
            defaultValues={getDefaultValues()}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default SolicitarCarteirinhaPage;
