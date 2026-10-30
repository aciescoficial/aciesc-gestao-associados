import { SugestaoEmpresa } from './types';

export const mockSugestoes: SugestaoEmpresa[] = [
  {
    id: '1',
    nome_empresa: 'Empresa A',
    cidade: 'São Paulo',
    estado: 'SP',
    telefone: '11999999999',
    contato: 'João Silva',
    motivo: 'Interesse em parceria',
    produtos: 'Produtos A',
    status: 'novo',
    created_at: '2024-04-19T10:00:00Z'
  },
  {
    id: '2',
    nome_empresa: 'Empresa B',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    telefone: '21999999999',
    contato: 'Maria Souza',
    motivo: 'Possível convênio',
    produtos: 'Produtos B',
    status: 'em_progresso',
    created_at: '2024-04-18T14:30:00Z'
  },
  {
    id: '3',
    nome_empresa: 'Empresa C',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    telefone: '31999999999',
    contato: 'Carlos Ferreira',
    motivo: 'Solicitação de parceria',
    produtos: 'Produtos C',
    status: 'ganho',
    created_at: '2024-04-17T09:15:00Z'
  },
  {
    id: '4',
    nome_empresa: 'Empresa D',
    cidade: 'Porto Alegre',
    estado: 'RS',
    telefone: '51999999999',
    contato: 'Ana Pereira',
    motivo: 'Convite para convênio',
    produtos: 'Produtos D',
    status: 'cancelado',
    created_at: '2024-04-16T16:45:00Z'
  },
  {
    id: '5',
    nome_empresa: 'Empresa E',
    cidade: 'Curitiba',
    estado: 'PR',
    telefone: '41999999999',
    contato: 'Paulo Santos',
    motivo: 'Proposta de parceria',
    produtos: 'Produtos E',
    status: 'frio',
    created_at: '2024-04-15T11:20:00Z'
  },
];
