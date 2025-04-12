
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getComunicacaoMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Comunicação", 
      roles: ['admin', 'user', 'empresa'],
      submenu: [
        { icon: MessageSquare, label: "Mensagens", path: "/mensagens", roles: ['admin', 'user', 'empresa'] },
      ]
    }
  ];
};
