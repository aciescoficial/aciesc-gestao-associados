
import React from 'react';
import { Settings, Shield } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getConfiguracoesMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Configurações", 
      icon: Settings,
      roles: ['admin'],
      submenu: [
        { icon: Settings, label: "Configurações", path: "/configuracoes", roles: ['admin'] },
        { icon: Shield, label: "Administração", path: "/configuracoes?tab=admin", roles: ['admin'] },
      ]
    }
  ];
};
