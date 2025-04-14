
import { z } from 'zod';

export const systemConfigSchema = z.object({
  showSystemMessages: z.boolean().default(true),
});

export type SystemConfigValues = z.infer<typeof systemConfigSchema>;
