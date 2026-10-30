
export interface AssociadoInteresse {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  creci: string;
  email: string;
  celular: string;
  cidade: string;
  estado: string;
  motivo_interesse: string;
  pagamento_confirmado: boolean;
  pagamento_url?: string | null;
  status?: 'pendente' | 'aprovado' | 'rejeitado';
  rejeitado_em?: string | null;
  aprovado_em?: string | null;
  motivo_rejeicao?: string | null;
  payment_proof_url?: string | null;
  associationTypeId?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AprovacaoResult {
  success: boolean;
  message: string;
  paymentUrl?: string;
}

export interface RejeicaoResult {
  success: boolean;
  message: string;
}
