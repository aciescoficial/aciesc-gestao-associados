
import { EmpresaData, ImportError } from './types';

export const validateEmpresaData = (data: Record<string, string>[]): {
  processedData: EmpresaData[];
  errors: ImportError[];
} => {
  const processedData: EmpresaData[] = [];
  const errors: ImportError[] = [];

  data.forEach((item, index) => {
    const row = index + 1;
    const empresa: EmpresaData = {
      razao_social: '',
      nome_fantasia: '',
      cnpj: '',
      responsavel: '',
      telefone: '',
      email: '',
      cidade: '',
      nicho: 'outros', // Default value
      status: 'pendente', // Default value
      endereco: '',
      cep: '',
    };

    // Required fields validation
    const requiredFields = [
      'razao_social', 
      'nome_fantasia', 
      'cnpj', 
      'responsavel', 
      'telefone', 
      'email',
      'cidade',
      'endereco',
      'cep',
      'desconto'
    ];
    
    let hasError = false;
    
    // Map CSV data to empresa object
    Object.entries(item).forEach(([key, value]) => {
      const field = key.toLowerCase().replace(/\s/g, '_');
      if (field in empresa) {
        (empresa as any)[field] = value;
      }
    });
    
    // Validate required fields
    requiredFields.forEach(field => {
      if (!empresa[field as keyof EmpresaData]) {
        errors.push({
          row,
          field,
          message: `Campo "${field}" é obrigatório`,
          data: item
        });
        hasError = true;
      }
    });
    
    // Add desconto if missing
    if (!empresa.desconto) {
      empresa.desconto = '0%';
    }
    
    if (!hasError) {
      processedData.push(empresa);
    }
  });

  return { processedData, errors };
};
