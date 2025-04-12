
import { Database } from '@/integrations/supabase/types';

type NichoType = Database['public']['Enums']['nicho_type'];
type StatusType = Database['public']['Enums']['status_type'];

export interface EmpresaData {
  id?: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  cidade: string;
  nicho: NichoType;
  status: StatusType;
  site?: string;
  instagram?: string;
  whatsapp?: string;
  produtos: string;
  endereco: string;
  cep: string;
  latitude?: number;
  longitude?: number;
  desconto: string;
  created_at?: string;
  logo_url?: string;
  capa_url?: string;
  video_url?: string;
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
  data: any;
}
