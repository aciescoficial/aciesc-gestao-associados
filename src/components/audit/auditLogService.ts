
// Fix for the nullable profile property - auditLogService.ts
import { supabase } from '@/integrations/supabase/client';

interface LogOperationParams {
  eventType: string;
  entityType: string;
  details?: string;
  recordCount?: number;
  format?: string;
}

/**
 * Logs an operation in the database for audit purposes
 * @param params Operation parameters to log
 */
export async function logOperation(params: LogOperationParams): Promise<void> {
  try {
    const { eventType, entityType, details, recordCount, format } = params;
    
    // Get current user
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    // Log the operation
    await supabase
      .from('operation_logs')
      .insert({
        user_id: userId,
        event_type: eventType,
        entity_type: entityType,
        details: details || null,
        record_count: recordCount || null,
        format: format || null,
      });
    
    console.log('Operation logged successfully:', { eventType, entityType });
  } catch (error) {
    console.error('Failed to log operation:', error);
    // Don't throw - we don't want to interrupt the main flow if logging fails
  }
}

/**
 * Get operation logs with optional filtering
 */
export async function getOperationLogs(options: {
  limit?: number;
  offset?: number;
  user_id?: string;
  entity_type?: string;
  event_type?: string;
  startDate?: string;
  endDate?: string;
}) {
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

    const { data, error, count } = await query;

    if (error) throw error;

    // Format data for display
    const formattedLogs = data?.map(log => ({
      id: log.id,
      eventType: log.event_type,
      entityType: log.entity_type,
      details: log.details,
      recordCount: log.record_count,
      format: log.format,
      createdAt: new Date(log.created_at).toLocaleString(),
      userName: log.profiles?.name || 'Unknown',
      userId: log.user_id
    }));

    return { logs: formattedLogs || [], count };
  } catch (error) {
    console.error('Error fetching operation logs:', error);
    throw error;
  }
}

/**
 * Get statistics about operations
 */
export async function getOperationStats() {
  try {
    // Get count of operations by type in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: statsByType, error: statsError } = await supabase
      .from('operation_logs')
      .select('event_type, count(*)')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .group('event_type');
    
    if (statsError) throw statsError;
    
    // Get count of operations by entity in the last 30 days
    const { data: statsByEntity, error: entityError } = await supabase
      .from('operation_logs')
      .select('entity_type, count(*)')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .group('entity_type');
    
    if (entityError) throw entityError;
    
    // Get most active users
    const { data: activeUsers, error: usersError } = await supabase
      .from('operation_logs')
      .select(`
        user_id,
        profiles:user_id (name),
        count
      `)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .group('user_id, profiles:user_id (name)')
      .order('count', { ascending: false })
      .limit(5);
    
    if (usersError) throw usersError;
    
    return {
      byType: statsByType || [],
      byEntity: statsByEntity || [],
      activeUsers: activeUsers ? activeUsers.map(user => ({
        id: user.user_id,
        name: user.profiles?.name || 'Unknown',
        count: user.count
      })) : []
    };
  } catch (error) {
    console.error('Error fetching operation stats:', error);
    throw error;
  }
}
