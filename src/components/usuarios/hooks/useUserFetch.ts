
import { useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mapFromDbRole } from '../utils/roleUtils';

export const useUserFetch = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get all user profiles from the profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      if (profiles) {
        // Get auth users to get email information
        const { data: authData } = await supabase.auth.admin.listUsers();
        
        // Create a map of auth users by ID for easy lookup
        const authUsers = new Map();
        if (authData?.users) {
          authData.users.forEach(user => {
            authUsers.set(user.id, user);
          });
        }
        
        // Format the profiles into our User type
        const formattedUsers: User[] = profiles.map(profile => {
          // Get corresponding auth user data if available
          const authUser = authUsers.get(profile.id);
          
          return {
            id: profile.id,
            name: profile.name || (authUser?.email?.split('@')[0]) || '',
            email: authUser?.email || '',
            role: mapFromDbRole(profile.role),
            active: true, // Default to active since there's no active field in profiles
            createdAt: profile.created_at ? new Date(profile.created_at) : new Date()
          };
        });
        
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
