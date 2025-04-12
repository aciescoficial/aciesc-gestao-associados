
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getOperationLogs, OperationLog } from './services';
import { useAuth } from '@/components/auth/AuthProvider';
import { OperationLogsTable } from './components/OperationLogsTable';
import { OperationLogsLoadingState } from './components/OperationLogsLoadingState';

export const OperationLogs: React.FC = () => {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  useEffect(() => {
    const fetchLogs = async () => {
      if (!isAdmin) return;
      
      try {
        setLoading(true);
        const result = await getOperationLogs({});
        setLogs(result.logs);
      } catch (error) {
        console.error('Erro ao buscar logs:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o histórico de operações.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [isAdmin, toast]);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Histórico de Operações</h2>
      
      <OperationLogsLoadingState loading={loading} isAdmin={isAdmin} />
      
      {!loading && isAdmin && <OperationLogsTable logs={logs} />}
    </div>
  );
};
