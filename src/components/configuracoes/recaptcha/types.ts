
import { z } from 'zod';

export const recaptchaSchema = z.object({
  siteKey: z.string().min(1, 'Chave do site é obrigatória'),
  secretKey: z.string().min(1, 'Chave secreta é obrigatória'),
  enabled: z.boolean().default(true),
  threshold: z.number().min(0).max(1).default(0.5),
  version: z.enum(['v2', 'v3']).default('v2'),
});

export type RecaptchaFormValues = z.infer<typeof recaptchaSchema>;

export interface RecaptchaConfigValues {
  enabled: boolean;
  siteKey: string;
  secretKey: string;
  version: 'v2' | 'v3';
  scoreThreshold: number;
}
