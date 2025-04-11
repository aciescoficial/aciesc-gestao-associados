
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CreditCard, MapPin, Truck } from 'lucide-react';

const formSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  sobrenome: z.string().min(2, 'Sobrenome é obrigatório'),
  cep: z.string().min(8, 'CEP é obrigatório'),
  endereco: z.string().min(5, 'Endereço é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(2, 'Bairro é obrigatório'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().min(2, 'Estado é obrigatório'),
  confirmarEndereco: z.boolean().refine(value => value === true, {
    message: 'Você precisa confirmar o endereço de entrega',
  }),
});

const SolicitarCarteirinhaPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [taxaEntrega, setTaxaEntrega] = useState(15.00); // Valor padrão
  const [paymentGateway, setPaymentGateway] = useState<'asaas' | 'stripe'>('asaas');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      sobrenome: '',
      cep: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      confirmarEndereco: false,
    },
  });

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
            form.reset({
              nome: associado.nome || '',
              sobrenome: associado.sobrenome || '',
              cep: associado.cep || '',
              endereco: associado.rua || '',
              numero: associado.numero || '',
              complemento: associado.complemento || '',
              bairro: associado.bairro || '',
              cidade: associado.cidade || '',
              estado: associado.estado || '',
              confirmarEndereco: false,
            });
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
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Salvar a solicitação no banco de dados
      const { data: solicitacao, error } = await supabase
        .from('carteirinha_solicitacoes')
        .insert({
          associado_id: userData?.id,
          nome: data.nome,
          sobrenome: data.sobrenome,
          endereco_entrega: `${data.endereco}, ${data.numero}, ${data.bairro}, ${data.cidade}-${data.estado}, ${data.cep}`,
          complemento: data.complemento,
          valor: taxaEntrega,
          status: 'pendente_pagamento'
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
        window.location.href = paymentData.invoiceUrl;
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
        window.location.href = paymentData.url;
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

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Solicitar Carteirinha</h1>
      
      <div className="wp-card">
        <h2 className="text-xl font-semibold mb-4">Solicitar Nova Carteirinha</h2>
        <p className="mb-6 text-muted-foreground">
          Para solicitar sua nova carteirinha, confirme seu endereço de entrega e efetue o pagamento da taxa de envio.
        </p>
        
        <div className="mb-6">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Taxa de Entrega</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Será cobrada uma taxa de entrega no valor de <span className="font-semibold text-foreground">R$ {taxaEntrega.toFixed(2).replace('.', ',')}</span>
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-lg">Endereço de Entrega</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sobrenome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, Avenida, etc..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="complemento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Apto, Bloco, Casa, etc..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="UF" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="confirmarEndereco"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4 pt-4 border-t">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Confirmo que o endereço acima está correto e é o endereço de entrega da minha carteirinha
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4 mt-2">
              <Button 
                type="submit" 
                className="w-full md:w-auto" 
                disabled={isLoading}
              >
                {isLoading ? (
                  "Processando..."
                ) : (
                  <>
                    Prosseguir para pagamento <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SolicitarCarteirinhaPage;
