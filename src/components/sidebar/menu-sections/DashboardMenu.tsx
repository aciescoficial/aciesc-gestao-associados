
import React from 'react';
import { Home, LogIn } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getDashboardMenuItems = (): MenuItem[] => {
  return [
    { icon: Home, label: "Dashboard", path: "/dashboard", roles: ['admin', 'user', 'empresa'] },
    { icon: LogIn, label: "Login", path: "/login", roles: ['guest'] }
  ];
};
