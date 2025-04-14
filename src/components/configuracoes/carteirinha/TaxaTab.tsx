
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface TaxaTabProps {
  carteirinhaFee: number;
  setCarteirinhaFee: (fee: number) => void;
  saveConfig: () => Promise<void>;
  isLoading: boolean;
}

const TaxaTab: React.FC<TaxaTabProps> = ({ 
  carteirinhaFee, 
  setCarteirinhaFee, 
  saveConfig, 
  isLoading 
}) => {
  return (
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
  );
};

export default TaxaTab;
