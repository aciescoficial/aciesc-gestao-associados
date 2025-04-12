
import React from 'react';

interface OperationLogsLoadingStateProps {
  loading: boolean;
  isAdmin: boolean;
}

export const OperationLogsLoadingState: React.FC<OperationLogsLoadingStateProps> = ({ 
  loading, 
  isAdmin 
}) => {
  if (!isAdmin) {
    return (
      <div className="p-4 text-center">
        <p>Você não tem permissão para visualizar esta página.</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <p>Carregando logs de operações...</p>
      </div>
    );
  }
  
  return null;
};
