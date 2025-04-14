
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface GatewayTabProps {
  paymentGateway: 'asaas' | 'stripe';
  setPaymentGateway: (gateway: 'asaas' | 'stripe') => void;
  saveConfig: () => Promise<void>;
  isLoading: boolean;
}

const GatewayTab: React.FC<GatewayTabProps> = ({ 
  paymentGateway, 
  setPaymentGateway, 
  saveConfig, 
  isLoading 
}) => {
  return (
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
  );
};

export default GatewayTab;
