
import { z } from 'zod';

export const formInteresseSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  sobrenome: z.string().min(1, "Sobrenome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  creci: z.string().min(1, "CRECI é obrigatório"),
  email: z.string().email("Email inválido"),
  celular: z.string().min(1, "Telefone é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  motivoInteresse: z.string().min(10, "Por favor, explique brevemente seu interesse"),
  associationTypeId: z.string().min(1, "Selecione o tipo de associação"),
  isCorretor: z.boolean().refine(val => val === true, {
    message: "Você deve confirmar que é corretor para prosseguir"
  }),
  aceitaTermos: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos do regulamento para prosseguir"
  }),
});

export type FormInteresseData = z.infer<typeof formInteresseSchema>;
