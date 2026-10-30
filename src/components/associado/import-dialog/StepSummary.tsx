
import React from "react";
import { ImportAssociadoData, ImportValidationData } from "../types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, AlertCircle, CheckSquare } from "lucide-react";

interface StepSummaryProps {
  importData: ImportAssociadoData[];
  criarUsuarios: boolean;
  validationData: ImportValidationData[];
}

const StepSummary: React.FC<StepSummaryProps> = ({ importData, criarUsuarios, validationData }) => {
  // Count valid and ignored fields
  const ignoredFields = validationData.filter(v => v.ignored).map(v => v.fieldName);
  const validFieldsCount = validationData.filter(v => v.isValid && !v.ignored).length;
  const ignoredFieldsCount = ignoredFields.length;
  
  // Check if required fields are present
  const requiredFields = ["nome", "sobrenome", "email", "cpf", "cidade", "celular"];
  const missingRequiredFields = requiredFields.filter(field => 
    validationData.some(v => v.fieldName === field && (v.ignored || !v.isValid))
  );
  
  const hasWarnings = missingRequiredFields.length > 0;
  
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium">Resumo da Importação</h4>
      
      <div className="grid gap-6">
        <div className="bg-muted/20 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-muted-foreground">Total de Registros</h5>
              <p className="text-2xl font-bold">{importData.length}</p>
            </div>
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-muted-foreground">Campos Válidos</h5>
              <p className="text-2xl font-bold">{validFieldsCount}</p>
            </div>
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-muted-foreground">Campos Ignorados</h5>
              <p className="text-2xl font-bold">{ignoredFieldsCount}</p>
            </div>
          </div>
          
          {ignoredFieldsCount > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="font-medium">Campos que serão ignorados:</p>
              <p>{ignoredFields.join(', ')}</p>
            </div>
          )}
        </div>
        
        <div className="bg-muted/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info size={18} />
            <h5 className="font-medium">Configurações de Usuário</h5>
          </div>
          
          <p className="text-sm text-muted-foreground ml-6">
            {criarUsuarios 
              ? "Usuários serão criados automaticamente para cada associado importado. Um email será enviado para definição de senha."
              : "Emails serão enviados com instruções para os associados criarem suas contas."
            }
          </p>
        </div>
        
        {hasWarnings ? (
          <Alert variant="warning" className="border-yellow-500">
            <AlertCircle size={18} className="text-yellow-500" />
            <AlertTitle>Atenção: Campos obrigatórios ausentes</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                Os seguintes campos obrigatórios estão ignorados ou ausentes em alguns registros:
              </p>
              <ul className="list-disc ml-6">
                {missingRequiredFields.map(field => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
              <p className="font-medium">
                Registros sem estes campos poderão falhar durante a importação.
                Recomendamos voltar e verificar estes campos.
              </p>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="success" className="border-green-500 bg-green-50">
            <CheckSquare size={18} className="text-green-500" />
            <AlertTitle>Tudo pronto para importação</AlertTitle>
            <AlertDescription>
              Todos os dados necessários foram validados e estão prontos para serem importados.
              Clique em "Importar" para continuar.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default StepSummary;
