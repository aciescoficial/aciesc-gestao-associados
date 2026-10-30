
import * as z from "zod";

// Define the schema for message form validation
export const mensagemSchema = z.object({
  tipoEnvio: z.enum(["email", "sistema"]),
  destinatario: z.enum(["usuario", "grupo"]),
  emailDestinatario: z.string().email("Email inválido").optional().or(z.literal("")),
  grupoDestinatarios: z.string().optional(),
  userTag: z.string().optional(),
  selectedUsers: z.array(z.string()).optional(),
  assunto: z.string().min(3, "Assunto deve ter pelo menos 3 caracteres"),
  mensagem: z.string().min(5, "Mensagem deve ter pelo menos 5 caracteres"),
  enviarCopia: z.boolean().default(false),
});

// Export the type for use in components
export type MensagemFormValues = z.infer<typeof mensagemSchema>;
