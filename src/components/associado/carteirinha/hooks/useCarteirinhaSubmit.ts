
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { EnderecoFormValues } from '../EnderecoEntregaForm';

interface UseCarteirinhaSubmitProps {
  userData: any;
  taxaEntrega: number;
  entregaMethod: 'retirada' | 'entrega';
  retiradaLocation: 'grafica' | 'aciesc';
  paymentGateway: 'asaas' | 'stripe';
  navigateToPayment: (url: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useCarteirinhaSubmit = ({
  userData,
  taxaEntrega,
  entregaMethod,
  retiradaLocation,
  paymentGateway,
  navigateToPayment,
  setIsLoading
}: UseCarteirinhaSubmitProps) => {
  const { toast } = useToast();

  const handleSubmit = async (data: EnderecoFormValues) => {
    try {
      setIsLoading(true);
      
      if (!userData?.id) {
        throw new Error("Dados do usuário não encontrados");
      }
      
      // Valor a ser cobrado (0 se for retirada pessoalmente)
      const valorCobrado = entregaMethod === 'entrega' ? taxaEntrega : 0;
      
      // Montar o endereço formatado (para entrega) ou local de retirada
      let enderecoCompleto = '';
      let tipoEntrega = '';
      
      if (entregaMethod === 'entrega') {
        enderecoCompleto = `${data.endereco}, ${data.numero}, ${data.bairro}, ${data.cidade}-${data.estado}, ${data.cep}`;
        tipoEntrega = 'entrega';
      } else {
        enderecoCompleto = retiradaLocation === 'grafica' ? 'Retirada na Gráfica Parceira' : 'Retirada na sede da ACIESC';
        tipoEntrega = `retirada_${retiradaLocation}`;
      }
      
      // Contorna o erro de tipo usando type assertion
      const supabaseAny = supabase as any;
      
      // Salvar a solicitação no banco de dados
      const { data: solicitacao, error } = await supabaseAny
        .from('carteirinha_solicitacoes')
        .insert({
          associado_id: userData.id,
          nome: data.nome || userData.nome,
          sobrenome: data.sobrenome || userData.sobrenome,
          endereco_entrega: enderecoCompleto,
          complemento: entregaMethod === 'entrega' ? data.complemento : null,
          valor: valorCobrado,
          status: valorCobrado > 0 ? 'pendente_pagamento' : 'aguardando_producao',
          email: userData.email,
          tipo_entrega: tipoEntrega
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Se há taxa a pagar, inicia o processo de pagamento
      if (valorCobrado > 0) {
        if (paymentGateway === 'asaas') {
          // Chama a função de pagamento do Asaas
          const { data: paymentData, error: paymentError } = await supabase.functions.invoke('asaas-payment', {
            body: {
              customer: {
                name: `${userData.nome} ${userData.sobrenome}`,
                email: userData?.email,
                cpfCnpj: userData?.cpf
              },
              value: valorCobrado,
              description: `Taxa de carteirinha - Solicitação #${solicitacao.id}`,
              solicitacaoId: solicitacao.id
            }
          });
          
          if (paymentError) throw paymentError;
          
          // Redirecionamos para a URL de pagamento
          navigateToPayment(paymentData.invoiceUrl);
        } else {
          // Chama a função de pagamento do Stripe
          const { data: paymentData, error: paymentError } = await supabase.functions.invoke('stripe-payment', {
            body: {
              customerId: userData?.id,
              customerEmail: userData?.email,
              amount: valorCobrado * 100, // Stripe recebe valores em centavos
              description: `Taxa de carteirinha - Solicitação #${solicitacao.id}`,
              solicitacaoId: solicitacao.id
            }
          });
          
          if (paymentError) throw paymentError;
          
          // Redirecionamos para a URL de checkout do Stripe
          navigateToPayment(paymentData.url);
        }
      } else {
        // Sem taxa, redirecionamos para página de sucesso
        toast({
          title: "Solicitação enviada",
          description: "Sua carteirinha foi solicitada com sucesso e está em produção.",
        });
        
        // Redirecionamos para página de sucesso
        navigateToPayment('/pagamento-sucesso?status=gratuito');
      }
    } catch (error: any) {
      console.error('Erro ao solicitar carteirinha:', error);
      toast({
        title: "Erro ao processar solicitação",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return {
    handleSubmit
  };
};
