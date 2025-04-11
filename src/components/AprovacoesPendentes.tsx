
import React, { useState } from 'react';
import { Check, X, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PendenteData {
  id: string;
  tipo: 'empresa';
  nome: string;
  documento: string;
  dataCadastro: string;
  email: string;
  telefone: string;
}

const AprovacoesPendentes: React.FC = () => {
  const [pendentes, setPendentes] = useState<PendenteData[]>([
    { id: '2', tipo: 'empresa', nome: 'Academia Fitness', documento: '22.222.222/0001-22', dataCadastro: '02/04/2025', email: 'contato@academiafitness.com.br', telefone: '(47) 3333-3333' },
    { id: '4', tipo: 'empresa', nome: 'Café Expresso', documento: '44.444.444/0001-44', dataCadastro: '31/03/2025', email: 'contato@cafeexpresso.com.br', telefone: '(47) 3333-5555' }
  ]);
  
  const { toast } = useToast();
  
  const handleApprove = async (id: string) => {
    try {
      // Mock API call - would call actual API in real implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
    try {
      // Mock API call - would call actual API in real implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      
      {pendentes.length === 0 ? (
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
                          <button 
                            className="wp-button flex items-center gap-1 text-xs py-1 px-2"
                            onClick={() => handleApprove(item.id)}
                          >
                            <Check size={14} />
                            Aprovar
                          </button>
                          <button 
                            className="wp-button-secondary border-wp-error text-wp-error hover:bg-red-50 flex items-center gap-1 text-xs py-1 px-2"
                            onClick={() => handleReject(item.id)}
                          >
                            <X size={14} />
                            Rejeitar
                          </button>
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
