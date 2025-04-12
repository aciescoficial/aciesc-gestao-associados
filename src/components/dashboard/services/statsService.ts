
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  associados: number;
  empresas: number;
  pendentes: number;
  carteirasPendentes: number;
}

/**
 * Fetches statistics data for the dashboard
 */
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Fetch associados count
    const { count: associadosCount, error: associadosError } = await supabase
      .from('associados')
      .select('*', { count: 'exact', head: true });
    
    if (associadosError) {
      console.error('Error fetching associados count:', associadosError);
    }
    
    // Fetch empresas count
    const { count: empresasCount, error: empresasError } = await supabase
      .from('empresas')
      .select('*', { count: 'exact', head: true });
    
    if (empresasError) {
      console.error('Error fetching empresas count:', empresasError);
    }
    
    // Fetch pending approvals count
    const { count: pendentesCount, error: pendentesError } = await supabase
      .from('associados')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pendente');
    
    if (pendentesError) {
      console.error('Error fetching pendentes count:', pendentesError);
    }
    
    // Fetch pending carteirinhas count
    const { count: carteirasPendentesCount, error: carteirasError } = await supabase
      .from('carteirinha_solicitacoes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pendente_pagamento');
    
    if (carteirasError) {
      console.error('Error fetching carteiras pendentes count:', carteirasError);
    }

    return {
      associados: associadosCount || 0,
      empresas: empresasCount || 0,
      pendentes: pendentesCount || 0,
      carteirasPendentes: carteirasPendentesCount || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      associados: 0,
      empresas: 0,
      pendentes: 0,
      carteirasPendentes: 0
    };
  }
};
