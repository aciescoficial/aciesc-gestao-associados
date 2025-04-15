
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/components/usuarios/types';

export const signIn = async (email: string, password: string) => {
  try {
    console.log('SignIn attempt with:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('SignIn error:', error);
    } else {
      console.log('SignIn successful:', data?.user?.id);
    }
    
    return { data, error };
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
    console.log("Signup attempt with:", email, name);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name,
          role
        },
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    
    // If signup was successful but we need to create the user in the user table as well
    if (data?.user && !error) {
      try {
        console.log("Creating user profile:", data.user.id);
        // Insert the user into the public.user table
        const { error: profileError } = await supabase.from('user').upsert({
          id: data.user.id,
          email: email,
          name: name,
          role: role,
          active: true
        });
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
        } else {
          console.log("User profile created successfully");
        }
      } catch (profileError) {
        console.error('Exception creating user profile:', profileError);
      }
    }
    
    return { data, error };
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
