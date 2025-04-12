
import React from 'react';
import { MessageCircle, MessageSquare } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

// Memoize menu items to prevent recreation on every render
export const getComunicacaoMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Comunicação", 
      icon: MessageCircle,
      roles: ['admin', 'user', 'empresa'],
      submenu: [
        { icon: MessageSquare, label: "Mensagens", path: "/mensagens/enviar", roles: ['admin', 'user', 'empresa'] },
      ]
    }
  ];
};
