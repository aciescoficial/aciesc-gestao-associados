import React from 'react';
import { UserManagementRoutes } from './groups/UserManagementRoutes';
import { AssociadoRoutes } from './groups/AssociadoRoutes';
import { EmpresaRoutes } from './groups/EmpresaRoutes';
import { SystemRoutes } from './groups/SystemRoutes';
import { ApprovalRoutes } from './groups/ApprovalRoutes';

// Create empty arrays for routes that may not exist yet
const FinanceiroRoutes = [];
const MensagensRoutes = [];

// Note: We're keeping this for backward compatibility, but the main routes
// are now defined in src/routes/ directory
export const AdminRoutes = [
  ...SystemRoutes,
  ...UserManagementRoutes,
  ...AssociadoRoutes,
  ...EmpresaRoutes,
  ...ApprovalRoutes,
  ...FinanceiroRoutes,
  ...MensagensRoutes
];
