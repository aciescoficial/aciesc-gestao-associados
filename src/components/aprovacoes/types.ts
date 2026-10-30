
export interface PendenteData {
  id: string;
  tipo: 'empresa' | 'associado' | string;
  nome: string;
  documento: string;
  dataCadastro: string;
  email: string;
  telefone: string;
  status?: 'pendente' | 'ativo' | 'inativo' | 'aprovado';
}
