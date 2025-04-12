
import { supabase } from '@/integrations/supabase/client';
import { OperationLog, OperationLogQuery } from './operationLogTypes';

/**
 * Get operation logs with optional filtering
 */
export async function getOperationLogs(options: OperationLogQuery = {}) {
  try {
    const {
      limit = 100,
      offset = 0,
      user_id,
      entity_type,
      event_type,
      startDate,
      endDate,
    } = options;

    let query = supabase
      .from('operation_logs')
      .select(`
        id, 
        event_type, 
        entity_type, 
        details, 
        record_count, 
        format, 
        created_at, 
        user_id,
        profiles:user_id (name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters if provided
    if (user_id) query = query.eq('user_id', user_id);
    if (entity_type) query = query.eq('entity_type', entity_type);
    if (event_type) query = query.eq('event_type', event_type);
    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);

    const { data, error } = await query;

    if (error) throw error;

    // Format data for display
    const formattedLogs: OperationLog[] = data?.map(log => {
      // Safely extract user name with proper null checks
      let profileName = 'Unknown';
      let profileData = null;
      
      // Check if profiles exists and is an object
      if (log.profiles !== null && typeof log.profiles === 'object') {
        profileName = log.profiles.name || 'Unknown';
        profileData = { name: log.profiles.name };
      }
      
      return {
        id: log.id,
        eventType: log.event_type,
        entityType: log.entity_type,
        details: log.details,
        recordCount: log.record_count,
        format: log.format,
        createdAt: new Date(log.created_at).toLocaleString(),
        userName: profileName,
        userId: log.user_id,
        created_at: log.created_at,
        profiles: profileData
      };
    }) || [];

    return { logs: formattedLogs || [], count: formattedLogs?.length || 0 };
  } catch (error) {
    console.error('Error fetching operation logs:', error);
    throw error;
  }
}
