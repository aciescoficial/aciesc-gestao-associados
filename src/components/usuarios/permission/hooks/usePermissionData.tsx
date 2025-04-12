
import { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { MenuPermission, SaveLoadingState } from '../types';
import { useToast } from '@/hooks/use-toast';
import { generateDefaultPermissions, logPermissionChange } from '../services/permissionService';

export const usePermissionData = () => {
  const [menuPermissions, setMenuPermissions] = useState<Record<UserRole, MenuPermission[]>>({
    admin: [],
    user: [],
    empresa: [],
    diretoria: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [saveLoading, setSaveLoading] = useState<SaveLoadingState>({});

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      // In a real app, this would come from an API
      // For now, we use the default permissions
      setMenuPermissions(generateDefaultPermissions());
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
      toast({
        title: "Erro ao carregar permissões",
        description: "Não foi possível carregar as permissões.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const toggleMenuPermission = async (role: UserRole, menuId: string, enabled: boolean) => {
    const permKey = `${role}-${menuId}`;
    setSaveLoading(prev => ({ ...prev, [permKey]: true }));
    
    try {
      logPermissionChange(role, menuId, undefined, enabled);
      
      setMenuPermissions(prev => ({
        ...prev,
        [role]: prev[role].map(menu => {
          if (menu.id === menuId) {
            const updatedSubPermissions = !enabled 
              ? menu.subPermissions.map(subPerm => ({ ...subPerm, enabled: false }))
              : menu.subPermissions;
              
            return { 
              ...menu, 
              enabled, 
              subPermissions: updatedSubPermissions 
            };
          }
          return menu;
        })
      }));
      
      toast({
        title: "Permissão atualizada",
        description: `${role} ${enabled ? 'agora tem' : 'não tem mais'} acesso ao menu ${menuId}`,
      });
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error);
      toast({
        title: "Erro ao atualizar permissão",
        description: "Não foi possível salvar a alteração.",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(prev => ({ ...prev, [permKey]: false }));
    }
  };

  const toggleSubPermission = async (role: UserRole, menuId: string, subPermId: string, enabled: boolean) => {
    const permKey = `${role}-${menuId}-${subPermId}`;
    setSaveLoading(prev => ({ ...prev, [permKey]: true }));
    
    try {
      logPermissionChange(role, menuId, subPermId, enabled);
      
      setMenuPermissions(prev => ({
        ...prev,
        [role]: prev[role].map(menu => {
          if (menu.id === menuId) {
            const menuEnabled = enabled ? true : menu.enabled;
            
            return { 
              ...menu, 
              enabled: menuEnabled,
              subPermissions: menu.subPermissions.map(subPerm => {
                if (subPerm.id === subPermId) {
                  return { ...subPerm, enabled };
                }
                return subPerm;
              }) 
            };
          }
          return menu;
        })
      }));
      
      toast({
        title: "Permissão atualizada",
        description: `${role} ${enabled ? 'agora tem' : 'não tem mais'} permissão para ${subPermId}`,
      });
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error);
      toast({
        title: "Erro ao atualizar permissão",
        description: "Não foi possível salvar a alteração.",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(prev => ({ ...prev, [permKey]: false }));
    }
  };

  return {
    menuPermissions,
    loading,
    saveLoading,
    fetchPermissions,
    toggleMenuPermission,
    toggleSubPermission
  };
};
