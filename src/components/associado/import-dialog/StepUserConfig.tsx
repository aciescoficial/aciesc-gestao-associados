
import React from "react";
import { ImportCreateUsersOption } from "../ImportCreateUsersOption";

interface StepUserConfigProps {
  criarUsuarios: boolean;
  setCriarUsuarios: (val: boolean) => void;
}

const StepUserConfig: React.FC<StepUserConfigProps> = ({
  criarUsuarios,
  setCriarUsuarios,
}) => (
  <div>
    <ImportCreateUsersOption
      criarUsuarios={criarUsuarios}
      setCriarUsuarios={setCriarUsuarios}
    />
    <div className="mt-6 bg-muted/30 rounded-md p-4">
      <h3 className="text-lg font-medium">Configuração de Usuários</h3>
      <p className="text-sm text-muted-foreground mt-2">
        {criarUsuarios ? (
          <>
            <strong className="text-green-600">Usuários serão criados automaticamente</strong> para os 
            associados importados. Um email para definição de senha será enviado para cada um deles.
          </>
        ) : (
          <>
            <strong>Usuários NÃO serão criados automaticamente</strong>. Os associados importados 
            precisarão se cadastrar manualmente no sistema.
          </>
        )}
      </p>
    </div>
  </div>
);

export default StepUserConfig;
