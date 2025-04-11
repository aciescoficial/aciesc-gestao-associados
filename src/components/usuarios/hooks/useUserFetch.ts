
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
      // Fetch all auth users - this requires admin rights
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select('*');
      
      if (authError) throw authError;
      
      if (authUsers && authUsers.length > 0) {
        // Format users from profiles
        const formattedUsers: User[] = authUsers.map(profile => {
          return {
            id: profile.id,
            name: profile.name || '',
            email: '', // We'll need to populate this separately or through a join
            role: mapFromDbRole(profile.role),
            active: true, // Default to active
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
