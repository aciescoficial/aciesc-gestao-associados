
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { usePermissionData } from './hooks/usePermissionData';
import PermissionTabs from './PermissionTabs';

const PermissionPanel: React.FC = () => {
  const {
    menuPermissions,
    loading,
    saveLoading,
    fetchPermissions,
    toggleMenuPermission,
    toggleSubPermission
  } = usePermissionData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Gerenciamento de Permissões</h1>
        <Button onClick={fetchPermissions} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Atualizar"
          )}
        </Button>
      </div>
      
      <div className="wp-card">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Carregando permissões...</span>
          </div>
        ) : (
          <PermissionTabs
            menuPermissions={menuPermissions}
            saveLoading={saveLoading}
            toggleMenuPermission={toggleMenuPermission}
            toggleSubPermission={toggleSubPermission}
          />
        )}
      </div>
    </div>
  );
};

export default PermissionPanel;
