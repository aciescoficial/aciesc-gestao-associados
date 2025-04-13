
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface DashboardStats {
  associados: number;
  empresas: number;
  pendentes: number;
  carteirasPendentes: number;
}

/**
 * Fetches statistics data for the dashboard with improved timeout handling
 * @param retries Number of retry attempts
 */
export const fetchDashboardStats = async (retries = 1): Promise<DashboardStats> => {
  try {
    // Default values in case of errors
    const defaultStats: DashboardStats = {
      associados: 0,
      empresas: 0,
      pendentes: 0,
      carteirasPendentes: 0
    };
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user found');
      return defaultStats;
    }

    console.log('Authenticated user found, fetching dashboard stats');
    
    // Use a slightly longer timeout to improve chances of successful response
    const timeoutPromise = new Promise<DashboardStats>((resolve) => {
      setTimeout(() => {
        console.log('Stats query timed out, using default values');
        resolve(defaultStats);
      }, 3500); // Increased from 1500ms to 3500ms
    });
    
    // Create the actual data fetching promise
    const dataPromise = (async () => {
      try {
        // Execute all queries in parallel for better performance
        const [
          associadosResult, 
          empresasResult, 
          pendentesResult,
          carteirasResult
        ] = await Promise.all([
          // Fetch associados count
          supabase.from('associados').select('*', { count: 'exact', head: true }),
          
          // Fetch empresas count
          supabase.from('empresas').select('*', { count: 'exact', head: true }),
          
          // Fetch pending approvals count
          supabase.from('associados')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pendente'),
            
          // Fetch pending carteirinhas count
          supabase.from('carteirinha_solicitacoes')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pendente_pagamento')
        ]);

        console.log('Stats query results:', {
          associados: associadosResult.count,
          empresas: empresasResult.count,
          pendentes: pendentesResult.count,
          carteiras: carteirasResult.count
        });

        return {
          associados: associadosResult.count || 0,
          empresas: empresasResult.count || 0,
          pendentes: pendentesResult.count || 0,
          carteirasPendentes: carteirasResult.count || 0
        };
      } catch (error) {
        console.error('Error in data fetching promise:', error);
        return defaultStats;
      }
    })();

    // Race between actual data and timeout
    return await Promise.race([dataPromise, timeoutPromise]);
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    if (retries > 0) {
      console.log(`Retrying fetchDashboardStats (${retries} attempts remaining)...`);
      return fetchDashboardStats(retries - 1);
    }
    toast({
      title: "Erro ao carregar estatísticas",
      description: "Tente atualizar a página",
      variant: "destructive"
    });
    return {
      associados: 0,
      empresas: 0,
      pendentes: 0,
      carteirasPendentes: 0
    };
  }
};
