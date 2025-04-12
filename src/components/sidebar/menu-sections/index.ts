
import { MenuItem } from '../types/MenuItem';
import { getDashboardMenuItems } from './DashboardMenu';
import { getAdminMenuItems } from './AdminMenu';
import { getAssociadosMenuItems } from './AssociadosMenu';
import { getEmpresasMenuItems } from './EmpresasMenu';
import { getFinanceiroMenuItems } from './FinanceiroMenu';
import { getConfiguracoesMenuItems } from './ConfiguracoesMenu';
import { getUserMenuItems } from './UserMenu';
import { getEmpresaMenuItems } from './EmpresaMenu';
import { getComunicacaoMenuItems } from './ComunicacaoMenu';

export const getAllMenuItems = (): MenuItem[] => {
  return [
    // Block 0 - Dashboard
    ...getDashboardMenuItems(),
    
    // Block 2 - Gestão de Usuários
    ...getAdminMenuItems(),
    ...getAssociadosMenuItems(),
    ...getEmpresasMenuItems(),
    ...getComunicacaoMenuItems(),
    
    // Block 3 - Áreas de Acesso
    ...getEmpresaMenuItems(),
    
    // Block 4 - Configurações
    ...getConfiguracoesMenuItems(),
    
    // Block 5 - Usuário
    ...getUserMenuItems(),
    
    // Removed from organization
    ...getFinanceiroMenuItems(),
  ];
};
