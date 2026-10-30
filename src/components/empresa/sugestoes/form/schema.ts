
import * as z from "zod";

export const sugestaoFormSchema = z.object({
  nome_empresa: z.string().min(3, "Nome da empresa deve ter pelo menos 3 caracteres"),
  cidade: z.string().min(2, "Informe a cidade"),
  estado: z.string().min(2, "Informe o estado").max(2, "Use a sigla do estado (ex: SC)"),
  telefone: z.string().min(10, "Informe um telefone válido"),
  instagram: z.string().optional(),
  site: z.string().optional(),
  contato: z.string().min(3, "Informe o nome do contato"),
  motivo: z.string().min(10, "Por favor descreva o motivo"),
  produtos: z.string().min(5, "Informe os principais produtos"),
});
