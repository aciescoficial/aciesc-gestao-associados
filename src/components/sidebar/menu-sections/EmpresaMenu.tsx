
import React from 'react';
import { ClipboardList, Users } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getEmpresaMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Área da Empresa", 
      roles: ['empresa'],
      submenu: [
        { icon: ClipboardList, label: "Atualizar Dados", path: "/perfil", roles: ['empresa'] },
        { icon: Users, label: "Pesquisar Associados", path: "/associados/pesquisa", roles: ['empresa'] },
      ]
    }
  ];
};

