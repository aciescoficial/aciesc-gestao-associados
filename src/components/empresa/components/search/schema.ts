
import * as z from 'zod';

export const companySearchSchema = z.object({
  searchTerm: z.string().optional(),
  searchType: z.enum(['nome', 'cnpj', 'nicho']).default('nome'),
  status: z.enum(['ativo', 'inativo', 'todos']).default('todos')
});

export type CompanySearchFormValues = z.infer<typeof companySearchSchema>;
