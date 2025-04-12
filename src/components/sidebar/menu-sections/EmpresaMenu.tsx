
import React from 'react';
import { ClipboardList, Users } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getEmpresaMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Área de Acesso", 
      roles: ['empresa'],
      submenu: [
        { icon: ClipboardList, label: "Área da Empresa", path: "/perfil", roles: ['empresa'] },
        { icon: Users, label: "Pesquisar Associados", path: "/associados/pesquisa", roles: ['empresa'] },
      ]
    }
  ];
};
