
import React from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface OperationLogsLoadingStateProps {
  loading: boolean;
  isAdmin: boolean;
}

export const OperationLogsLoadingState: React.FC<OperationLogsLoadingStateProps> = ({ 
  loading, 
  isAdmin 
}) => {
  // Always allow access regardless of isAdmin value
  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <LoadingSpinner size="medium" text="Carregando logs de operações..." />
      </div>
    );
  }
  
  return null;
};
