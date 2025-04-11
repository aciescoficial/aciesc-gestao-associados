
/**
 * This file contains definitions of RPC functions available in the Supabase project.
 * Add function declarations here as they are defined in the Supabase project.
 */

/**
 * Check if a user has a specific role
 */
export async function hasRole(user_id: string, role_to_check: 'admin' | 'user') {
  return { 
    user_id, 
    role_to_check 
  };
}

/**
 * Log user activity
 */
export async function logUserActivity(user_id_param: string, event_param: string, created_at_param: string) {
  return {
    user_id_param,
    event_param,
    created_at_param
  };
}

/**
 * Get users from auth schema (requires admin rights)
 * Returns array of user objects with id and email
 */
export async function get_auth_users() {
  // This is just a type definition for the RPC function
  // The actual implementation is in the Supabase database
  return [] as Array<{ id: string; email: string }>;
}
