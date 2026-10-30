
import React from 'react';
import { Users, Shield, CheckSquare } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getAdminMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Gestão de Usuários",
      icon: Users,
      roles: ['admin'],
      submenu: [
        { icon: Users, label: "Usuários", path: "/usuarios", roles: ['admin'] },
        { icon: Shield, label: "Permissões", path: "/usuarios/permissoes", roles: ['admin'] },
        { icon: CheckSquare, label: "Aprovações", path: "/aprovacoes", roles: ['admin'] }
      ]
    }
  ];
};
