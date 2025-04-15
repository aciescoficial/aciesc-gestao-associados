
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthContext } from './context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { signIn, signOut, signUp, resetPassword, signInWithGoogle, fetchUserRole } from './services/authService';
import { UserRole, UserTag } from '../usuarios/types';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userTags, setUserTags] = useState<UserTag[]>([]);
  
  // Load user data on mount
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout
          setTimeout(async () => {
            // Fetch user role from database
            const role = await fetchUserRole(session.user.id);
            setUserRole(role as UserRole || 'user');
            
            // Fetch user tags
            try {
              const { data } = await supabase
                .from('user')
                .select('tags')
                .eq('id', session.user.id)
                .single();
                
              // Ensure tags are properly cast to UserTag array
              if (data?.tags && Array.isArray(data.tags)) {
                const validTags = data.tags.filter(tag => 
                  ['corretor', 'corretor_autonomo', 'empresa_conveniada', 'diretoria_aciesc', 
                   'administrador', 'financeiro', 'proprietario_imobiliaria', 'imobiliaria', 'aciesc']
                  .includes(tag)
                ) as UserTag[];
                setUserTags(validTags);
              } else {
                setUserTags([]);
              }
            } catch (error) {
              console.error('Error fetching user tags:', error);
              setUserTags([]);
            }
          }, 0);
        } else {
          setUserRole(null);
          setUserTags([]);
        }
      }
    );
    
    // THEN check for existing session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role from database
          const role = await fetchUserRole(session.user.id);
          setUserRole(role as UserRole || 'user');
          
          // Fetch user tags
          try {
            const { data } = await supabase
              .from('user')
              .select('tags')
              .eq('id', session.user.id)
              .single();
              
            // Ensure tags are properly cast to UserTag array
            if (data?.tags && Array.isArray(data.tags)) {
              const validTags = data.tags.filter(tag => 
                ['corretor', 'corretor_autonomo', 'empresa_conveniada', 'diretoria_aciesc', 
                 'administrador', 'financeiro', 'proprietario_imobiliaria', 'imobiliaria', 'aciesc']
                .includes(tag)
              ) as UserTag[];
              setUserTags(validTags);
            } else {
              setUserTags([]);
            }
          } catch (error) {
            console.error('Error fetching user tags:', error);
            setUserTags([]);
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Check if user is admin
  const isAdmin = userRole === 'admin' || userRole === 'diretoria';
  
  // Check if user has financeiro access
  const hasFinanceiroAccess = isAdmin || userRole === 'financeiro';
  
  const authContextValue = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
    userRole,
    userTags,
    isAdmin,
    hasFinanceiroAccess,
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
