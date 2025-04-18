
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchPendingEmpresas, updateEmpresaStatus } from '@/components/empresa/empresaService';
import { useAdminPermission } from '@/hooks/use-admin-permission';
import { PendenteData } from '../types';
import { EmpresaData } from '@/types/empresa';

export const useAprovacoes = () => {
  const [pendentes, setPendentes] = useState<PendenteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { checkAdminPermission } = useAdminPermission();

  const loadPendingCompanies = async () => {
    if (!checkAdminPermission()) return;
    
    try {
      setIsLoading(true);
      const empresas = await fetchPendingEmpresas();
      
      const mappedData: PendenteData[] = empresas.map((empresa: EmpresaData) => {
        let formattedDate = "Data não disponível";
        try {
          formattedDate = new Date(empresa.created_at).toLocaleDateString('pt-BR');
        } catch (e) {
          console.error("Error formatting date for empresa", empresa.id, e);
        }
        
        return {
          id: empresa.id,
          tipo: 'empresa',
          nome: empresa.nome_fantasia,
          documento: empresa.cnpj,
          dataCadastro: formattedDate,
          email: empresa.email,
          telefone: empresa.telefone
        };
      });
      
      setPendentes(mappedData);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as aprovações pendentes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!checkAdminPermission()) return;
    
    try {
      await updateEmpresaStatus(id, 'ativo');
      setPendentes(pendentes.filter(item => item.id !== id));
      
      toast({
        title: "Aprovado com sucesso!",
        description: "O registro foi aprovado e agora está ativo no sistema.",
      });
    } catch (error) {
      toast({
        title: "Erro na aprovação",
        description: "Ocorreu um erro ao aprovar o registro. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleReject = async (id: string) => {
    if (!checkAdminPermission()) return;
    
    try {
      await updateEmpresaStatus(id, 'inativo');
      setPendentes(pendentes.filter(item => item.id !== id));
      
      toast({
        title: "Rejeitado com sucesso",
        description: "O registro foi rejeitado e removido da lista de pendentes.",
      });
    } catch (error) {
      toast({
        title: "Erro na rejeição",
        description: "Ocorreu um erro ao rejeitar o registro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadPendingCompanies();
  }, []);

  return {
    pendentes,
    isLoading,
    handleApprove,
    handleReject
  };
};
