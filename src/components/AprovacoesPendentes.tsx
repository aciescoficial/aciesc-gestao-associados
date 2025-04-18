
import React, { useState, useEffect } from 'react';
import { Check, X, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { fetchPendingEmpresas, updateEmpresaStatus } from '@/components/empresa/empresaService';
import { useAdminPermission } from '@/hooks/use-admin-permission';
import { Database } from '@/integrations/supabase/types';

type NichoType = Database['public']['Enums']['nicho_type'];
type StatusType = Database['public']['Enums']['status_type'];

interface PendenteData {
  id: string;
  tipo: 'empresa';
  nome: string;
  documento: string;
  dataCadastro: string;
  email: string;
  telefone: string;
}

interface EmpresaData {
  id: string;
  nome_fantasia: string;
  cnpj: string;
  created_at: string;
  email: string;
  telefone: string;
  nicho: NichoType;
  status: StatusType;
}

const AprovacoesPendentes: React.FC = () => {
  const [pendentes, setPendentes] = useState<PendenteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const { checkAdminPermission } = useAdminPermission();
  
  useEffect(() => {
    loadPendingCompanies();
  }, []);

  const loadPendingCompanies = async () => {
    if (!checkAdminPermission()) return;
    
    try {
      setIsLoading(true);
      const empresas = await fetchPendingEmpresas();
      
      // Transform to our display format and log to check data
      console.log("Pending empresas fetched:", empresas);
      
      const mappedData: PendenteData[] = empresas.map((empresa: EmpresaData) => ({
        id: empresa.id,
        tipo: 'empresa',
        nome: empresa.nome_fantasia,
        documento: empresa.cnpj,
        dataCadastro: new Date(empresa.created_at).toLocaleDateString('pt-BR'),
        email: empresa.email,
        telefone: empresa.telefone
      }));
      
      console.log("Mapped pending empresas:", mappedData);
      
      setPendentes(mappedData);
    } catch (error) {
      console.error('Error loading pending companies:', error);
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
      
      // Update local state
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
      
      // Update local state
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
  
  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'empresa':
        return <span className="wp-badge bg-purple-100 text-purple-800">Empresa</span>;
      default:
        return <span className="wp-badge">{tipo}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Aprovações Pendentes</h1>
      
      {isLoading ? (
        <div className="wp-card flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : pendentes.length === 0 ? (
        <div className="wp-notice-success">
          <p className="font-medium">Parabéns!</p>
          <p>Não há aprovações pendentes no momento.</p>
        </div>
      ) : (
        <div className="wp-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="wp-subheader mb-0">Cadastros aguardando aprovação</h2>
            <span className="wp-badge bg-yellow-100 text-yellow-800">{pendentes.length} pendentes</span>
          </div>
          
          <div className="wp-notice-warning mb-4 flex items-start">
            <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Importante</p>
              <p className="text-sm">Verifique todos os dados antes de aprovar um cadastro. Uma vez aprovado, o cadastro será ativado no sistema.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="wp-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Data do Cadastro</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pendentes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="h-24 text-center text-muted-foreground">
                      Nenhuma aprovação pendente encontrada.
                    </td>
                  </tr>
                ) : (
                  pendentes.map((item) => (
                    <tr key={item.id}>
                      <td>{getTipoBadge(item.tipo)}</td>
                      <td>{item.nome}</td>
                      <td>{item.documento}</td>
                      <td>{item.dataCadastro}</td>
                      <td>{item.email}</td>
                      <td>{item.telefone}</td>
                      <td>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleApprove(item.id)}
                          >
                            <Check size={14} />
                            Aprovar
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleReject(item.id)}
                          >
                            <X size={14} />
                            Rejeitar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AprovacoesPendentes;
