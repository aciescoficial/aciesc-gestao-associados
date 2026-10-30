export interface SugestaoEmpresa {
  id: string;
  nome_empresa: string;
  cidade: string;
  estado: string;
  telefone: string;
  instagram?: string;
  site?: string;
  contato: string;
  motivo: string;
  produtos: string;
  status: string;
  created_at: string;
}

export type SugestaoStatus = 'novo' | 'em_progresso' | 'ganho' | 'cancelado' | 'frio';
