
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, CreditCard, Package, Truck, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  rastreioCode?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, rastreioCode }) => {
  switch (status) {
    case 'pendente_pagamento':
      return <Badge variant="outline" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" /> Aguardando Pagamento
      </Badge>;
    case 'pagamento_aprovado':
      return <Badge variant="outline" className="flex items-center gap-1 text-blue-600 border-blue-600">
        <Check className="h-3 w-3" /> Pagamento Aprovado
      </Badge>;
    case 'em_producao':
      return <Badge variant="outline" className="flex items-center gap-1 text-purple-600 border-purple-600">
        <CreditCard className="h-3 w-3" /> Em Produção
      </Badge>;
    case 'enviado':
      return <Badge variant="outline" className="flex items-center gap-1 text-indigo-600 border-indigo-600">
        <Package className="h-3 w-3" /> Enviado
      </Badge>;
    case 'entregue':
      return <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-600">
        <Check className="h-3 w-3" /> Entregue
      </Badge>;
    case 'cancelado':
      return <Badge variant="outline" className="flex items-center gap-1 text-red-600 border-red-600">
        <XCircle className="h-3 w-3" /> Cancelado
      </Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "pendente_pagamento", label: "Aguardando Pagamento" },
  { value: "pagamento_aprovado", label: "Pagamento Aprovado" },
  { value: "em_producao", label: "Em Produção" },
  { value: "enviado", label: "Enviado" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" },
];

export const TrackingInfo: React.FC<{ code: string }> = ({ code }) => {
  if (!code) return null;

  return (
    <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
      <Truck className="h-3 w-3" /> {code}
    </div>
  );
};
