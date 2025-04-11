
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface TaxaEntregaCardProps {
  valor: number;
}

export const TaxaEntregaCard: React.FC<TaxaEntregaCardProps> = ({ valor }) => {
  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Taxa de Entrega</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          Será cobrada uma taxa de entrega no valor de <span className="font-semibold text-foreground">R$ {valor.toFixed(2).replace('.', ',')}</span>
        </p>
      </CardContent>
    </Card>
  );
};
