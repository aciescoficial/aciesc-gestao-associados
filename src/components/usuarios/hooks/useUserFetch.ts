
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
        // Get emails from auth data - this needs to be properly typed
        const { data, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
          console.warn("Could not get admin user list, using profiles only:", error);
          
          // If admin API fails, just use profiles data
          const formattedUsers: User[] = profiles.map(profile => ({
            id: profile.id,
            name: profile.name || '',
            email: '', // No email available without admin access
            role: mapFromDbRole(profile.role),
            active: true, // Default to active since there's no active field in profiles
            createdAt: profile.created_at ? new Date(profile.created_at) : new Date()
          }));
          
          setUsers(formattedUsers);
        } else {
          // If we have admin data, create a map for lookups
          const authUsers = new Map<string, any>();
          
          if (data && data.users) {
            data.users.forEach(user => {
              if (user && typeof user === 'object' && 'id' in user) {
                authUsers.set(user.id, user);
              }
            });
          }
          
          // Format the profiles into our User type
          const formattedUsers: User[] = profiles.map(profile => {
            // Get corresponding auth user data if available
            const authUser = authUsers.get(profile.id);
            
            return {
              id: profile.id,
              name: profile.name || (authUser && 'email' in authUser ? authUser.email?.split('@')[0] : '') || '',
              email: authUser && 'email' in authUser ? authUser.email : '',
              role: mapFromDbRole(profile.role),
              active: true, // Default to active since there's no active field in profiles
              createdAt: profile.created_at ? new Date(profile.created_at) : new Date()
            };
          });
          
          setUsers(formattedUsers);
        }
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
