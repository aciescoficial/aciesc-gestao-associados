
import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mapFromDbRole } from '../utils/roleUtils';

export const useUserFetch = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch profiles data
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;

      // If we have profiles data, format it
      if (profilesData && profilesData.length > 0) {
        // Get user emails from auth.users if possible (requires admin rights)
        let authUsers: {id: string, email: string}[] = [];
        try {
          // Try to get user emails from auth schema - might fail due to permissions
          const { data, error } = await supabase
            .rpc('get_auth_users');
          
          if (!error && data) {
            authUsers = data as {id: string, email: string}[];
          }
        } catch (error) {
          console.warn("Could not fetch auth users data. Continuing with profiles only.", error);
        }
        
        // Map auth users to a dictionary for faster lookups
        const authUsersDict = authUsers.reduce((dict, user) => {
          dict[user.id] = user.email;
          return dict;
        }, {} as Record<string, string>);
        
        // Format users from profiles
        const formattedUsers: User[] = profilesData.map(profile => {
          return {
            id: profile.id,
            name: profile.name || '',
            email: authUsersDict[profile.id] || '', // Get email from dictionary if available
            role: mapFromDbRole(profile.role),
            active: true, // Default to active since this isn't in the database
            createdAt: profile.created_at ? new Date(profile.created_at) : new Date()
          };
        });
        
        setUsers(formattedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      
      toast({
        title: "Erro ao carregar usuários",
        description: errorMessage,
        variant: "destructive"
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return {
    users,
    filteredUsers,
    loading,
    searchTerm, 
    setSearchTerm,
    fetchUsers
  };
};
