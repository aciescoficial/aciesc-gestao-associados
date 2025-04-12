
import React from 'react';
import { User, LogOut } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getUserMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Usuário", 
      roles: ['admin', 'user', 'empresa'],
      submenu: [
        { icon: User, label: "Perfil", path: "/perfil-usuario", roles: ['admin', 'user', 'empresa'] },
        { icon: LogOut, label: "Sair", path: "/logout", roles: ['admin', 'user', 'empresa'] },
      ]
    }
  ];
};
