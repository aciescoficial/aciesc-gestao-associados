
export interface Pagamento {
  id: string;
  associado_id: string;
  valor: number;
  data_pagamento: string;
  data_confirmacao?: string;
  status: 'pendente' | 'pago' | 'cancelado';
  metodo?: string;
  origem: string;
  origem_id?: string;
  descricao?: string;
  comprovante_url?: string;
  ano_referencia: number;
  created_at?: string;
  updated_at?: string;
  associado?: {
    id: string;
    nome?: string;
    sobrenome?: string;
    email?: string;
    cpf?: string;
  };
}

export interface SituacaoPagamento {
  emDia: boolean;
  ultimoPagamento?: Pagamento;
  proximoVencimento?: string;
  diasRestantes?: number;
}
