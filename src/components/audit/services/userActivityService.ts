
import { supabase } from '@/integrations/supabase/client';

/**
 * Log a user access event
 * @param userId User ID
 * @param event Event description
 * @returns Promise resolving to success status
 */
export const logUserActivity = async (userId: string, event: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_access_logs')
      .insert({ user_id: userId, event });
      
    if (error) {
      console.error('Error logging user activity:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Exception logging user activity:', error);
    return false;
  }
};

/**
 * Log system access event when user logs in
 * @param userId User ID
 * @returns Promise resolving to success status
 */
export const logSystemAccess = async (userId: string): Promise<boolean> => {
  return logUserActivity(userId, 'Acesso ao sistema');
};

/**
 * Log profile update event
 * @param userId User ID
 * @returns Promise resolving to success status
 */
export const logProfileUpdate = async (userId: string): Promise<boolean> => {
  return logUserActivity(userId, 'Atualização de perfil');
};

/**
 * Log password change event
 * @param userId User ID
 * @returns Promise resolving to success status
 */
export const logPasswordChange = async (userId: string): Promise<boolean> => {
  return logUserActivity(userId, 'Alteração de senha');
};
