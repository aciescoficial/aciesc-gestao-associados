
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface RecentActivity {
  type: 'associado' | 'empresa';
  name: string;
  action: string;
  date: string;
}

/**
 * Fetches recent activity data for the dashboard
 * @param retries Number of retry attempts
 */
export const fetchRecentActivity = async (retries = 3): Promise<RecentActivity[]> => {
  try {
    // Fetch recent associados
    const { data: recentAssociados, error: recentAssociadosError } = await supabase
      .from('associados')
      .select('nome, sobrenome, status, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (recentAssociadosError) {
      console.error('Error fetching recent associados:', recentAssociadosError);
      if (retries > 0) {
        console.log(`Retrying fetchRecentActivity (${retries} attempts remaining)...`);
        return fetchRecentActivity(retries - 1);
      }
    }
    
    // Fetch recent empresas
    const { data: recentEmpresas, error: recentEmpresasError } = await supabase
      .from('empresas')
      .select('nome_fantasia, status, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (recentEmpresasError) {
      console.error('Error fetching recent empresas:', recentEmpresasError);
      if (retries > 0) {
        console.log(`Retrying fetchRecentActivity (${retries} attempts remaining)...`);
        return fetchRecentActivity(retries - 1);
      }
    }

    // Combine and format recent activity
    const formattedActivity = [
      ...(recentAssociados || []).map(item => ({
        type: 'associado' as const,
        name: `${item.nome} ${item.sobrenome}`,
        action: item.status === 'pendente' ? 'pendente' : 'cadastrado',
        date: new Date(item.created_at).toLocaleDateString()
      })),
      ...(recentEmpresas || []).map(item => ({
        type: 'empresa' as const,
        name: item.nome_fantasia,
        action: item.status === 'pendente' ? 'pendente' : 'conveniada',
        date: new Date(item.created_at).toLocaleDateString()
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4); // Get only the 4 most recent activities
    
    return formattedActivity;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    if (retries > 0) {
      console.log(`Retrying fetchRecentActivity (${retries} attempts remaining)...`);
      return fetchRecentActivity(retries - 1);
    }
    toast({
      title: "Erro ao carregar atividades recentes",
      description: "Tente atualizar a página",
      variant: "destructive"
    });
    return [];
  }
};
