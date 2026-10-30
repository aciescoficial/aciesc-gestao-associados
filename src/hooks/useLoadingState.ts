
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const withLoading = async <T,>(
    operation: () => Promise<T>,
    errorMessage: string = "Ocorreu um erro"
  ): Promise<T> => {
    try {
      setIsLoading(true);
      return await operation();
    } catch (error: any) {
      console.error("Operation error:", error);
      toast({
        title: "Erro",
        description: errorMessage + (error.message ? `: ${error.message}` : ""),
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    withLoading,
  };
};
