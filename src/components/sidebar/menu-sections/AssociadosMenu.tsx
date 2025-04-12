
import React from 'react';
import { FileCheck, UserPlus, Search, CreditCard } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getAssociadosMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Associados", 
      roles: ['admin'],
      submenu: [
        { icon: FileCheck, label: "Aprovar Interessados", path: "/associados/aprovacao", roles: ['admin'] },
        { icon: UserPlus, label: "Cadastrar", path: "/associados/cadastro", roles: ['admin'] },
        { icon: Search, label: "Pesquisar", path: "/associados/pesquisa", roles: ['admin', 'user'] },
        { icon: CreditCard, label: "Gerar Carteirinha", path: "/carteirinhas", roles: ['admin'] },
      ]
    }
  ];
};
