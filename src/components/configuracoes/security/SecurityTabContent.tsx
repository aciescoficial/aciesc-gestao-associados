
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TwoFactorSettings from './TwoFactorSettings';
import RecaptchaConfig from '@/components/configuracoes/recaptcha/RecaptchaConfig';

const SecurityTabContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Segurança</CardTitle>
          <CardDescription>
            Configure as opções de segurança do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TwoFactorSettings />
        </CardContent>
      </Card>

      <RecaptchaConfig />
    </div>
  );
};

export default SecurityTabContent;
