
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { AssociadoTabContent } from './tabs/AssociadoTabContent';
import { EmpresaTabContent } from './tabs/EmpresaTabContent';
import { DiretoriaTabContent } from './tabs/DiretoriaTabContent';

interface UserLinkTabsProps {
  isDiretoria: boolean;
  associadoId: string | undefined;
  empresaId: string | undefined;
  associados: Array<{id: string, cpf: string, nome: string, sobrenome: string}>;
  empresas: Array<{id: string, cnpj: string, nome_fantasia: string}>;
  loadingAssociados: boolean;
  loadingEmpresas: boolean;
  onDiretoriaSelect: (isDiretoria: boolean) => void;
  onAssociadoSelect: (associadoId: string) => void;
  onEmpresaSelect: (empresaId: string) => void;
}

export const UserLinkTabs: React.FC<UserLinkTabsProps> = ({
  isDiretoria,
  associadoId,
  empresaId,
  associados,
  empresas,
  loadingAssociados,
  loadingEmpresas,
  onDiretoriaSelect,
  onAssociadoSelect,
  onEmpresaSelect
}) => {
  // Determine the default tab based on user data
  const getDefaultTab = () => {
    if (isDiretoria) return "diretoria";
    if (associadoId) return "associado";
    if (empresaId) return "empresa";
    return "associado"; // Default
  };

  const [activeTab, setActiveTab] = React.useState(getDefaultTab());
  
  // Atualiza a aba quando os dados do usuário mudam
  useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [isDiretoria, associadoId, empresaId]);

  // Quando mudar a aba, atualiza o status de diretoria
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onDiretoriaSelect(value === "diretoria");
  };
  
  return (
    <div className="space-y-2 border-t pt-4">
      <Label>Vínculo do Usuário</Label>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="associado"
            disabled={isDiretoria}
          >
            Associado
          </TabsTrigger>
          <TabsTrigger 
            value="empresa"
            disabled={isDiretoria}
          >
            Empresa
          </TabsTrigger>
          <TabsTrigger 
            value="diretoria"
          >
            Diretoria
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="associado" className="space-y-4 mt-4">
          <AssociadoTabContent
            associadoId={associadoId}
            associados={associados}
            loadingAssociados={loadingAssociados}
            onAssociadoSelect={onAssociadoSelect}
            disabled={isDiretoria}
          />
        </TabsContent>
        
        <TabsContent value="empresa" className="space-y-4 mt-4">
          <EmpresaTabContent
            empresaId={empresaId}
            empresas={empresas}
            loadingEmpresas={loadingEmpresas}
            onEmpresaSelect={onEmpresaSelect}
            disabled={isDiretoria}
          />
        </TabsContent>
        
        <TabsContent value="diretoria" className="space-y-4 mt-4">
          <DiretoriaTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

