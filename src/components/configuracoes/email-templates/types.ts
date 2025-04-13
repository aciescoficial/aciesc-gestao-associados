
export interface EmailTemplate {
  id: string;
  nome: string;
  assunto: string;
  corpo: string;
  codigo: string;
}

export const defaultTemplates = [
  {
    nome: 'Aprovação de Interesse',
    assunto: 'Sua solicitação de associação à ACIESC foi aprovada',
    corpo: `Olá {nome},

Temos o prazer de informar que sua solicitação de associação à ACIESC foi aprovada!

Para finalizar seu cadastro, clique no link abaixo para realizar o pagamento:
{link_pagamento}

Após a confirmação do pagamento, você receberá um email para criar sua senha e acessar nossa plataforma.

Atenciosamente,
Equipe ACIESC`,
    codigo: 'aprovacao_interesse'
  },
  {
    nome: 'Confirmação de Pagamento',
    assunto: 'Pagamento confirmado - Finalize seu cadastro na ACIESC',
    corpo: `Olá {nome},

Seu pagamento foi confirmado com sucesso!

Para finalizar seu cadastro e criar sua senha, clique no link abaixo:
{link_cadastro}

Este link é válido por 24 horas.

Atenciosamente,
Equipe ACIESC`,
    codigo: 'confirmacao_pagamento'
  }
];
