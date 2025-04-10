
import { supabase } from './client';

// Helper function to safely log user activity
export const logUserActivity = async (userId: string, event: string) => {
  try {
    await supabase.rpc('log_user_activity', {
      user_id_param: userId,
      event_param: event,
      created_at_param: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error logging user activity:', error);
    return { success: false, error };
  }
};
