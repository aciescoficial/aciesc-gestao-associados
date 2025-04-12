
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole, UserTag } from '../usuarios/types';

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{
    error: Error | null;
    data: any;
  }>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  userRole: UserRole | null;
  userTags: UserTag[];
  isAdmin: boolean;
  hasFinanceiroAccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userTags, setUserTags] = useState<UserTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Set user if session exists
        if (session?.user) {
          setUser(session.user);
          await fetchUserRole(session.user.id);
        } else {
          setUser(null);
          setUserRole(null);
          setUserTags([]);
        }
      } catch (err) {
        console.error('Error in auth provider:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch initial session
    fetchSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchUserRole(session.user.id);
        } else {
          setUser(null);
          setUserRole(null);
          setUserTags([]);
        }
      }
    );
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Fetch user role and tags from profiles table
  const fetchUserRole = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, tags, email')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }
      
      if (profile) {
        let userRoleValue: UserRole;
        
        switch (profile.role) {
          case 'admin':
            userRoleValue = 'admin';
            break;
          case 'empresa':
          case 'conveniado':
            userRoleValue = 'empresa';
            break;
          case 'associado':
          case 'user':
          case 'diretoria':
          default:
            userRoleValue = 'user';
            break;
        }
        
        setUserRole(userRoleValue);
        // Convert string[] to UserTag[] by filtering to only valid UserTag values
        const validUserTags = Array.isArray(profile.tags) ? profile.tags.filter(tag => 
          ['corretor', 'corretor_autonomo', 'empresa_conveniada', 'diretoria_aciesc', 
           'administrador', 'financeiro', 'proprietario_imobiliaria'].includes(tag)
        ) as UserTag[] : [];
        
        setUserTags(validUserTags);
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
    }
  };
  
  const signIn = async (email: string, password: string) => {
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

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
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

  const resetPassword = async (email: string) => {
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
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
      setUserTags([]);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  // Check if user has admin privileges
  const isAdmin = userRole === 'admin' || userTags.includes('administrador');
  
  // Check if user has access to financeiro
  const hasFinanceiroAccess = isAdmin || userTags.includes('financeiro');
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn,
      signUp,
      resetPassword, 
      signOut,
      userRole,
      userTags,
      isAdmin,
      hasFinanceiroAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};
