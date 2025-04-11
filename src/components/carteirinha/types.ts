
export interface ConveniadoData {
  id?: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  creci: string;
  validade: string;
  foto?: string;
}

export interface CardSettings {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  fontFamily: string;
  showCPF: boolean;
  showCreci: boolean;
  showQRCode: boolean;
  logoPosition: 'top' | 'bottom';
  photoPosition: {
    x: number;
    y: number;
  };
  textPosition: {
    x: number;
    y: number;
  };
  frontBackgroundImage?: string;
  backBackgroundImage?: string;
  defaultBackImage?: string;
}

export interface CarteirinhaSolicitacao {
  id: string;
  associado_id: string;
  nome: string;
  sobrenome: string;
  endereco_entrega: string;
  complemento?: string;
  valor: number;
  status: string;
  created_at: string;
  updated_at: string;
  pagamento_id?: string;
  codigo_rastreio?: string;
  observacoes?: string;
  email?: string;
}

export type CarteirinhaStatus = 
  | 'pendente_pagamento'
  | 'pagamento_aprovado'
  | 'em_producao'
  | 'enviado'
  | 'entregue'
  | 'cancelado';

// Cores padrão da ACIESC
export const ACIESC_COLORS = {
  primaryGreen: '#00A650', // Verde principal
  darkGreen: '#007A3D',   // Verde escuro
  lightGreen: '#8CC63F',  // Verde claro
  white: '#FFFFFF',       // Branco
  black: '#222222',       // Preto
}
