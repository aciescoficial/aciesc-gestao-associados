
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
    
    // Configurar para não enviar o email de confirmação
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name,
          role
        },
        // Removido emailRedirectTo para evitar envio de emails de confirmação
        emailRedirectTo: undefined
      }
    });
    
    // Se o signup foi bem-sucedido, criar o usuário na tabela user também
    if (data?.user && !error) {
      try {
        console.log("Creating user profile:", data.user.id, email, name, role);
        
        // Inserir o usuário na tabela public.user
        const { error: profileError } = await supabase.from('user').insert({
          id: data.user.id,
          email: email,
          name: name,
          role: role,
          active: true,
          tags: role === 'diretoria' ? ['diretoria_aciesc'] : []
        });
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return { data, error: profileError };
        } else {
          console.log("User profile created successfully");
        }
      } catch (profileError) {
        console.error('Exception creating user profile:', profileError);
        return { data, error: profileError };
      }
    } else if (error) {
      // Tratar erros específicos do Supabase
      if (error.message.includes('rate limit')) {
        return { 
          data: null, 
          error: { 
            message: 'Limite de cadastros excedido. Por favor, tente novamente mais tarde.' 
          } 
        };
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
