
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Map, Users, ClipboardList } from 'lucide-react';
import GoogleMapsConfig from './GoogleMapsConfig';
import PermissionPanel from '../usuarios/PermissionPanel';
import { AuditLogSettings } from './AuditLogSettings';

const ConfiguracoesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="wp-header flex items-center gap-2">
        <Settings className="h-6 w-6" />
        Configurações do Sistema
      </h1>
      
      <Tabs defaultValue="geral" className="wp-card">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="geral" className="flex items-center gap-2">
            <Settings size={16} />
            Geral
          </TabsTrigger>
          <TabsTrigger value="maps" className="flex items-center gap-2">
            <Map size={16} />
            Google Maps
          </TabsTrigger>
          <TabsTrigger value="permissoes" className="flex items-center gap-2">
            <Users size={16} />
            Permissões
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <ClipboardList size={16} />
            Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Configurações Gerais</h2>
            <p>Configurações gerais do sistema estarão disponíveis aqui.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="maps">
          <GoogleMapsConfig />
        </TabsContent>
        
        <TabsContent value="permissoes">
          <PermissionPanel />
        </TabsContent>

        <TabsContent value="logs">
          <AuditLogSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesPage;
