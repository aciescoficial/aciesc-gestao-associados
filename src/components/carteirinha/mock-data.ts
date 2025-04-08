
import { ConveniadoData } from './types';

// Mock data - would be fetched from API in real implementation
export const mockData: ConveniadoData[] = [
  { 
    id: '1', 
    nome: 'João', 
    sobrenome: 'Silva', 
    cpf: '123.456.789-00', 
    creci: '12345', 
    validade: '01/2026',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  { 
    id: '2', 
    nome: 'Maria', 
    sobrenome: 'Oliveira', 
    cpf: '987.654.321-00', 
    creci: '54321', 
    validade: '01/2026',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  { 
    id: '3', 
    nome: 'Pedro', 
    sobrenome: 'Santos', 
    cpf: '456.789.123-00', 
    creci: '67890', 
    validade: '01/2026',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
];
