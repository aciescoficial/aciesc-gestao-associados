
import { supabase } from '@/integrations/supabase/client';

interface SendTestEmailParams {
  to: string;
  template_id?: string;
  test_data?: Record<string, any>;
}

export async function sendTestEmail({ to, template_id, test_data }: SendTestEmailParams): Promise<void> {
  const { error } = await supabase.functions.invoke('send-test-email', {
    body: { to, template_id, test_data },
  });

  if (error) {
    throw new Error(`Failed to send test email: ${error.message}`);
  }
}

export function getTemplateTestData(templateCode: string): Record<string, string> {
  // Return sample data based on template type
  switch (templateCode) {
    case 'aprovacao_interesse':
      return {
        nome: 'João da Silva',
        email: 'joao@example.com',
        link_pagamento: 'https://example.com/pagamento/abc123'
      };
    case 'confirmacao_pagamento':
      return {
        nome: 'Maria Santos',
        email: 'maria@example.com',
        link_cadastro: 'https://example.com/cadastro/xyz789'
      };
    default:
      return {
        nome: 'Usuário Teste',
        email: 'teste@example.com'
      };
  }
}
