
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

export interface SignUpOptions {
  role?: UserRole;
  skipEmailVerification?: boolean;
  retryCount?: number;
}

export const signUp = async (email: string, password: string, name: string, options: SignUpOptions = {}) => {
  try {
    const { role = 'user', skipEmailVerification = false, retryCount = 0 } = options;
    
    console.log("Signup attempt with:", email, name, role, "retry:", retryCount);
    
    // Validate inputs
    if (!email || !password || !name) {
      return { 
        success: false, 
        error: { message: 'Email, senha e nome são obrigatórios.' } 
      };
    }
    
    // Validate password strength
    if (password.length < 6) {
      return { 
        success: false, 
        error: { message: 'A senha deve ter pelo menos 6 caracteres.' } 
      };
    }
    
    // Standard signup options
    const signUpOptions: any = {
      email,
      password,
      options: {
        data: { 
          name,
          role
        },
        emailRedirectTo: `${window.location.origin}/login`
      }
    };
    
    // If skipEmailVerification is true, add emailConfirm option (for development environments)
    if (skipEmailVerification) {
      console.log("Skipping email verification for development");
      signUpOptions.options.emailConfirm = true; // This will auto-confirm the email
    }
    
    // Use direct API in admin mode if we've hit rate limits and have admin permissions
    if (retryCount > 2) {
      console.log("Trying admin signup flow after retry count:", retryCount);
      
      try {
        const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { 
            name,
            role
          }
        });
        
        if (adminError) {
          console.warn("Admin signup flow failed:", adminError);
          // Fall back to regular signup
        } else if (adminData) {
          console.log("Admin signup successful:", adminData.user.id);
          
          // Create user profile
          try {
            await createUserProfile(adminData.user.id, email, name, role);
            return { success: true, error: null };
          } catch (profileError: any) {
            return { success: true, error: { message: "Conta criada, mas houve um problema ao criar o perfil: " + profileError.message } };
          }
        }
      } catch (adminError) {
        console.error("Error in admin signup flow:", adminError);
        // Fall back to regular signup
      }
    }
    
    // Standard signup - using regular client
    const { data, error } = await supabase.auth.signUp(signUpOptions);
    
    if (error) {
      console.error("Signup error:", error);
      
      // Handle specific errors
      if (error.message.includes('User already registered')) {
        return { 
          success: false, 
          error: { 
            message: 'Este email já está registrado. Tente fazer login.' 
          } 
        };
      }
      
      // Handle rate limit errors specifically with detailed information
      if (error.message.includes('rate limit') || error.message.includes('limite') || 
          error.status === 429 || error.code === 'over_email_send_rate_limit') {
        
        return {
          success: false,
          error: {
            message: 'Limite de envio de emails excedido. Por favor, tente novamente mais tarde.',
            code: 'rate_limit',
            status: 429,
            retryAfter: 60, // Suggest waiting 60 seconds before retry
            retryCount: retryCount
          }
        };
      }
      
      return { success: false, error };
    }
    
    // If signup was successful, create the user in the user table
    if (data?.user) {
      try {
        await createUserProfile(data.user.id, email, name, role);
      } catch (profileError: any) {
        console.error('Error creating user profile:', profileError);
        return { success: true, error: { message: "Conta criada, mas houve um problema ao criar o perfil: " + profileError.message } };
      }
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error during sign up:', error);
    return { success: false, error };
  }
};

async function createUserProfile(userId: string, email: string, name: string, role: UserRole) {
  console.log("Creating user profile in user table:", userId, email, name, role);
  
  // Insert directly into the user table
  const { error: profileError } = await supabase
    .from('user')
    .insert({
      id: userId,
      email,
      name,
      role,
      active: true,
      tags: role === 'diretoria' ? ['diretoria_aciesc'] : []
    });
  
  if (profileError) {
    console.error('Error creating user profile:', profileError);
    throw profileError;
  } else {
    console.log("User profile created successfully");
  }
}

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
