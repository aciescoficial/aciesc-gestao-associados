
import React from 'react';
import { Wallet, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SystemStatusProps {
  systemStatus: {
    asaas: { active: boolean; message: string };
    stripe: { active: boolean; message: string };
    emails: { active: boolean; message: string };
  };
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ systemStatus }) => {
  return (
    <div className="wp-card">
      <h2 className="wp-subheader">Estado do Sistema</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 border-b">
          <span className="flex items-center">
            <Wallet className="h-4 w-4 mr-2" />
            Pagamentos
          </span>
          <Badge variant={systemStatus.asaas.active || systemStatus.stripe.active ? "default" : "destructive"}>
            {systemStatus.asaas.active || systemStatus.stripe.active ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>
        <div className="flex justify-between items-center p-2 border-b">
          <span>API Asaas</span>
          <Badge variant={systemStatus.asaas.active ? "default" : "destructive"}>
            {systemStatus.asaas.message}
          </Badge>
        </div>
        <div className="flex justify-between items-center p-2 border-b">
          <span>API Stripe</span>
          <Badge variant={systemStatus.stripe.active ? "default" : "destructive"}>
            {systemStatus.stripe.message}
          </Badge>
        </div>
        <div className="flex justify-between items-center p-2">
          <span className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Emails
          </span>
          <Badge variant={systemStatus.emails.active ? "default" : "destructive"}>
            {systemStatus.emails.message}
          </Badge>
        </div>
      </div>
    </div>
  );
};
