
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface SystemStatus {
  asaas: { active: boolean; message: string };
  stripe: { active: boolean; message: string };
  emails: { active: boolean; message: string };
}

/**
 * Checks the status of system integrations
 * @param retries Number of retry attempts
 */
export const checkSystemStatus = async (retries = 3): Promise<SystemStatus> => {
  try {
    // Check Asaas integration status
    const { data: asaasConfig, error: asaasError } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'ASAAS_API_KEY')
      .maybeSingle();
    
    if (asaasError) {
      console.error('Error checking Asaas status:', asaasError);
      if (retries > 0) {
        console.log(`Retrying checkSystemStatus (${retries} attempts remaining)...`);
        return checkSystemStatus(retries - 1);
      }
    }
    
    // Check Stripe integration status
    const { data: stripeConfig, error: stripeError } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'STRIPE_SECRET_KEY')
      .maybeSingle();
    
    if (stripeError) {
      console.error('Error checking Stripe status:', stripeError);
      if (retries > 0) {
        console.log(`Retrying checkSystemStatus (${retries} attempts remaining)...`);
        return checkSystemStatus(retries - 1);
      }
    }
    
    // Check GHL integration status for email functionality
    const { data: ghlConfig, error: ghlError } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'GO_HIGH_LEVEL_API_KEY')
      .maybeSingle();
    
    if (ghlError) {
      console.error('Error checking GHL status:', ghlError);
      if (retries > 0) {
        console.log(`Retrying checkSystemStatus (${retries} attempts remaining)...`);
        return checkSystemStatus(retries - 1);
      }
    }
    
    const asaasActive = !!asaasConfig?.value;
    const stripeActive = !!stripeConfig?.value;
    const ghlActive = !!ghlConfig?.value;
    
    return {
      asaas: { 
        active: asaasActive, 
        message: asaasActive ? 'Operacional' : 'Inativo (Token não cadastrado ou não funcionando)'
      },
      stripe: {
        active: stripeActive,
        message: stripeActive ? 'Operacional' : 'Inativo (Token não cadastrado ou não funcionando)'
      },
      emails: {
        active: ghlActive,
        message: ghlActive ? 'Ativos' : 'Inativos (Token não funcionando)'
      }
    };
  } catch (error) {
    console.error('Error checking system status:', error);
    if (retries > 0) {
      console.log(`Retrying checkSystemStatus (${retries} attempts remaining)...`);
      return checkSystemStatus(retries - 1);
    }
    toast({
      title: "Erro ao verificar status do sistema",
      description: "Tente atualizar a página",
      variant: "destructive"
    });
    // Set default values if there was an error
    return {
      asaas: { active: false, message: 'Verificação falhou' },
      stripe: { active: false, message: 'Verificação falhou' },
      emails: { active: false, message: 'Verificação falhou' }
    };
  }
};
