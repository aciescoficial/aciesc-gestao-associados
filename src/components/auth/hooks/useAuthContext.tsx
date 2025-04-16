
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserTag } from '@/components/usuarios/types';
import { signIn, signUp, signOut } from '../services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  userTags: UserTag[] | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    data: any;
    error: any;
  }>;
  signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<{
    data: any;
    error: any;
  }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userTags, setUserTags] = useState<UserTag[] | null>(null);

  // Fetch additional user data like role and tags
  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('role, tags')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        console.log('User data fetched:', data);
        setUserRole(data.role as UserRole);
        setUserTags(data.tags as UserTag[]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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

  useEffect(() => {
    // Initial session check
    const initAuth = async () => {
      setLoading(true);
      try {
        // Get current session
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          await fetchUserData(data.session.user.id);
        }
        
        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('Auth state changed:', event);
            setSession(newSession);
            setUser(newSession?.user || null);
            
            if (newSession?.user) {
              // Use setTimeout to avoid potential recursive calls that could deadlock
              setTimeout(() => {
                fetchUserData(newSession.user!.id);
              }, 0);
            } else {
              setUserRole(null);
              setUserTags(null);
            }
          }
        );
        
        setLoading(false);
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    session,
    userRole,
    userTags,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
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
