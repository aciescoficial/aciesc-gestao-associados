
import { useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole, UserTag } from '../usuarios/types';
import { AuthContext } from './context/AuthContext';
import { fetchUserRole, signIn, signInWithGoogle, signUp, resetPassword, signOut } from './services/authService';

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
          const { userRole, userTags } = await fetchUserRole(session.user.id);
          setUserRole(userRole);
          setUserTags(userTags);
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
          const { userRole, userTags } = await fetchUserRole(session.user.id);
          setUserRole(userRole);
          setUserTags(userTags);
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
      signInWithGoogle,
      userRole,
      userTags,
      isAdmin,
      hasFinanceiroAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Re-export the useAuth hook
export { useAuth } from './hooks/useAuthContext';
