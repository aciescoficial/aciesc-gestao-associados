
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAprovacaoInteresse } from './hooks/useAprovacaoInteresse';
import InteresseDesktopTable from './components/InteresseDesktopTable';
import InteresseMobileCard from './components/InteresseMobileCard';
import AprovacaoAlertas from './components/AprovacaoAlertas';

const AprovacaoInteresse: React.FC = () => {
  const { 
    interesses,
    isLoading, 
    isAdmin, 
    fetchPendingInterests, 
    handleApprove, 
    handleReject 
  } = useAprovacaoInteresse();
  const isMobile = useIsMobile();

  if (!isAdmin) {
    return (
      <div className="text-center p-6">
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Solicitações de Interesse</h2>
        <Button onClick={fetchPendingInterests} variant="outline" size="sm" disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Atualizar'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : interesses.length === 0 ? (
        <Alert>
          <AlertTitle>Nenhum interesse pendente</AlertTitle>
          <AlertDescription>
            Não há novos interesses de associação para avaliar no momento.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <AprovacaoAlertas />
          
          {/* Exibição para dispositivos móveis */}
          {isMobile && (
            <div className="md:hidden">
              {interesses.map(interesse => (
                <InteresseMobileCard 
                  key={interesse.id}
                  interesse={interesse} 
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
          
          {/* Exibição para desktop */}
          {!isMobile && (
            <div className="hidden md:block">
              <InteresseDesktopTable 
                interesses={interesses} 
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AprovacaoInteresse;
