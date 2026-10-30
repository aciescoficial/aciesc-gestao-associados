import React from 'react';
import AssociadoForm from './associado/AssociadoForm';
import { ImportExportAssociado } from './associado/ImportExportAssociado';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
const CadastroAssociado: React.FC = () => {
  const navigate = useNavigate();
  return <div className="space-y-6 w-full max-w-full">
      <h1 className="wp-header">Cadastrar Associado</h1>

      <div className="wp-card w-full max-w-full">
        <AssociadoForm />

        <div className="mt-8 pt-6 border-t flex flex-col gap-4 py-[56px]">
          {/* Novo botão para Importação de Associados em página */}
          

          {/* Mantém função de exportação/importação antiga se necessário */}
          <ImportExportAssociado />
        </div>
      </div>
    </div>;
};
export default CadastroAssociado;