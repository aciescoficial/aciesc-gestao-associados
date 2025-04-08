
export interface ConveniadoData {
  id: string;
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
  showCPF: boolean;
  showCreci: boolean;
  showQRCode: boolean;
  logoPosition: 'top' | 'bottom';
}
