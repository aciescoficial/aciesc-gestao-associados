
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleTabPanel from './components/RoleTabPanel';
import { MenuPermission, SaveLoadingState } from './types';
import { UserRole } from '../types';

interface PermissionTabsProps {
  menuPermissions: Record<UserRole, MenuPermission[]>;
  saveLoading: SaveLoadingState;
  toggleMenuPermission: (role: UserRole, menuId: string, enabled: boolean) => void;
  toggleSubPermission: (role: UserRole, menuId: string, subPermId: string, enabled: boolean) => void;
}

const PermissionTabs: React.FC<PermissionTabsProps> = ({
  menuPermissions,
  saveLoading,
  toggleMenuPermission,
  toggleSubPermission
}) => {
  return (
    <Tabs defaultValue="admin" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="admin">Administrador</TabsTrigger>
        <TabsTrigger value="user">Associado</TabsTrigger>
        <TabsTrigger value="empresa">Empresa</TabsTrigger>
      </TabsList>
      
      <TabsContent value="admin">
        <RoleTabPanel
          role="admin"
          menuPermissions={menuPermissions.admin}
          saveLoading={saveLoading}
          isAdmin={true}
          toggleMenuPermission={toggleMenuPermission}
          toggleSubPermission={toggleSubPermission}
        />
      </TabsContent>
      
      <TabsContent value="user">
        <RoleTabPanel
          role="user"
          menuPermissions={menuPermissions.user}
          saveLoading={saveLoading}
          isAdmin={false}
          toggleMenuPermission={toggleMenuPermission}
          toggleSubPermission={toggleSubPermission}
        />
      </TabsContent>
      
      <TabsContent value="empresa">
        <RoleTabPanel
          role="empresa"
          menuPermissions={menuPermissions.empresa}
          saveLoading={saveLoading}
          isAdmin={false}
          toggleMenuPermission={toggleMenuPermission}
          toggleSubPermission={toggleSubPermission}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PermissionTabs;
