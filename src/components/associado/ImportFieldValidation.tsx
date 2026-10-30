
import React from "react";
import { Check, AlertCircle, HelpCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImportAssociadoData, ImportValidationData } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

const FIELD_LABELS: Record<string, string> = {
  nomeCompleto: 'Nome Completo',
  foto: 'Foto',
  nome: 'Nome',
  sobrenome: 'Sobrenome',
  cpf: 'CPF',
  creci: 'CRECI-SC',
  dataNascimento: 'Data Nascimento',
  email: 'Email',
  celular: 'Celular',
  rua: 'Rua',
  numero: 'Número',
  complemento: 'Complemento',
  bairro: 'Bairro',
  cidade: 'Cidade',
  estado: 'Estado',
  cep: 'CEP',
  placaPrincipal: 'Placa Principal',
  placaSecundaria: 'Placa Secundária',
  valorPago: 'Valor Pago',
  valorDevido: 'Valor Devido',
  tipoPagamento: 'Tipo Pagamento',
  tipoAssociado: 'Tipo Associado',
  validade: 'Validade',
  status: 'Status'
};

interface ImportFieldValidationProps {
  validationData: ImportValidationData[];
  setValidationData: (data: ImportValidationData[]) => void;
  importData: ImportAssociadoData[];
}

export const ImportFieldValidation: React.FC<ImportFieldValidationProps> = ({
  validationData,
  setValidationData,
  importData
}) => {
  // Helper: get first row value for a campo
  const getExampleValue = (fieldName: string) => {
    if (!importData.length) return "";
    
    // Find first row with non-empty value
    for (const row of importData) {
      const val = row[fieldName];
      if (val !== undefined && val !== null && val !== "") {
        if (typeof val === "string" && val.length > 50) {
          return val.substring(0, 50) + "...";
        }
        return val;
      }
    }
    
    return "";
  };

  const handleIgnoreChange = (idx: number, ignored: boolean) => {
    console.log(`Toggling ignore for field at index ${idx} to ${ignored}`);
    const newValidationData = [...validationData];
    newValidationData[idx] = {
      ...validationData[idx],
      ignored,
      // Make ignored fields valid (overriding invalidity)
      isValid: ignored ? true : validationData[idx].isValid,
    };
    setValidationData(newValidationData);
  };

  return (
    <div className="space-y-4 my-4">
      <h4 className="font-medium">Validação de Campos</h4>
      <ScrollArea className="h-[300px] rounded-md border">
        <div className="w-full p-1 bg-muted/30">
          <div
            className="
              min-w-[700px]
              grid grid-cols-[1.5fr_2fr_2fr_0.7fr]
              gap-2"
          >
            {/* Headers */}
            <div className="font-semibold px-2 py-2 border-b border-gray-200">Campo</div>
            <div className="font-semibold px-2 py-2 border-b border-gray-200">Mapear para</div>
            <div className="font-semibold px-2 py-2 border-b border-gray-200">Pré-visualização</div>
            <div className="font-semibold px-2 py-2 border-b border-gray-200 text-center">Ignorar</div>
            {/* Rows */}
            {validationData.map((validation, idx) => (
              <React.Fragment key={idx}>
                {/* Campo */}
                <div className={`flex items-center gap-2 p-2 rounded-md truncate
                  ${validation.ignored ? "bg-gray-200 text-gray-600 line-through opacity-70" :
                    validation.isValid ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
                  }`}>
                  {validation.isValid && !validation.ignored ? (
                    <Check size={18} className="text-green-500" />
                  ) : validation.ignored ? (
                    <span className="text-gray-400 mr-1">⛔</span>
                  ) : (
                    <AlertCircle size={18} className="text-yellow-500" />
                  )}
                  <span className="font-medium truncate" title={FIELD_LABELS[validation.fieldName] || validation.fieldName}>
                    {FIELD_LABELS[validation.fieldName] || validation.fieldName}
                  </span>
                </div>
                {/* Mapear para */}
                <div className="flex items-center gap-2 bg-white border rounded-md px-2 py-2">
                  <select
                    className="border rounded-md p-1 w-full min-w-[120px]"
                    value={validation.targetField}
                    onChange={(e) => {
                      const newValidationData = [...validationData];
                      newValidationData[idx] = {
                        ...validation,
                        targetField: e.target.value
                      };
                      setValidationData(newValidationData);
                    }}
                    disabled={validation.ignored}
                  >
                    {Object.entries(FIELD_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                {/* Pré-visualização */}
                <div className="flex items-center bg-white border rounded-md px-2 py-2 text-xs min-w-0 break-words">
                  {validation.ignored ? (
                    <span className="text-gray-400 italic">Ignorado</span>
                  ) : getExampleValue(validation.fieldName) ? (
                    <span>{getExampleValue(validation.fieldName)}</span>
                  ) : (
                    <span className="flex items-center text-gray-400 italic">
                      <HelpCircle size={14} className="mr-1" /> Sem valor
                    </span>
                  )}
                </div>
                {/* Ignorar */}
                <div className="flex justify-center items-center">
                  <Checkbox
                    id={`ignore-${idx}`}
                    checked={!!validation.ignored}
                    onCheckedChange={(checked) => handleIgnoreChange(idx, !!checked)}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </ScrollArea>
      <p className="text-xs text-muted-foreground ml-1">
        Você pode ignorar campos não utilizados ou com valores inválidos marcando a opção 'Ignorar'. 
        Campos ignorados não serão incluídos na importação.
      </p>
    </div>
  );
};
