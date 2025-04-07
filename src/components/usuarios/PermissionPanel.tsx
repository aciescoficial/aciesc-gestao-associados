
import React, { useState } from 'react';
import { Check, Info } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Permission, UserRole } from './types';
import { toast } from 'sonner';

const PermissionPanel: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: '1',
      name: 'Ver Conveniados',
      description: 'Permite visualizar a lista de conveniados',
      module: 'conveniados',
      defaultRoles: ['admin', 'normal']
    },
    {
      id: '2',
      name: 'Adicionar Conveniados',
      description: 'Permite adicionar novos conveniados ao sistema',
      module: 'conveniados',
      defaultRoles: ['admin']
    },
    {
      id: '3',
      name: 'Editar Conveniados',
      description: 'Permite editar informações de conveniados existentes',
      module: 'conveniados',
      defaultRoles: ['admin']
    },
    {
      id: '4',
      name: 'Aprovar Conveniados',
      description: 'Permite aprovar conveniados pendentes',
      module: 'conveniados',
      defaultRoles: ['admin']
    },
    {
      id: '5',
      name: 'Ver Empresas',
      description: 'Permite visualizar a lista de empresas',
      module: 'empresas',
      defaultRoles: ['admin', 'normal', 'conveniado']
    },
    {
      id: '6',
      name: 'Adicionar Empresas',
      description: 'Permite adicionar novas empresas ao sistema',
      module: 'empresas',
      defaultRoles: ['admin']
    },
    {
      id: '7',
      name: 'Editar Empresas',
      description: 'Permite editar informações de empresas existentes',
      module: 'empresas',
      defaultRoles: ['admin']
    },
    {
      id: '8',
      name: 'Aprovar Empresas',
      description: 'Permite aprovar empresas pendentes',
      module: 'empresas',
      defaultRoles: ['admin']
    },
    {
      id: '9',
      name: 'Ver Financeiro',
      description: 'Permite acessar o módulo financeiro',
      module: 'financeiro',
      defaultRoles: ['admin']
    },
    {
      id: '10',
      name: 'Gerar Relatórios',
      description: 'Permite gerar relatórios financeiros',
      module: 'financeiro',
      defaultRoles: ['admin']
    },
    {
      id: '11',
      name: 'Configurações',
      description: 'Permite acessar as configurações do sistema',
      module: 'configuracoes',
      defaultRoles: ['admin']
    }
  ]);

  const roles: UserRole[] = ['admin', 'normal', 'conveniado'];
  
  const roleLabels = {
    admin: 'Administrador',
    normal: 'Normal',
    conveniado: 'Conveniado'
  };

  const moduleLabels = {
    conveniados: 'Conveniados',
    empresas: 'Empresas',
    financeiro: 'Financeiro',
    configuracoes: 'Configurações'
  };

  const togglePermission = (permissionId: string, role: UserRole) => {
    setPermissions(permissions.map(permission => {
      if (permission.id !== permissionId) return permission;
      
      const newDefaultRoles = permission.defaultRoles.includes(role)
        ? permission.defaultRoles.filter(r => r !== role)
        : [...permission.defaultRoles, role];
        
      return {
        ...permission,
        defaultRoles: newDefaultRoles
      };
    }));
    
    const permission = permissions.find(p => p.id === permissionId);
    if (permission) {
      const action = permission.defaultRoles.includes(role) ? 'removida de' : 'adicionada para';
      toast.success(`Permissão ${permission.name} ${action} ${roleLabels[role]}`);
    }
  };

  const getGroupedPermissions = () => {
    const grouped: Record<string, Permission[]> = {};
    
    permissions.forEach(permission => {
      if (!grouped[permission.module]) {
        grouped[permission.module] = [];
      }
      grouped[permission.module].push(permission);
    });
    
    return grouped;
  };

  const groupedPermissions = getGroupedPermissions();

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Painel de Permissões</h1>
      
      <div className="wp-card">
        <p className="text-sm text-gray-500 mb-4">
          Configure quais tipos de usuários têm acesso às funcionalidades do sistema.
          Marque as caixas para conceder permissões.
        </p>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Permissão</TableHead>
              {roles.map(role => (
                <TableHead key={role} className="text-center">
                  {roleLabels[role]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
              <React.Fragment key={module}>
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={roles.length + 1} className="font-medium">
                    {moduleLabels[module as keyof typeof moduleLabels]}
                  </TableCell>
                </TableRow>
                {modulePermissions.map(permission => (
                  <TableRow key={permission.id}>
                    <TableCell className="flex items-center gap-2">
                      {permission.name}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">
                              <Info size={14} className="text-gray-400" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{permission.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    {roles.map(role => (
                      <TableCell key={role} className="text-center">
                        <div 
                          className={`mx-auto w-6 h-6 flex items-center justify-center rounded border cursor-pointer ${
                            permission.defaultRoles.includes(role)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-300'
                          }`}
                          onClick={() => togglePermission(permission.id, role)}
                        >
                          {permission.defaultRoles.includes(role) && (
                            <Check size={16} className="text-green-500" />
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded p-4 text-sm">
          <p className="font-medium text-yellow-800">Atenção</p>
          <p className="text-yellow-700">
            As permissões são armazenadas localmente. Em um sistema de produção, 
            essas configurações seriam persistidas em um banco de dados e aplicadas 
            automaticamente ao sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PermissionPanel;
