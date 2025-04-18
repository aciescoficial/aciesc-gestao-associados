
import { EmpresaData, NichoType } from '../../types';

export interface EmpresaResponse {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  cidade: string;
  nicho: NichoType;
  status: string;
  endereco: string;
  cep: string;
  logo_url?: string;
  capa_url?: string;
  site?: string;
  instagram?: string;
  whatsapp?: string;
  desconto?: string;
  produtos?: string;
  video_url?: string;
  created_at?: string;
  updated_at?: string;
  latitude?: number;
  longitude?: number;
}

