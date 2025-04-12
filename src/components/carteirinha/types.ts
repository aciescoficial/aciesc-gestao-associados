
export interface CarteirinhaSolicitacao {
  id: string;
  associado_id: string;
  nome: string;
  sobrenome: string;
  endereco_entrega: string;
  complemento?: string;
  valor: number;
  status: string;
  pagamento_id?: string;
  email?: string;
  created_at: string;
  updated_at: string;
  codigo_rastreio?: string;
  observacoes?: string;
  tipo_entrega?: 'entrega' | 'retirada_grafica' | 'retirada_aciesc';
}
