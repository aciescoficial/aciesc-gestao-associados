
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
    ...getDashboardMenuItems(),
    ...getAdminMenuItems(),
    ...getAssociadosMenuItems(),
    ...getEmpresasMenuItems(),
    ...getFinanceiroMenuItems(),
    ...getConfiguracoesMenuItems(),
    ...getUserMenuItems(),
    ...getEmpresaMenuItems(),
    ...getComunicacaoMenuItems(),
  ];
};
