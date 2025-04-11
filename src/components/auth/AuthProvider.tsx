
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/components/usuarios/types';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{error: any}>;
  signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<{error: any}>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{error: any}>;
  isAdmin: boolean;
  isAssociado: boolean;
  isEmpresa: boolean;
  userRole: UserRole | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAssociado, setIsAssociado] = useState(false);
  const [isEmpresa, setIsEmpresa] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Use setTimeout to avoid potential Supabase callback deadlocks
        if (session?.user) {
          setTimeout(() => {
            checkUserRole(session.user.id);
          }, 0);
          
          // Log authentication events
          if (event === 'SIGNED_IN') {
            setTimeout(async () => {
              try {
                // Insert directly into user_access_logs table
                await supabase
                  .from('user_access_logs')
                  .insert({
                    user_id: session.user.id,
                    event: 'Login',
                    created_at: new Date().toISOString()
                  });
              } catch (error) {
                console.error('Error logging sign in:', error);
              }
            }, 0);
          }
        } else {
          resetRoles();
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const resetRoles = () => {
    setIsAdmin(false);
    setIsAssociado(false);
    setIsEmpresa(false);
    setUserRole(null);
  };

  const checkUserRole = async (userId: string) => {
    try {
      // First check for admin role
      const { data: adminData, error: adminError } = await supabase
        .rpc('has_role', { user_id: userId, role_to_check: 'admin' });
      
      if (adminError) throw adminError;
      
      if (adminData) {
        setIsAdmin(true);
        setUserRole('admin');
        return;
      }
      
      // Check user's role from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      if (profileData) {
        // Map legacy roles to new simplified roles if needed
        let role = profileData.role as UserRole;
        
        // Convert legacy roles to new simplified structure
        if (role === 'associado' || role === 'diretoria' || role === 'conveniado') {
          role = role === 'associado' ? 'user' : (role === 'conveniado' ? 'empresa' : role);
        }
        
        setUserRole(role);
        setIsAdmin(role === 'admin');
        setIsAssociado(role === 'user');
        setIsEmpresa(role === 'empresa');
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      resetRoles();
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error) {
        navigate('/');
      }
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole = 'user') => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });
      if (!error) {
        navigate('/');
      }
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    // Log signout event before actually signing out
    if (user) {
      try {
        // Insert directly into user_access_logs table
        await supabase
          .from('user_access_logs')
          .insert({
            user_id: user.id,
            event: 'Logout',
            created_at: new Date().toISOString()
          });
      } catch (error) {
        console.error('Error logging sign out:', error);
      }
    }
    await supabase.auth.signOut();
    navigate('/login');
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAdmin,
    isAssociado,
    isEmpresa,
    userRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
