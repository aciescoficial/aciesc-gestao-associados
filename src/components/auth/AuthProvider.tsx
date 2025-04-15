
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthContext } from './context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { signIn, signOut, signUp, resetPassword, signInWithGoogle, fetchUserRole } from './services/authService';
import { UserRole, UserTag } from '../usuarios/types';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userTags, setUserTags] = useState<UserTag[]>([]);
  
  // Load user data on mount
  useEffect(() => {
    console.log("AuthProvider mounted");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout
          setTimeout(async () => {
            try {
              // Fetch user role from database
              const role = await fetchUserRole(session.user.id);
              console.log("Fetched role:", role);
              setUserRole(role as UserRole || 'user');
              
              // Fetch user tags
              try {
                const { data, error } = await supabase
                  .from('user')
                  .select('tags')
                  .eq('id', session.user.id)
                  .single();
                  
                if (error) {
                  console.error("Error fetching user tags:", error);
                  setUserTags([]);
                  return;
                }
                
                // Ensure tags are properly cast to UserTag array
                if (data?.tags && Array.isArray(data.tags)) {
                  const validTags = data.tags.filter(tag => 
                    ['corretor', 'corretor_autonomo', 'empresa_conveniada', 'diretoria_aciesc', 
                     'administrador', 'financeiro', 'proprietario_imobiliaria', 'imobiliaria', 'aciesc']
                    .includes(tag)
                  ) as UserTag[];
                  console.log("Fetched tags:", validTags);
                  setUserTags(validTags);
                } else {
                  console.log("No tags found or invalid tags format");
                  setUserTags([]);
                }
              } catch (error) {
                console.error('Error fetching user tags:', error);
                setUserTags([]);
              }
            } catch (error) {
              console.error("Error in auth state change handler:", error);
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
        console.log("Checking for existing session");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Existing session:", session ? "found" : "not found");
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role from database
          try {
            const role = await fetchUserRole(session.user.id);
            console.log("Fetched role for existing session:", role);
            setUserRole(role as UserRole || 'user');
            
            // Fetch user tags
            try {
              const { data, error } = await supabase
                .from('user')
                .select('tags')
                .eq('id', session.user.id)
                .single();
                
              if (error) {
                console.error("Error fetching user tags for existing session:", error);
                setUserTags([]);
                return;
              }
                
              // Ensure tags are properly cast to UserTag array
              if (data?.tags && Array.isArray(data.tags)) {
                const validTags = data.tags.filter(tag => 
                  ['corretor', 'corretor_autonomo', 'empresa_conveniada', 'diretoria_aciesc', 
                   'administrador', 'financeiro', 'proprietario_imobiliaria', 'imobiliaria', 'aciesc']
                  .includes(tag)
                ) as UserTag[];
                console.log("Fetched tags for existing session:", validTags);
                setUserTags(validTags);
              } else {
                console.log("No tags found or invalid tags format for existing session");
                setUserTags([]);
              }
            } catch (error) {
              console.error('Error fetching user tags for existing session:', error);
              setUserTags([]);
            }
          } catch (error) {
            console.error("Error fetching user role for existing session:", error);
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
      console.log("Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, []);
  
  // Check if user is admin
  const isAdmin = userRole === 'admin' || userRole === 'diretoria' as UserRole;
  
  // Check if user has financeiro access
  const hasFinanceiroAccess = isAdmin || 
    userTags.some(tag => tag === 'financeiro') || 
    userRole === 'diretoria' as UserRole;
  
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
