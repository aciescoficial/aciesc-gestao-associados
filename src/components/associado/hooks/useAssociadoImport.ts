
import { useToast } from "@/hooks/use-toast";
import { ImportAssociadoData, ImportValidationData } from "../types";
import Papa from "papaparse";

export function useAssociadoImport() {
  const { toast } = useToast();

  const FIELD_AUTO_MAP: Record<string, string> = {
    'Nome Completo': 'nomeCompleto',
    'Foto': 'foto',
    'Nome': 'nome',
    'Sobrenome': 'sobrenome',
    'CPF': 'cpf',
    'CRECI-SC': 'creci',
    'Data Nascimento': 'dataNascimento',
    'Email': 'email',
    'Celular': 'celular',
    'Rua': 'rua',
    'Número': 'numero',
    'Complemento': 'complemento',
    'Bairro': 'bairro',
    'Cidade': 'cidade',
    'Estado': 'estado',
    'CEP': 'cep',
    'Placa Principal': 'placaPrincipal',
    'Placa Secundária': 'placaSecundaria',
    'Valor Pago': 'valorPago',
    'Valor Devido': 'valorDevido',
    'Tipo Pagamento': 'tipoPagamento',
    'Tipo Associado': 'tipoAssociado',
    'Validade': 'validade',
    'Status': 'status'
  };

  const normalizeStatus = (status: string | undefined): string => {
    if (!status) return 'pendente';
    
    const statusLower = status.toLowerCase().trim();
    
    if (statusLower === 'ativo' || statusLower === 'aprovado') {
      return 'aprovado';
    } else if (statusLower === 'inativo' || statusLower === 'rejeitado') {
      return 'rejeitado';
    } else {
      return 'pendente';
    }
  };

  const parseImportFile = async (
    file: File, 
    setImportData: (d: ImportAssociadoData[]) => void,
    setValidationData: (d: ImportValidationData[]) => void
  ) => {
    try {
      const text = await file.text();
      
      let delimiter = ",";
      if (text.includes(";") && text.split(";").length > text.split(",").length) {
        delimiter = ";";
      }
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter,
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("Parse errors:", results.errors);
            
            if (results.errors.length > 5 && delimiter === ",") {
              console.log("Trying with semicolon delimiter instead");
              Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                delimiter: ";",
                transformHeader: (header) => header.trim(),
                complete: handleParseResults,
                error: handleParseError
              });
              return;
            } else {
              toast({
                title: "Avisos ao processar CSV",
                description: `O arquivo foi processado com ${results.errors.length} avisos. Verifique os dados.`,
                variant: "default", // fixed from warning to default
              });
            }
          }
          
          handleParseResults(results);
        },
        error: handleParseError
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Erro ao processar arquivo",
        description: "O arquivo não está em um formato válido.",
        variant: "destructive",
      });
    }
    
    function handleParseError() {
      toast({
        title: "Erro ao processar arquivo",
        description: "Não foi possível ler o arquivo CSV. Verifique o formato.",
        variant: "destructive",
      });
    }
    
    function handleParseResults(results: Papa.ParseResult<any>) {
      const headers = results.meta.fields || [];
      if (!headers.length) {
        toast({
          title: "Arquivo inválido",
          description: "O arquivo não contém colunas ou cabeçalhos válidos.",
          variant: "destructive",
        });
        return;
      }
      
      const getField = (row: any, csvName: string) => {
        const value = row[csvName];
        return value !== undefined ? value : '';
      };

      const mappedData = results.data.map((row: any, idx: number) => {
        try {
          let nomeCompleto = getField(row, 'Nome Completo');
          let nome = getField(row, 'Nome');
          let sobrenome = getField(row, 'Sobrenome');
          
          if (!nome && nomeCompleto) {
            const nameParts = nomeCompleto.trim().split(' ');
            nome = nameParts[0];
            sobrenome = nameParts.slice(1).join(' ');
          }
          
          if (!sobrenome) {
            if (getField(row, 'Sobrenome')) {
              sobrenome = getField(row, 'Sobrenome');
            } else if (nome) {
              sobrenome = "(Sem sobrenome)";
            }
          }
          
          let validade = getField(row, 'Validade');
          if (validade && validade.includes('/')) {
            validade = validade.split('/')[0];
          }

          const status = normalizeStatus(getField(row, 'Status'));

          const importItem: ImportAssociadoData = {
            id: `import-${idx}`,
            nomeCompleto,
            foto: getField(row, 'Foto'),
            nome,
            sobrenome,
            email: getField(row, 'Email'),
            celular: getField(row, 'Celular'),
            creci: getField(row, 'CRECI-SC'),
            cpf: getField(row, 'CPF'),
            rua: getField(row, 'Rua'),
            numero: getField(row, 'Número'),
            complemento: getField(row, 'Complemento'),
            bairro: getField(row, 'Bairro'),
            cidade: getField(row, 'Cidade'),
            estado: getField(row, 'Estado'),
            cep: getField(row, 'CEP'),
            placaPrincipal: getField(row, 'Placa Principal'),
            placaSecundaria: getField(row, 'Placa Secundária'),
            valorPago: getField(row, 'Valor Pago'),
            valorDevido: getField(row, 'Valor Devido'),
            tipoPagamento: getField(row, 'Tipo Pagamento'),
            tipoAssociado: getField(row, 'Tipo Associado'),
            dataNascimento: getField(row, 'Data Nascimento'),
            validade,
            status
          };
          
          return importItem;
        } catch (err) {
          console.error("Error mapping row:", err, row);
          return null;
        }
      }).filter(item => item !== null) as ImportAssociadoData[];
      
      if (mappedData.length === 0) {
        toast({
          title: "Sem dados",
          description: "Não foi possível extrair dados do arquivo. Verifique o formato.",
          variant: "destructive",
        });
        return;
      }
      
      setImportData(mappedData);

      const criticalFields = ["nome", "sobrenome", "email", "cpf", "celular", "cidade"];
      const validationFields: ImportValidationData[] = Object.keys(mappedData[0])
        .filter(field => field !== "id")
        .map(field => {
          const hasAnyValue = mappedData.some(row => 
            row[field] !== undefined && row[field] !== null && row[field] !== ""
          );
          const isCritical = criticalFields.includes(field);
          const isValid = isCritical 
            ? mappedData.every(row => !!row[field])  
            : hasAnyValue;                         
          return {
            fieldName: field,
            targetField: field,
            isValid
          };
        });
        
      setValidationData(validationFields);
      
      const criticalIssues = validationFields
        .filter(v => criticalFields.includes(v.fieldName) && !v.isValid)
        .map(v => v.fieldName);
        
      if (criticalIssues.length > 0) {
        const fields = criticalIssues.map(field => {
          const label = Object.entries(FIELD_AUTO_MAP).find(([_, val]) => val === field)?.[0] || field;
          return label;
        }).join(', ');
        
        toast({
          title: "Campos obrigatórios ausentes",
          description: `Os seguintes campos são obrigatórios e estão faltando: ${fields}`,
          variant: "destructive",
        });
      }
    }
  };

  return { parseImportFile, normalizeStatus };
}
