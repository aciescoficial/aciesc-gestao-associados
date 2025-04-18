
import { empresaStatusService } from '@/components/empresa/services/empresaService';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useState } from 'react';
import { PendenteData } from '../types';

export const useAprovacoes = () => {
  const [pendentes, setPendentes] = useState<PendenteData[]>([]);
  const { isLoading, withLoading } = useLoadingState();

  const fetchPendentes = async () => {
    const empresasPendentes = await empresaStatusService.fetchPendingEmpresas();
    
    const formattedPendentes: PendenteData[] = empresasPendentes.map(empresa => ({
      id: empresa.id,
      tipo: 'empresa',
      nome: empresa.nome_fantasia,
      documento: empresa.cnpj,
      dataCadastro: empresa.created_at,
      email: empresa.email,
      telefone: empresa.telefone
    }));

    setPendentes(formattedPendentes);
  };

  const handleApprove = async (id: string) => {
    await withLoading(async () => {
      await empresaStatusService.updateEmpresaStatus(id, 'ativo');
      await fetchPendentes();
    }, "Erro ao aprovar cadastro");
  };

  const handleReject = async (id: string) => {
    await withLoading(async () => {
      await empresaStatusService.updateEmpresaStatus(id, 'inativo');
      await fetchPendentes();
    }, "Erro ao rejeitar cadastro");
  };

  return {
    pendentes,
    isLoading,
    handleApprove,
    handleReject,
  };
};
