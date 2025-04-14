
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, BadgePercent, Truck, MapPin, Store, Palette } from 'lucide-react';
import { getCarteirinhaConfig, updateCarteirinhaConfig } from '@/components/carteirinha/services/carteirinhaService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import CardPersonalizationPanel from '@/components/carteirinha/CardPersonalizationPanel';
import { useCardSettings } from '@/components/carteirinha/hooks/useCardSettings';
import { ConveniadoData } from '@/components/carteirinha/types';

const CarteirinhaConfig = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [carteirinhaFee, setCarteirinhaFee] = useState<number>(15.00);
  const [paymentGateway, setPaymentGateway] = useState<'asaas' | 'stripe'>('asaas');
  const [graficaEndereco, setGraficaEndereco] = useState<string>('Rua das Impressões, 123');
  const [aciescEndereco, setAciescEndereco] = useState<string>('Avenida Principal, 456');
  const [permiteRetirada, setPermiteRetirada] = useState<boolean>(true);
  const [permiteEntrega, setPermiteEntrega] = useState<boolean>(true);
  const { cardSettings, updateCardSetting } = useCardSettings();
  const { toast } = useToast();
  
  // Amostra de dados para previsualização
  const previewData: ConveniadoData = {
    id: '1',
    nome: 'João',
    sobrenome: 'Silva',
    creci: '12345',
    cpf: '123.456.789-00',
    foto: null,
    validade: '2025-12-31'
  };

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        const config = await getCarteirinhaConfig();
        setCarteirinhaFee(config.fee);
        setPaymentGateway(config.paymentGateway);
        
        // Load additional pickup location settings
        const { data: configData } = await supabase
          .from('system_config')
          .select('*')
          .in('key', [
            'GRAFICA_ENDERECO',
            'ACIESC_ENDERECO',
            'PERMITE_RETIRADA',
            'PERMITE_ENTREGA'
          ]);
          
        if (configData) {
          const graficaConfig = configData.find(item => item.key === 'GRAFICA_ENDERECO');
          const aciescConfig = configData.find(item => item.key === 'ACIESC_ENDERECO');
          const permiteRetiradaConfig = configData.find(item => item.key === 'PERMITE_RETIRADA');
          const permiteEntregaConfig = configData.find(item => item.key === 'PERMITE_ENTREGA');
          
          if (graficaConfig) setGraficaEndereco(graficaConfig.value);
          if (aciescConfig) setAciescEndereco(aciescConfig.value);
          if (permiteRetiradaConfig) setPermiteRetirada(permiteRetiradaConfig.value === 'true');
          if (permiteEntregaConfig) setPermiteEntrega(permiteEntregaConfig.value === 'true');
        }
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
      
      // Save additional pickup location settings
      const { error } = await supabase
        .from('system_config')
        .upsert([
          { key: 'GRAFICA_ENDERECO', value: graficaEndereco },
          { key: 'ACIESC_ENDERECO', value: aciescEndereco },
          { key: 'PERMITE_RETIRADA', value: permiteRetirada.toString() },
          { key: 'PERMITE_ENTREGA', value: permiteEntrega.toString() }
        ]);
      
      if (error) throw error;
      
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
          <TabsTrigger value="retirada" className="flex items-center gap-1">
            <Store className="h-4 w-4" /> Pontos de Retirada
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center gap-1">
            <Palette className="h-4 w-4" /> Personalização Visual
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
            <CardHeader>
              <CardTitle>Configurações de Entrega</CardTitle>
              <CardDescription>Configure as opções de entrega das carteirinhas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="permite-entrega">Permitir entrega no endereço</Label>
                  <p className="text-sm text-muted-foreground">
                    Quando ativado, os associados poderão optar por receber a carteirinha em seu endereço
                  </p>
                </div>
                <Switch
                  id="permite-entrega"
                  checked={permiteEntrega}
                  onCheckedChange={setPermiteEntrega}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="permite-retirada">Permitir retirada pessoal</Label>
                  <p className="text-sm text-muted-foreground">
                    Quando ativado, os associados poderão optar por retirar a carteirinha pessoalmente
                  </p>
                </div>
                <Switch
                  id="permite-retirada"
                  checked={permiteRetirada}
                  onCheckedChange={setPermiteRetirada}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveConfig} disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="retirada" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pontos de Retirada</CardTitle>
              <CardDescription>Configure os endereços dos pontos de retirada das carteirinhas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grafica-endereco" className="flex items-center gap-2">
                  <Store className="h-4 w-4" /> Endereço da Gráfica Parceira
                </Label>
                <Textarea
                  id="grafica-endereco"
                  value={graficaEndereco}
                  onChange={(e) => setGraficaEndereco(e.target.value)}
                  placeholder="Informe o endereço completo da gráfica"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aciesc-endereco" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Endereço da ACIESC
                </Label>
                <Textarea
                  id="aciesc-endereco"
                  value={aciescEndereco}
                  onChange={(e) => setAciescEndereco(e.target.value)}
                  placeholder="Informe o endereço completo da sede da ACIESC"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveConfig} disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Pontos de Retirada'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="visual" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalização Visual da Carteirinha</CardTitle>
              <CardDescription>Configure a aparência padrão das carteirinhas</CardDescription>
            </CardHeader>
            <CardContent>
              <CardPersonalizationPanel 
                cardSettings={cardSettings} 
                updateCardSetting={updateCardSetting} 
              />
              
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Essas configurações definem a aparência padrão de novas carteirinhas geradas no sistema.
                  Os usuários ainda podem personalizar a aparência ao gerar carteirinhas individuais.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveConfig} disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Configurações Visuais'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarteirinhaConfig;
