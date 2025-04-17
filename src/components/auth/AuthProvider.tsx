import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserTag } from '../usuarios/types';
import { useToast } from '@/hooks/use-toast';

// Define our interface for auth context
interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  userTags: UserTag[];
  loading: boolean;
  isAdmin: boolean;
  hasFinanceiroAccess: boolean;
  
  // Auth methods with simplified signatures
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string, options?: {
    role?: UserRole;
    skipEmailVerification?: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshSession: () => Promise<void>;
}

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userTags, setUserTags] = useState<UserTag[]>([]);
  const { toast } = useToast();

  // Fetch additional user data like role and tags
  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('role, tags, active, associado_id, empresa_id')
        .eq('id', userId)
        .maybeSingle(); // Using maybeSingle instead of single to avoid errors
      
      if (error) {
        console.error("Error fetching user data:", error);
        setUserRole('user'); // Default role
        setUserTags([]);
        return;
      }
      
      if (data) {
        console.log("User data fetched:", data);
        setUserRole(data.role as UserRole);
        
        // Process user tags - ensure they are properly cast to UserTag[]
        if (Array.isArray(data.tags)) {
          // Filter and cast tags to ensure they are valid UserTag values
          const validUserTags = data.tags
            .filter(tag => 
              ['corretor', 'corretor_autonomo', 'empresa_conveniada', 'diretoria_aciesc', 
               'administrador', 'financeiro', 'proprietario_imobiliaria', 'imobiliaria', 'aciesc']
              .includes(tag)
            ) as UserTag[];
          
          setUserTags(validUserTags);
          
          // Update user state with extended properties - fix the type casting
          setUser(prevUser => {
            if (!prevUser) return null;
            
            // Create a proper extended user object with correctly typed properties
            const extendedUser = {
              ...prevUser,
              role: data.role as UserRole,
              associado_id: data.associado_id,
              empresa_id: data.empresa_id,
              userTags: validUserTags
            };
            
            return extendedUser;
          });
        }

        // Log system access
        try {
          const { error: logError } = await supabase
            .from('user_access_logs') // Changed from user_activity_log to user_access_logs
            .insert({ 
              user_id: userId,
              event: 'login',
            });
            
          if (logError) console.error("Error logging activity:", logError);
        } catch (logErr) {
          console.error("Error in activity logging:", logErr);
        }
      } else {
        // No user data found, set defaults
        setUserRole('user');
        setUserTags([]);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      setUserRole('user');
      setUserTags([]);
    }
  };

  // Simplified sign in method
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password
      });
      
      if (error) {
        console.error('SignIn error:', error);
        return { success: false, error: error.message };
      }
      
      // Check if user account is active in our custom table
      if (data?.user?.id) {
        const { data: userData, error: userError } = await supabase
          .from('user')
          .select('active')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (userError) {
          console.error('Error fetching user status:', userError);
        } else if (userData && userData.active === false) {
          // Force sign out if account is deactivated
          await supabase.auth.signOut();
          return { 
            success: false, 
            error: 'Conta desativada. Por favor, contate o administrador.' 
          };
        }
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Exception during sign in:', error);
      return { 
        success: false, 
        error: error.message || 'Ocorreu um erro durante o login' 
      };
    }
  };

  // Simplified sign up method
  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    options?: { role?: UserRole; skipEmailVerification?: boolean }
  ) => {
    try {
      const role = options?.role || 'user';
      const skipEmailVerification = options?.skipEmailVerification || false;
      
      // Standard signup options
      const signUpOptions: any = {
        email,
        password,
        options: {
          data: { name, role },
          emailRedirectTo: `${window.location.origin}/login`
        }
      };
      
      // For development environments, auto-confirm email
      if (skipEmailVerification) {
        signUpOptions.options.emailConfirm = true;
      }
      
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp(signUpOptions);
      
      if (error) {
        // Handle rate limiting and existing user errors
        if (error.message.includes('User already registered')) {
          return { 
            success: false, 
            error: 'Este email já está registrado. Tente fazer login.' 
          };
        }
        
        if (error.status === 429 || error.message.includes('rate limit')) {
          return {
            success: false,
            error: 'Limite de cadastros excedido. Tente novamente mais tarde.'
          };
        }
        
        return { success: false, error: error.message };
      }
      
      // If signup was successful, create user profile in custom table
      if (data?.user) {
        try {
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
            return { success: false, error: profileError.message };
          }
        } catch (profileError: any) {
          console.error('Exception creating user profile:', profileError);
          return { success: false, error: profileError.message };
        }
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error during sign up:', error);
      return { 
        success: false, 
        error: error.message || 'Ocorreu um erro durante o cadastro' 
      };
    }
  };

  // Sign out method
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // We'll let the auth state listener handle clearing the state
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  // Password reset method
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/reset-password` }
      );
      
      if (error) {
        console.error('Reset password error:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error during password reset:', error);
      return { 
        success: false, 
        error: error.message || 'Ocorreu um erro durante a recuperação de senha' 
      };
    }
  };

  // Session refresh method
  const refreshSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      
      if (data.session?.user) {
        await fetchUserData(data.session.user.id);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    console.log("AuthProvider mounted");
    
    // First set up auth state listener to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          // Use setTimeout to avoid potential recursive calls
          setTimeout(() => {
            fetchUserData(newSession.user!.id);
          }, 0);
        } else {
          setUserRole(null);
          setUserTags([]);
        }
      }
    );
    
    // Then check for existing session
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          await fetchUserData(data.session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
    
    // Cleanup subscription on unmount
    return () => {
      console.log("Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, []);
  
  // Derived user permissions
  const isAdmin = userRole === 'admin' || userRole === 'diretoria' as UserRole;
  
  const hasFinanceiroAccess = isAdmin || 
    userTags.some(tag => tag === 'financeiro') || 
    userRole === 'diretoria' as UserRole;
  
  const value = {
    user,
    userRole,
    userTags,
    loading,
    isAdmin,
    hasFinanceiroAccess,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshSession,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create and export the auth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
