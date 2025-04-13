
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
      return { userRole: null, userTags: [] };
    }
    
    if (userData) {
      let userRole: UserRole;
      
      switch (userData.role) {
        case 'admin':
          userRole = 'admin';
          break;
        case 'empresa':
        case 'conveniado':
          userRole = 'empresa';
          break;
        case 'associado':
        case 'user':
        case 'diretoria':
        default:
          userRole = 'user';
          break;
      }
      
      // Convert string[] to UserTag[] by filtering to only valid UserTag values
      const validUserTags = Array.isArray(userData.tags) ? userData.tags.filter(tag => 
        ['corretor', 'corretor_autonomo', 'empresa_conveniada', 'diretoria_aciesc', 
         'administrador', 'financeiro', 'proprietario_imobiliaria'].includes(tag)
      ) as UserTag[] : [];
      
      return { userRole, userTags: validUserTags };
    }
    
    return { userRole: null, userTags: [] };
  } catch (err) {
    console.error('Error fetching user role:', err);
    return { userRole: null, userTags: [] };
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
