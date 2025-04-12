
import React from 'react';
import { Button } from '@/components/ui/button';
import MenuPermissionItem from './MenuPermissionItem';
import { UserRole } from '../../types';
import { MenuPermission, SaveLoadingState } from '../types';

interface RoleTabPanelProps {
  role: UserRole;
  menuPermissions: MenuPermission[];
  saveLoading: SaveLoadingState;
  isAdmin: boolean;
  toggleMenuPermission: (role: UserRole, menuId: string, enabled: boolean) => void;
  toggleSubPermission: (role: UserRole, menuId: string, subPermId: string, enabled: boolean) => void;
}

const RoleTabPanel: React.FC<RoleTabPanelProps> = ({ 
  role, 
  menuPermissions, 
  saveLoading, 
  isAdmin,
  toggleMenuPermission, 
  toggleSubPermission 
}) => {
  return (
    <div>
      {isAdmin && (
        <div className="p-4 rounded-md bg-muted/50 mb-4">
          <p className="text-muted-foreground">Administradores têm acesso total ao sistema. Essas permissões não podem ser modificadas.</p>
        </div>
      )}
      <div className="space-y-1">
        {menuPermissions.map((menu) => (
          <MenuPermissionItem
            key={`${role}-${menu.id}`}
            role={role}
            menu={menu}
            saveLoading={saveLoading}
            toggleMenuPermission={toggleMenuPermission}
            toggleSubPermission={toggleSubPermission}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar</Button>
      </div>
    </div>
  );
};

export default RoleTabPanel;
