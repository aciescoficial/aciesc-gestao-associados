
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ClipboardList, Clock, CreditCard, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ActivityLogsTabProps {
  userId: string;
}

interface ActivityLog {
  event: string;
  timestamp: string;
}

interface PaymentLog {
  amount: string;
  date: string;
  status: string;
  type?: string;
}

interface CarteirinhaLog {
  requestDate: string;
  status: string;
  trackingCode?: string | null;
}

export const ActivityLogsTab = ({ userId }: ActivityLogsTabProps) => {
  const [accessLogs, setAccessLogs] = useState<ActivityLog[]>([]);
  const [paymentLogs, setPaymentLogs] = useState<PaymentLog[]>([]);
  const [carteirinhaLogs, setCarteirinhaLogs] = useState<CarteirinhaLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllActivityData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        // Execute all queries in parallel for better performance
        const [accessLogsResult, paymentsResult, carteirinhaResult, associadoIdResult] = await Promise.all([
          // 1. Fetch access logs
          supabase
            .from('user_access_logs')
            .select('event, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10),
            
          // 2. First get user payment data (query will return empty if user isn't an associado)
          supabase
            .from('member_subscriptions')
            .select(`
              created_at, 
              status, 
              payment_method,
              association_type_id,
              association_types!inner(value)
            `)
            .eq('associado_id', userId)
            .order('created_at', { ascending: false })
            .limit(5),
            
          // 3. Get carteirinha requests (will return empty if no associado linked)
          supabase
            .from('carteirinha_solicitacoes')
            .select('created_at, status, codigo_rastreio')
            .eq('associado_id', userId)
            .order('created_at', { ascending: false }),
            
          // 4. Get associado_id from user table
          supabase
            .from('user')
            .select('associado_id')
            .eq('id', userId)
            .maybeSingle()
        ]);

        // Handle access logs
        if (accessLogsResult.error) throw accessLogsResult.error;
        setAccessLogs((accessLogsResult.data || []).map(log => ({
          event: log.event,
          timestamp: new Date(log.created_at).toLocaleString()
        })));
        
        // Handle payment logs - if direct user payments found
        if (paymentsResult.error) throw paymentsResult.error;
        
        const formattedPayments = (paymentsResult.data || []).map(payment => ({
          amount: payment.association_types?.value 
            ? `R$ ${Number(payment.association_types.value).toFixed(2)}` 
            : 'Valor não disponível',
          date: new Date(payment.created_at).toLocaleString(),
          status: formatPaymentStatus(payment.status),
          type: payment.payment_method || 'N/A'
        }));
        
        // If we have an associado_id but no payments directly linked to user,
        // try to get payments through the associado record
        const associadoId = associadoIdResult.data?.associado_id;
        if (associadoId && formattedPayments.length === 0) {
          const associadoPayments = await supabase
            .from('associados')
            .select('data_ultimo_pagamento, valor_pago')
            .eq('id', associadoId)
            .maybeSingle();
            
          if (associadoPayments.data && associadoPayments.data.data_ultimo_pagamento) {
            formattedPayments.push({
              amount: associadoPayments.data.valor_pago 
                ? `R$ ${associadoPayments.data.valor_pago}` 
                : 'Valor não disponível',
              date: new Date(associadoPayments.data.data_ultimo_pagamento).toLocaleString(),
              status: 'Confirmado',
              type: 'Mensalidade'
            });
          }
        }
        
        setPaymentLogs(formattedPayments);
        
        // Handle carteirinha requests
        if (carteirinhaResult.error) throw carteirinhaResult.error;
        
        // Format carteirinha requests
        setCarteirinhaLogs((carteirinhaResult.data || []).map(req => ({
          requestDate: new Date(req.created_at).toLocaleString(),
          status: formatCarteirinhaStatus(req.status),
          trackingCode: req.codigo_rastreio
        })));
        
      } catch (error: any) {
        console.error('Error fetching activity data:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar histórico",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllActivityData();
  }, [userId, toast]);

  // Helper to format payment status
  const formatPaymentStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'confirmed': 'Confirmado',
      'cancelled': 'Cancelado',
      'overdue': 'Atrasado',
      'failed': 'Falhou',
    };
    
    return statusMap[status] || status;
  };
  
  // Helper to format carteirinha status
  const formatCarteirinhaStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pendente_pagamento': 'Aguardando Pagamento',
      'pagamento_confirmado': 'Pagamento Confirmado',
      'em_producao': 'Em Produção',
      'enviado': 'Enviada',
      'entregue': 'Entregue',
      'cancelado': 'Cancelada',
    };
    
    return statusMap[status] || status;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Histórico de Atividades
        </CardTitle>
        <CardDescription>
          Visualize seu histórico de atividades recentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="medium" />
          </div>
        ) : (
          <Tabs defaultValue="access" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="access">
                <Clock className="h-4 w-4 mr-2" /> Acessos
              </TabsTrigger>
              <TabsTrigger value="payments">
                <CreditCard className="h-4 w-4 mr-2" /> Pagamentos
              </TabsTrigger>
              <TabsTrigger value="carteirinhas">
                <User className="h-4 w-4 mr-2" /> Carteirinhas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="access">
              {accessLogs.length > 0 ? (
                <div className="space-y-2">
                  {accessLogs.map((log, index) => (
                    <div key={index} className="flex justify-between p-2 border-b last:border-0">
                      <span>{log.event}</span>
                      <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  Sem registros de acesso recente
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="payments">
              {paymentLogs.length > 0 ? (
                <div className="space-y-2">
                  {paymentLogs.map((payment, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 p-2 border-b last:border-0">
                      <div className="flex flex-col">
                        <span className="font-medium">{payment.amount}</span>
                        <span className="text-xs text-muted-foreground">{payment.type}</span>
                      </div>
                      <div className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {payment.date}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  Nenhum histórico de pagamento disponível
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="carteirinhas">
              {carteirinhaLogs.length > 0 ? (
                <div className="space-y-2">
                  {carteirinhaLogs.map((carteirinha, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 p-2 border-b last:border-0">
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          carteirinha.status.includes('Entregue') ? 'bg-green-100 text-green-800' : 
                          carteirinha.status.includes('Enviada') ? 'bg-blue-100 text-blue-800' :
                          carteirinha.status.includes('Produção') ? 'bg-purple-100 text-purple-800' :
                          carteirinha.status.includes('Pagamento Confirmado') ? 'bg-green-100 text-green-800' :
                          carteirinha.status.includes('Aguardando') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {carteirinha.status}
                        </span>
                      </div>
                      <div className="text-sm">
                        {carteirinha.trackingCode ? (
                          <span className="font-mono text-xs bg-gray-100 p-1 rounded">
                            {carteirinha.trackingCode}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">Sem código de rastreio</span>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {carteirinha.requestDate}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  Nenhuma solicitação de carteirinha encontrada
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

