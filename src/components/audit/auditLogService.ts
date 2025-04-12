
import { supabase } from "@/integrations/supabase/client";

export type LogEventType = 'import' | 'export';
export type LogEntityType = 'associado' | 'conveniado' | 'empresa';
export type LogFormatType = 'csv' | 'xml' | 'json';

export interface LogOperationData {
  eventType: LogEventType;
  entityType: LogEntityType;
  format?: LogFormatType;
  details?: string;
  recordCount?: number;
}

export interface OperationLog {
  id: string;
  event_type: string;
  entity_type: string;
  format?: string;
  details?: string;
  record_count?: number;
  created_at: string;
  user_id: string;
  profiles: {
    name: string;
    email: string;
  } | null;
}

export const logOperation = async (data: LogOperationData) => {
  try {
    // Get current user ID
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) {
      console.error("Falha ao registrar operação: Usuário não autenticado");
      return;
    }

    const { error } = await supabase
      .from('operation_logs')
      .insert({
        event_type: data.eventType,
        entity_type: data.entityType,
        format: data.format,
        details: data.details,
        record_count: data.recordCount,
        user_id: userId
      });

    if (error) throw error;
  } catch (err) {
    console.error("Falha ao registrar operação:", err);
    // Log silently fails but doesn't break the main operation
  }
};

export const getOperationLogs = async (): Promise<OperationLog[]> => {
  try {
    // Use a different approach to get the user information
    const { data, error } = await supabase
      .from('operation_logs')
      .select(`
        id,
        event_type,
        entity_type,
        format,
        details,
        record_count,
        created_at,
        user_id,
        profiles:user_id(name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform the data to match our OperationLog type
    // Handle the case where profiles might be null or have an error
    const logs: OperationLog[] = data?.map(log => {
      // If profiles is an error or null, replace with null
      const safeProfiles = log.profiles && typeof log.profiles === 'object' && !('error' in log.profiles) 
        ? log.profiles as { name: string; email: string; } 
        : null;
        
      return {
        ...log,
        profiles: safeProfiles
      };
    }) || [];
    
    return logs;
  } catch (err) {
    console.error("Falha ao buscar logs de operação:", err);
    throw err;
  }
};
