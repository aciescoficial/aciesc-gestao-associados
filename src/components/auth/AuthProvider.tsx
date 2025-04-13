
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
  const [userRole, setUserRole] = useState<UserRole | null>('admin');
  const [userTags, setUserTags] = useState<UserTag[]>(['administrador', 'financeiro']);
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
          // Always set admin role regardless of what's in the database
          setUserRole('admin');
          setUserTags(['administrador', 'financeiro']);
        } else {
          setUser(null);
          // Default to admin role and tags even when not logged in
          setUserRole('admin');
          setUserTags(['administrador', 'financeiro']);
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
          // Always set admin role regardless of what's retrieved
          setUserRole('admin');
          setUserTags(['administrador', 'financeiro']);
        } else {
          setUser(null);
          // Default to admin role and tags even when not logged in
          setUserRole('admin');
          setUserTags(['administrador', 'financeiro']);
        }
      }
    );
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Always set isAdmin to true
  const isAdmin = true;
  
  // Always set hasFinanceiroAccess to true
  const hasFinanceiroAccess = true;
  
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
