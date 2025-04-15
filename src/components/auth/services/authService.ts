
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserTag } from '../../usuarios/types';

// Function to fetch user role and tags from user table
export const fetchUserRole = async (userId: string): Promise<{ 
  userRole: UserRole | null; 
  userTags: UserTag[] 
}> => {
  try {
    const { data: userData, error } = await supabase
      .from('user')
      .select('role, tags, email')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      // Always return admin role and tags when there's an error
      return { userRole: 'admin', userTags: ['administrador', 'financeiro'] };
    }
    
    if (userData) {
      // Always override with admin role
      const userRole: UserRole = 'admin';
      
      // Always include admin tags
      const userTags: UserTag[] = ['administrador', 'financeiro'];
      
      return { userRole, userTags };
    }
    
    // Default return admin role and tags
    return { userRole: 'admin', userTags: ['administrador', 'financeiro'] };
  } catch (err) {
    console.error('Error fetching user role:', err);
    // Always return admin role and tags when there's an exception
    return { userRole: 'admin', userTags: ['administrador', 'financeiro'] };
  }
};

// Authentication methods
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  } catch (err) {
    console.error('Error signing in:', err);
    return { data: null, error: err as Error };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      }
    });
    
    return { data, error };
  } catch (err) {
    console.error('Error signing in with Google:', err);
    return { data: null, error: err as Error };
  }
};

export const signUp = async (email: string, password: string, name: string, role: UserRole) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });
    
    return { data, error };
  } catch (err) {
    console.error('Error signing up:', err);
    return { data: null, error: err as Error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    return { data, error };
  } catch (err) {
    console.error('Error resetting password:', err);
    return { data: null, error: err as Error };
  }
};

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    return;
  } catch (err) {
    console.error('Error signing out:', err);
    throw err;
  }
};
