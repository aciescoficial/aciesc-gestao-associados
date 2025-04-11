
import { EmpresaData, ImportError } from './types';
import { Database } from '@/integrations/supabase/types';

type NichoType = Database['public']['Enums']['nicho_type'];
type StatusType = Database['public']['Enums']['status_type'];

export const validateEmpresaData = (parsedData: Record<string, string>[]): {
  processedData: EmpresaData[];
  errors: ImportError[];
} => {
  const errors: ImportError[] = [];
  
  // Process and validate the data
  const processedData: EmpresaData[] = parsedData.map((row, index) => {
    const empresa: Partial<EmpresaData> = {};
    
    // Required fields
    empresa.nome_fantasia = row.nome_fantasia || '';
    empresa.razao_social = row.razao_social || '';
    empresa.cnpj = row.cnpj || '';
    empresa.responsavel = row.responsavel || '';
    empresa.telefone = row.telefone || '';
    empresa.email = row.email || '';
    empresa.cidade = row.cidade || '';
    empresa.nicho = (row.nicho as NichoType) || 'Outro';
    empresa.status = (row.status as StatusType) || 'pendente';
    empresa.endereco = row.endereco || '';
    empresa.cep = row.cep || '';
    
    // Optional fields
    if (row.site) empresa.site = row.site;
    if (row.instagram) empresa.instagram = row.instagram;
    if (row.whatsapp) empresa.whatsapp = row.whatsapp;
    if (row.produtos) empresa.produtos = row.produtos;
    if (row.desconto) empresa.desconto = row.desconto;
    if (row.latitude) empresa.latitude = Number(row.latitude);
    if (row.longitude) empresa.longitude = Number(row.longitude);
    if (row.logo_url) empresa.logo_url = row.logo_url;
    if (row.capa_url) empresa.capa_url = row.capa_url;
    if (row.video_url) empresa.video_url = row.video_url;
    
    // Validate required fields
    const requiredFields = [
      { field: 'nome_fantasia', label: 'Nome Fantasia' },
      { field: 'razao_social', label: 'Razão Social' },
      { field: 'cnpj', label: 'CNPJ' },
      { field: 'responsavel', label: 'Responsável' },
      { field: 'telefone', label: 'Telefone' },
      { field: 'email', label: 'Email' },
      { field: 'cidade', label: 'Cidade' },
      { field: 'endereco', label: 'Endereço' },
      { field: 'cep', label: 'CEP' },
      { field: 'nicho', label: 'Nicho' }
    ];
    
    requiredFields.forEach(({field, label}) => {
      if (!empresa[field as keyof EmpresaData]) {
        errors.push({
          row: index,
          field,
          message: `Campo ${label} é obrigatório`,
          data: row
        });
      }
    });
    
    // Validate email format
    if (empresa.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresa.email)) {
      errors.push({
        row: index,
        field: 'email',
        message: 'Email inválido',
        data: row
      });
    }
    
    // Validate CNPJ format
    if (empresa.cnpj && !validateCNPJ(empresa.cnpj)) {
      errors.push({
        row: index,
        field: 'cnpj',
        message: 'CNPJ inválido ou mal formatado',
        data: row
      });
    }
    
    // Validate nicho - must be one of the valid types
    const validNichos: NichoType[] = ['Alimentação', 'Saúde', 'Educação', 'Serviços', 'Comércio', 'Lazer', 'Tecnologia', 'Outro'];
    if (empresa.nicho && !validNichos.includes(empresa.nicho)) {
      errors.push({
        row: index,
        field: 'nicho',
        message: `Nicho inválido. Valores permitidos: ${validNichos.join(', ')}`,
        data: row
      });
    }
    
    return empresa as EmpresaData;
  });
  
  return { processedData, errors };
};

// Helper function to validate CNPJ
export const validateCNPJ = (cnpj: string): boolean => {
  // Remove non-numeric characters
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  // CNPJ must have 14 digits
  if (cnpj.length !== 14) {
    return false;
  }
  
  // Check if all digits are the same (invalid)
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }
  
  // For a complete validation, we would implement the check digits algorithm
  // but for simplicity, we'll just check the format
  return true;
};
