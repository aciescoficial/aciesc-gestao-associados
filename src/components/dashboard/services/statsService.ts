
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface DashboardStats {
  associados: number;
  empresas: number;
  pendentes: number;
  carteirasPendentes: number;
}

/**
 * Fetches statistics data for the dashboard
 * @param retries Number of retry attempts
 */
export const fetchDashboardStats = async (retries = 3): Promise<DashboardStats> => {
  try {
    // Fetch associados count
    const { count: associadosCount, error: associadosError } = await supabase
      .from('associados')
      .select('*', { count: 'exact', head: true });
    
    if (associadosError) {
      console.error('Error fetching associados count:', associadosError);
      if (retries > 0) {
        console.log(`Retrying fetchDashboardStats (${retries} attempts remaining)...`);
        return fetchDashboardStats(retries - 1);
      }
    }
    
    // Fetch empresas count
    const { count: empresasCount, error: empresasError } = await supabase
      .from('empresas')
      .select('*', { count: 'exact', head: true });
    
    if (empresasError) {
      console.error('Error fetching empresas count:', empresasError);
      if (retries > 0) {
        console.log(`Retrying fetchDashboardStats (${retries} attempts remaining)...`);
        return fetchDashboardStats(retries - 1);
      }
    }
    
    // Fetch pending approvals count
    const { count: pendentesCount, error: pendentesError } = await supabase
      .from('associados')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pendente');
    
    if (pendentesError) {
      console.error('Error fetching pendentes count:', pendentesError);
      if (retries > 0) {
        console.log(`Retrying fetchDashboardStats (${retries} attempts remaining)...`);
        return fetchDashboardStats(retries - 1);
      }
    }
    
    // Fetch pending carteirinhas count
    const { count: carteirasPendentesCount, error: carteirasError } = await supabase
      .from('carteirinha_solicitacoes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pendente_pagamento');
    
    if (carteirasError) {
      console.error('Error fetching carteiras pendentes count:', carteirasError);
      if (retries > 0) {
        console.log(`Retrying fetchDashboardStats (${retries} attempts remaining)...`);
        return fetchDashboardStats(retries - 1);
      }
    }

    return {
      associados: associadosCount || 0,
      empresas: empresasCount || 0,
      pendentes: pendentesCount || 0,
      carteirasPendentes: carteirasPendentesCount || 0
    };
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
