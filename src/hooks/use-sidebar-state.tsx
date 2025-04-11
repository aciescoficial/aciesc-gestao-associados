
import { useState, useEffect, useCallback } from 'react';

const SIDEBAR_STATE_KEY = 'aciesc-sidebar-state';
const SIDEBAR_MENUS_KEY = 'aciesc-sidebar-menus';

type SidebarState = {
  collapsed: boolean;
  expandedMenus: Record<string, boolean>;
};

export function useSidebarState() {
  // Inicializa com valores padrão ou carrega do localStorage
  const [sidebarState, setSidebarState] = useState<SidebarState>(() => {
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    const savedMenus = localStorage.getItem(SIDEBAR_MENUS_KEY);
    
    return {
      collapsed: savedState ? JSON.parse(savedState) : false,
      expandedMenus: savedMenus ? JSON.parse(savedMenus) : {},
    };
  });

  // Toggle do estado do sidebar (colapsado / expandido)
  const toggleSidebar = useCallback(() => {
    setSidebarState(prev => ({
      ...prev,
      collapsed: !prev.collapsed,
    }));
  }, []);

  // Toggle de um menu específico (expandir / retrair)
  const toggleMenu = useCallback((menuId: string) => {
    setSidebarState(prev => ({
      ...prev,
      expandedMenus: {
        ...prev.expandedMenus,
        [menuId]: !prev.expandedMenus[menuId]
      }
    }));
  }, []);

  // Verifica se um menu está expandido
  const isMenuExpanded = useCallback((menuId: string) => {
    // Se não existir na configuração, considera como expandido por padrão
    return sidebarState.expandedMenus[menuId] !== false;
  }, [sidebarState.expandedMenus]);

  // Salva o estado no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(sidebarState.collapsed));
    localStorage.setItem(SIDEBAR_MENUS_KEY, JSON.stringify(sidebarState.expandedMenus));
  }, [sidebarState]);

  return {
    collapsed: sidebarState.collapsed,
    toggleSidebar,
    toggleMenu,
    isMenuExpanded
  };
}
