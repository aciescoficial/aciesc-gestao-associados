
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
              console.log("Fetching user data for:", session.user.id);
              
              // Fetch user data from the user table
              const { data, error } = await supabase
                .from('user')
                .select('role, tags, active, id')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error("Error fetching user data:", error);
                setUserRole('user');
                setUserTags([]);
                return;
              }
              
              console.log("User data fetched:", data);
              
              if (data) {
                setUserRole(data.role as UserRole || 'user');
                
                // Ensure tags are properly cast to UserTag array
                if (data.tags && Array.isArray(data.tags)) {
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
              }
            } catch (error) {
              console.error("Error in auth state change handler:", error);
              setUserRole('user');
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
        console.log("Checking for existing session");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Existing session:", session ? "found" : "not found");
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user data from database
          try {
            console.log("Fetching user data for existing session:", session.user.id);
            
            const { data, error } = await supabase
              .from('user')
              .select('role, tags, active')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error("Error fetching user data for existing session:", error);
              setUserRole('user');
              setUserTags([]);
              return;
            }
            
            console.log("User data for existing session:", data);
            
            if (data) {
              setUserRole(data.role as UserRole || 'user');
              
              // Ensure tags are properly cast to UserTag array
              if (data.tags && Array.isArray(data.tags)) {
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
            }
          } catch (error) {
            console.error("Error fetching user data for existing session:", error);
            setUserRole('user');
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
      console.log("Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, []);
  
  // Check if user is admin or has the diretoria role
  const isAdmin = userRole === 'admin' || userRole === 'diretoria';
  
  // Check if user has financeiro access
  const hasFinanceiroAccess = isAdmin || 
    userTags.some(tag => tag === 'financeiro') || 
    userRole === 'diretoria';
  
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
