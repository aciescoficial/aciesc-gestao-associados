
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

export const logOperation = async (data: LogOperationData) => {
  try {
    const { error } = await supabase
      .from('operation_logs')
      .insert({
        event_type: data.eventType,
        entity_type: data.entityType,
        format: data.format,
        details: data.details,
        record_count: data.recordCount,
        user_id: supabase.auth.getUser().then(res => res.data.user?.id) // Get current user ID
      });

    if (error) throw error;
  } catch (err) {
    console.error("Falha ao registrar operação:", err);
    // Log silently fails but doesn't break the main operation
  }
};

export const getOperationLogs = async () => {
  try {
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
        profiles:profiles(name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Falha ao buscar logs de operação:", err);
    throw err;
  }
};
