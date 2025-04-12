
import { z } from 'zod';

// Define allowed values for nicho with proper string literals
export const nichoOptions = [
  'Alimentação',
  'Saúde',
  'Educação',
  'Serviços',
  'Comércio',
  'Lazer',
  'Tecnologia',
  'Outro'
] as const;

// Define schema for empresa data
export const empresaSchema = z.object({
  razaoSocial: z.string().min(1, 'Razão Social é obrigatória'),
  nomeFantasia: z.string().min(1, 'Nome Fantasia é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  cep: z.string().regex(/^\d{5}-\d{3}$|^\d{8}$/, 'CEP inválido'),
  nicho: z.enum(nichoOptions),
  desconto: z.string().min(1, 'Desconto é obrigatório'),
  produtos: z.string().min(1, 'Produtos são obrigatórios'),
  site: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
});

export interface EmpresaData {
  id?: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  cep: string;
  nicho: typeof nichoOptions[number];
  desconto: string;
  produtos: string;
  site?: string;
  instagram?: string;
  whatsapp?: string;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

export const validateEmpresaData = (data: Record<string, string>[]): { processedData: EmpresaData[], errors: ImportError[] } => {
  const processedData: EmpresaData[] = [];
  const errors: ImportError[] = [];

  data.forEach((item, index) => {
    try {
      // Transform field names to match our schema
      const transformedData = {
        razaoSocial: item.razao_social || '',
        nomeFantasia: item.nome_fantasia || '',
        cnpj: item.cnpj || '',
        responsavel: item.responsavel || '',
        telefone: item.telefone || '',
        email: item.email || '',
        endereco: item.endereco || '',
        cidade: item.cidade || '',
        cep: item.cep || '',
        nicho: item.nicho || 'Outro',
        desconto: item.desconto || '',
        produtos: item.produtos || '',
        site: item.site || undefined,
        instagram: item.instagram || undefined,
        whatsapp: item.whatsapp || undefined,
      };

      // Validate the data
      const result = empresaSchema.safeParse(transformedData);
      
      if (result.success) {
        processedData.push(result.data);
      } else {
        result.error.issues.forEach(issue => {
          errors.push({
            row: index + 1,
            field: issue.path.join('.'),
            message: issue.message
          });
        });
      }
    } catch (error) {
      errors.push({
        row: index + 1,
        field: 'general',
        message: 'Erro ao processar linha'
      });
    }
  });

  return { processedData, errors };
};
