
import { useState } from 'react';
import type { EnderecoFormValues } from './endereco-form/schema';
import { useCarteirinhaData } from './hooks/useCarteirinhaData';
import { useCarteirinhaSubmit } from './hooks/useCarteirinhaSubmit';
import { useEndereco } from './hooks/useEndereco';

interface UseCarteirinhaSolicitacaoProps {
  navigateToPayment: (url: string) => void;
  entregaMethod?: 'retirada' | 'entrega';
  retiradaLocation?: 'grafica' | 'aciesc';
}

export const useCarteirinhaSolicitacao = ({ 
  navigateToPayment, 
  entregaMethod = 'entrega',
  retiradaLocation = 'grafica'
}: UseCarteirinhaSolicitacaoProps) => {
  // Use our extracted hooks
  const { userData, taxaEntrega, isLoading, paymentGateway, setIsLoading } = useCarteirinhaData();
  const { handleSubmit: submitCarteirinha } = useCarteirinhaSubmit({
    userData,
    taxaEntrega,
    entregaMethod,
    retiradaLocation,
    paymentGateway,
    navigateToPayment,
    setIsLoading
  });
  const { getDefaultValues } = useEndereco(userData);

  // Main submit handler
  const handleSubmit = (data: EnderecoFormValues) => {
    return submitCarteirinha(data);
  };

  return {
    userData,
    taxaEntrega,
    isLoading,
    handleSubmit,
    getDefaultValues,
  };
};
