
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
}
