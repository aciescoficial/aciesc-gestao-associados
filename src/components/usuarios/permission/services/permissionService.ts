
import { UserRole } from '../../types';
import { MenuPermission } from '../types';
import { getDefaultMenus } from '../data/defaultMenus';

// Creates a copy of menu permissions with specified enabled state
export const createRoleMenuPermissions = (
  defaultMenus: MenuPermission[],
  enabledMenuIds: string[],
  enabledPermissionIds: string[]
): MenuPermission[] => {
  return defaultMenus.map(menu => ({
    ...menu,
    enabled: enabledMenuIds.includes(menu.id),
    subPermissions: menu.subPermissions.map(perm => ({
      ...perm,
      enabled: enabledPermissionIds.includes(perm.id)
    }))
  }));
};

// Generate default permissions for different roles
export const generateDefaultPermissions = (): Record<UserRole, MenuPermission[]> => {
  const defaultMenus = getDefaultMenus();
  
  // Admin has all permissions
  const adminPermissions = [...defaultMenus];
  
  // User permissions
  const userPermissions = createRoleMenuPermissions(
    defaultMenus,
    ['dashboard', 'area_associado', 'mensagens', 'comunicacao'],
    ['view_dashboard', 'view_messages', 'view_payments', 'update_profile', 'view_companies', 'send_messages']
  );

  // Empresa permissions
  const empresaPermissions = createRoleMenuPermissions(
    defaultMenus,
    ['dashboard', 'area_empresa', 'mensagens', 'comunicacao'],
    ['view_dashboard', 'update_company', 'search_members', 'view_messages', 'send_messages']
  );
  
  // Diretoria permissions
  const diretoriaPermissions = createRoleMenuPermissions(
    defaultMenus,
    ['dashboard', 'associados', 'empresas', 'mensagens', 'comunicacao', 'carteirinhas'],
    [
      'view_dashboard', 'search_associado', 'search_empresa', 
      'view_messages', 'send_messages', 'generate_card', 'request_card'
    ]
  );

  return {
    admin: adminPermissions,
    user: userPermissions,
    empresa: empresaPermissions,
    diretoria: diretoriaPermissions
  };
};

// Log permission changes for future API integration
export const logPermissionChange = (
  role: UserRole, 
  menuId: string, 
  subPermId?: string, 
  enabled?: boolean
): void => {
  if (subPermId) {
    console.log(`${role} ${enabled ? 'agora tem' : 'não tem mais'} permissão ${subPermId}`);
  } else {
    console.log(`${role} ${enabled ? 'agora tem' : 'não tem mais'} acesso ao menu ${menuId}`);
  }
};
