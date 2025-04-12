
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, BadgePercent, Truck } from 'lucide-react';
import { getCarteirinhaConfig, updateCarteirinhaConfig } from '@/components/carteirinha/services/carteirinhaService';
import { Card, CardContent } from '@/components/ui/card';

const CarteirinhaConfig = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [carteirinhaFee, setCarteirinhaFee] = useState<number>(15.00);
  const [paymentGateway, setPaymentGateway] = useState<'asaas' | 'stripe'>('asaas');
  const { toast } = useToast();

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        const config = await getCarteirinhaConfig();
        setCarteirinhaFee(config.fee);
        setPaymentGateway(config.paymentGateway);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        toast({
          title: "Erro ao carregar configurações",
          description: "Não foi possível carregar as configurações de carteirinha.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [toast]);

  const saveConfig = async () => {
    try {
      setIsLoading(true);
      await updateCarteirinhaConfig({
        fee: carteirinhaFee,
        paymentGateway
      });
      
      toast({
        title: "Configurações salvas",
        description: "As configurações de carteirinha foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar as configurações de carteirinha.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Configurações de Carteirinha</h2>
      </div>
      
      <Tabs defaultValue="taxa">
        <TabsList>
          <TabsTrigger value="taxa" className="flex items-center gap-1">
            <BadgePercent className="h-4 w-4" /> Taxa de Carteirinha
          </TabsTrigger>
          <TabsTrigger value="gateway" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" /> Gateway de Pagamento
          </TabsTrigger>
          <TabsTrigger value="entrega" className="flex items-center gap-1">
            <Truck className="h-4 w-4" /> Configurações de Entrega
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="taxa" className="pt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="carteirinhaFee">Taxa de Carteirinha (R$)</Label>
                <Input 
                  id="carteirinhaFee" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={carteirinhaFee} 
                  onChange={(e) => setCarteirinhaFee(parseFloat(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  Este valor será cobrado do associado para cada solicitação de carteirinha.
                </p>
              </div>
              
              <Button onClick={saveConfig} disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Taxa'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gateway" className="pt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentGateway">Gateway de Pagamento</Label>
                <Select value={paymentGateway} onValueChange={(val) => setPaymentGateway(val as 'asaas' | 'stripe')}>
                  <SelectTrigger id="paymentGateway">
                    <SelectValue placeholder="Selecione o gateway de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asaas">Asaas</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Selecione o gateway de pagamento para processamento das taxas de carteirinha.
                </p>
              </div>
              
              <Button onClick={saveConfig} disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Gateway'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="entrega" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="p-4 text-center">
                <p className="text-muted-foreground">
                  Configurações de entrega serão implementadas em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarteirinhaConfig;
