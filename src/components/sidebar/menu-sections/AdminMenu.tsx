
import React from 'react';
import { Users } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getAdminMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Gestão de Usuários", 
      roles: ['admin'],
      submenu: [
        { icon: Users, label: "Usuários", path: "/usuarios", roles: ['admin'] },
      ]
    }
  ];
};
