
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Lock, Shield, KeyRound } from 'lucide-react';
import PermissionPanel from '../../usuarios/permission/PermissionPanel';
import RecaptchaConfig from '../recaptcha/RecaptchaConfig';
import AdminUserSetup from '../../auth/AdminUserSetup';
import TwoFactorSettings from './TwoFactorSettings';

const SecurityTabContent: React.FC = () => {
  const [activeSecurityTab, setActiveSecurityTab] = useState<string>('permissions');

  return (
    <div className="space-y-4">
      <Tabs value={activeSecurityTab} onValueChange={setActiveSecurityTab}>
        <TabsList>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Users size={16} />
            Permissões
          </TabsTrigger>
          <TabsTrigger value="recaptcha" className="flex items-center gap-2">
            <Lock size={16} />
            reCAPTCHA
          </TabsTrigger>
          <TabsTrigger value="2fa" className="flex items-center gap-2">
            <KeyRound size={16} />
            Autenticação 2 Fatores
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Shield size={16} />
            Administração
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="permissions" className="pt-4">
          <PermissionPanel />
        </TabsContent>
        
        <TabsContent value="recaptcha" className="pt-4">
          <RecaptchaConfig />
        </TabsContent>
        
        <TabsContent value="2fa" className="pt-4">
          <TwoFactorSettings />
        </TabsContent>
        
        <TabsContent value="admin" className="pt-4">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Administração do Sistema</h2>
            <AdminUserSetup />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityTabContent;
