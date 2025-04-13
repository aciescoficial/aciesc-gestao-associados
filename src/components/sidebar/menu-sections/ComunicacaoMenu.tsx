
import React from 'react';
import { MessageCircle, Inbox, SendHorizonal } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

// Memoize menu items to prevent recreation on every render
export const getComunicacaoMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Comunicação", 
      icon: MessageCircle,
      roles: ['admin', 'user', 'empresa'],
      submenu: [
        { icon: Inbox, label: "Caixa de Entrada", path: "/mensagens", roles: ['admin', 'user', 'empresa'] },
        { icon: SendHorizonal, label: "Enviar Mensagem", path: "/mensagens/enviar", roles: ['admin', 'user', 'empresa'] },
      ]
    }
  ];
};

export default React.memo(getComunicacaoMenuItems);
