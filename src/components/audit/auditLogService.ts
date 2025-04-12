
// Fix for the nullable profile property - auditLogService.ts
import { supabase } from '@/integrations/supabase/client';

interface LogOperationParams {
  eventType: string;
  entityType: string;
  details?: string;
  recordCount?: number;
  format?: string;
}

// Define the OperationLog interface for use in components
export interface OperationLog {
  id: string;
  eventType: string;
  entityType: string;
  details: string | null;
  recordCount: number | null;
  format: string | null;
  created_at: string;
  userId: string | null;
  userName: string | null;
  createdAt: string;
  profiles?: { name: string | null } | null;
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
} = {}) {  // Add default empty object for options
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
    const formattedLogs: OperationLog[] = data?.map(log => ({
      id: log.id,
      eventType: log.event_type,
      entityType: log.entity_type,
      details: log.details,
      recordCount: log.record_count,
      format: log.format,
      createdAt: new Date(log.created_at).toLocaleString(),
      userName: log.profiles?.name || 'Unknown',
      userId: log.user_id,
      created_at: log.created_at,
      profiles: log.profiles ? { name: log.profiles.name } : null
    }));

    return { logs: formattedLogs || [], count: formattedLogs?.length || 0 };
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
    
    // Use separate count queries instead of group
    const { data: statsData, error: statsError } = await supabase
      .from('operation_logs')
      .select('event_type, id')
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    if (statsError) throw statsError;
    
    // Process the data to get counts by type
    const statsByType = statsData ? 
      Array.from(
        statsData.reduce((acc, curr) => {
          const count = (acc.get(curr.event_type) || 0) + 1;
          acc.set(curr.event_type, count);
          return acc;
        }, new Map())
      ).map(([event_type, count]) => ({ event_type, count })) : [];
    
    // Get count of operations by entity
    const { data: entityData, error: entityError } = await supabase
      .from('operation_logs')
      .select('entity_type, id')
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    if (entityError) throw entityError;
    
    // Process the data to get counts by entity type
    const statsByEntity = entityData ? 
      Array.from(
        entityData.reduce((acc, curr) => {
          const count = (acc.get(curr.entity_type) || 0) + 1;
          acc.set(curr.entity_type, count);
          return acc;
        }, new Map())
      ).map(([entity_type, count]) => ({ entity_type, count })) : [];
    
    // Get most active users
    const { data: userData, error: usersError } = await supabase
      .from('operation_logs')
      .select(`user_id, profiles:user_id (name)`)
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    if (usersError) throw usersError;
    
    // Process the data to get user activity counts
    const userCounts = userData ? 
      Array.from(
        userData.reduce((acc, curr) => {
          const count = (acc.get(curr.user_id) || 0) + 1;
          acc.set(curr.user_id, {
            count,
            name: curr.profiles?.name || 'Unknown'
          });
          return acc;
        }, new Map())
      ).map(([user_id, data]) => ({
        id: user_id,
        name: data.name,
        count: data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) : [];
    
    return {
      byType: statsByType,
      byEntity: statsByEntity,
      activeUsers: userCounts
    };
  } catch (error) {
    console.error('Error fetching operation stats:', error);
    throw error;
  }
}
