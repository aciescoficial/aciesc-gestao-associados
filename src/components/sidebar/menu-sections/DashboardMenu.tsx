
import React from 'react';
import { LayoutDashboard, MessageSquare } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getDashboardMenuItems = (): MenuItem[] => {
  return [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", roles: ['admin', 'user', 'empresa'] },
    { icon: MessageSquare, label: "Mensagens", path: "/mensagens", roles: ['admin', 'user', 'empresa'] }
  ];
};
