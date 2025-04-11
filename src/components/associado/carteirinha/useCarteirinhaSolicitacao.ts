
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { EnderecoFormValues } from './EnderecoEntregaForm';

interface UseCarteirinhaSolicitacaoProps {
  navigateToPayment: (url: string) => void;
}

export const useCarteirinhaSolicitacao = ({ navigateToPayment }: UseCarteirinhaSolicitacaoProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [taxaEntrega, setTaxaEntrega] = useState(15.00); // Valor padrão
  const [paymentGateway, setPaymentGateway] = useState<'asaas' | 'stripe'>('asaas');
  const { toast } = useToast();

  // Carrega os dados do associado logado
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: associado } = await supabase
            .from('associados')
            .select('*')
            .eq('email', user.email)
            .maybeSingle();
          
          if (associado) {
            setUserData(associado);
          }
        }
        
        // Carrega a configuração de pagamento
        const { data: configData } = await supabase
          .from('system_config')
          .select('*')
          .in('key', ['PAYMENT_GATEWAY', 'ID_CARD_FEE'])
          .order('key');
        
        if (configData) {
          const paymentConfig = configData.find(item => item.key === 'PAYMENT_GATEWAY');
          const feeConfig = configData.find(item => item.key === 'ID_CARD_FEE');
          
          if (paymentConfig) {
            setPaymentGateway(paymentConfig.value as 'asaas' | 'stripe');
          }
          
          if (feeConfig) {
            setTaxaEntrega(parseFloat(feeConfig.value));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar seus dados.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleSubmit = async (data: EnderecoFormValues) => {
    try {
      setIsLoading(true);
      
      if (!userData?.id) {
        throw new Error("Dados do usuário não encontrados");
      }
      
      // Montar o endereço formatado
      const enderecoCompleto = `${data.endereco}, ${data.numero}, ${data.bairro}, ${data.cidade}-${data.estado}, ${data.cep}`;
      
      // Contorna o erro de tipo usando type assertion
      const supabaseAny = supabase as any;
      
      // Salvar a solicitação no banco de dados
      const { data: solicitacao, error } = await supabaseAny
        .from('carteirinha_solicitacoes')
        .insert({
          associado_id: userData.id,
          nome: data.nome,
          sobrenome: data.sobrenome,
          endereco_entrega: enderecoCompleto,
          complemento: data.complemento,
          valor: taxaEntrega,
          status: 'pendente_pagamento',
          email: userData.email
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Agora iniciamos o processo de pagamento
      if (paymentGateway === 'asaas') {
        // Chama a função de pagamento do Asaas
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('asaas-payment', {
          body: {
            customer: {
              name: `${data.nome} ${data.sobrenome}`,
              email: userData?.email,
              cpfCnpj: userData?.cpf
            },
            value: taxaEntrega,
            description: `Taxa de entrega de carteirinha - Solicitação #${solicitacao.id}`,
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
            amount: taxaEntrega * 100, // Stripe recebe valores em centavos
            description: `Taxa de entrega de carteirinha - Solicitação #${solicitacao.id}`,
            solicitacaoId: solicitacao.id
          }
        });
        
        if (paymentError) throw paymentError;
        
        // Redirecionamos para a URL de checkout do Stripe
        navigateToPayment(paymentData.url);
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

  const getDefaultValues = () => {
    return {
      nome: userData?.nome || '',
      sobrenome: userData?.sobrenome || '',
      cep: userData?.cep || '',
      endereco: userData?.rua || '',
      numero: userData?.numero || '',
      complemento: userData?.complemento || '',
      bairro: userData?.bairro || '',
      cidade: userData?.cidade || '',
      estado: userData?.estado || '',
      confirmarEndereco: false,
    };
  };

  return {
    userData,
    taxaEntrega,
    isLoading,
    handleSubmit,
    getDefaultValues,
  };
};
