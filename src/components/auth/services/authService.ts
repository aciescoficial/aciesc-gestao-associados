
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/components/usuarios/types';

export const signIn = async (email: string, password: string) => {
  try {
    console.log('SignIn attempt with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('SignIn error:', error);
      return { data: null, error };
    } 
    
    console.log('SignIn successful, user ID:', data?.user?.id);
    console.log('User metadata:', data?.user?.user_metadata);
    
    // Check if the user exists in the user table
    if (data?.user?.id) {
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('role, tags, active')
        .eq('id', data.user.id)
        .single();
        
      if (userError) {
        console.error('Error fetching user data:', userError);
      } else if (userData) {
        console.log('User role:', userData.role);
        console.log('User tags:', userData.tags);
        console.log('User active status:', userData.active);
        
        if (!userData.active) {
          return { data: null, error: { message: 'Conta desativada. Por favor, contate o administrador.' } };
        }
      }
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Exception during sign in:', error);
    return { data: null, error };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login`,
      }
    });
    
    return { data, error };
  } catch (error: any) {
    console.error('Error during Google sign in:', error);
    return { data: null, error };
  }
};

export const signUp = async (email: string, password: string, name: string, role: UserRole = 'user') => {
  try {
    console.log("Signup attempt with:", email, name, role);
    
    // Use admin client for signup to bypass RLS
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm the email
      user_metadata: { 
        name,
        role
      }
    });
    
    if (error) {
      console.error("Signup error:", error);
      
      // Handle specific errors
      if (error.message.includes('User already registered')) {
        return { 
          data: null, 
          error: { 
            message: 'Este email já está registrado. Tente fazer login.' 
          } 
        };
      }
      
      return { data: null, error };
    }
    
    // If signup was successful, create the user in the user table
    if (data?.user) {
      try {
        console.log("Creating user profile in user table:", data.user.id, email, name, role);
        
        // Insert directly into the user table
        const { error: profileError } = await supabase
          .from('user')
          .insert({
            id: data.user.id,
            email,
            name,
            role,
            active: true,
            tags: role === 'diretoria' ? ['diretoria_aciesc'] : []
          });
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return { data, error: profileError };
        } else {
          console.log("User profile created successfully");
        }
      } catch (profileError: any) {
        console.error('Exception creating user profile:', profileError);
        return { data, error: profileError };
      }
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error during sign up:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    console.log("User signed out");
  } catch (error) {
    console.error('Error during sign out:', error);
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/reset-password` }
    );
    
    return { data, error };
  } catch (error: any) {
    console.error('Error during password reset:', error);
    return { data: null, error };
  }
};

export const fetchUserRole = async (userId: string) => {
  try {
    // Using direct query to user table
    const { data, error } = await supabase
      .from('user')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      throw error;
    }
    
    console.log('Fetched user role:', data?.role);
    return data?.role;
  } catch (error) {
    console.error('Exception fetching user role:', error);
    return null;
  }
};
