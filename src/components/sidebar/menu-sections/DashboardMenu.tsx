
import React from 'react';
import { Home } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getDashboardMenuItems = (): MenuItem[] => {
  return [
    { icon: Home, label: "Dashboard", path: "/dashboard", roles: ['admin', 'user', 'empresa'] }
  ];
};
