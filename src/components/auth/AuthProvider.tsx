
import { useState, useEffect, useCallback } from 'react';
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
  
  // Function to fetch user data from the database
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      console.log("Fetching user data for:", userId);
      
      const { data, error } = await supabase
        .from('user')
        .select('role, tags, active, id')
        .eq('id', userId)
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
        
        // Process user tags
        processUserTags(data.tags);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      setUserRole('user');
      setUserTags([]);
    }
  }, []);

  // Function to process user tags from database
  const processUserTags = useCallback((tags: string[] | null) => {
    // Ensure tags are properly cast to UserTag array
    if (tags && Array.isArray(tags)) {
      const validTags = tags.filter(tag => 
        ['corretor', 'corretor_autonomo', 'empresa_conveniada', 'diretoria_aciesc', 
          'administrador', 'financeiro', 'proprietario_imobiliaria', 'imobiliaria', 'aciesc']
        .includes(tag)
      ) as UserTag[];
      
      console.log("Processed tags:", validTags);
      setUserTags(validTags);
    } else {
      console.log("No tags found or invalid tags format");
      setUserTags([]);
    }
  }, []);

  // Handle auth state change
  const handleAuthStateChange = useCallback((event: string, currentSession: Session | null) => {
    console.log("Auth state change:", event);
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    
    if (currentSession?.user) {
      // Defer Supabase calls with setTimeout
      setTimeout(() => {
        fetchUserData(currentSession.user.id);
      }, 0);
    } else {
      setUserRole(null);
      setUserTags([]);
    }
  }, [fetchUserData]);

  // Initialize session on component mount
  const initializeSession = useCallback(async () => {
    try {
      console.log("Checking for existing session");
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      console.log("Existing session:", existingSession ? "found" : "not found");
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        await fetchUserData(existingSession.user.id);
      }
    } catch (error) {
      console.error('Error checking auth session:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchUserData]);
  
  // Set up auth state listener
  useEffect(() => {
    console.log("AuthProvider mounted");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    
    // Initialize session
    initializeSession();
    
    // Cleanup subscription on unmount
    return () => {
      console.log("Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange, initializeSession]);
  
  // Derived state for user permissions
  const isAdmin = userRole === 'admin' || userRole === 'diretoria';
  
  const hasFinanceiroAccess = isAdmin || 
    userTags.some(tag => tag === 'financeiro') || 
    userRole === 'diretoria';
  
  // Prepare context value
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
