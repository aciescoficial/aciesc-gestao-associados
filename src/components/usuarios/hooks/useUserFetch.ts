
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
      // Use a simpler query to avoid potential RLS issues
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      if (authUsers && authUsers.users) {
        // Get profiles to supplement auth user data
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*');

        // Create a map of profile data by user ID for easy lookup
        const profileMap = new Map();
        if (profiles) {
          profiles.forEach(profile => {
            profileMap.set(profile.id, profile);
          });
        }
        
        const formattedUsers: User[] = authUsers.users.map(authUser => {
          const profile = profileMap.get(authUser.id);
          const role = profile ? mapFromDbRole(profile.role) : 'user';
          
          return {
            id: authUser.id,
            name: profile?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
            email: authUser.email || '',
            role: role,
            active: !authUser.banned_until,
            createdAt: new Date(authUser.created_at)
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
