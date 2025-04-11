
import { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mapFromDbRole } from '../utils/roleUtils';

export interface UserFilters {
  searchTerm: string;
  role: UserRole | 'all';
  activeStatus: 'all' | 'active' | 'inactive';
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

export const useUserFetch = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: '',
    role: 'all',
    activeStatus: 'all',
    dateRange: {
      from: null,
      to: null
    }
  });
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

  const updateFilters = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filteredUsers = users.filter(user => {
    // Filter by search term
    const matchesSearchTerm = 
      filters.searchTerm === '' || 
      (user.name && user.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    
    // Filter by role
    const matchesRole = 
      filters.role === 'all' || 
      user.role === filters.role;
    
    // Filter by active status
    const matchesActiveStatus = 
      filters.activeStatus === 'all' || 
      (filters.activeStatus === 'active' && user.active) ||
      (filters.activeStatus === 'inactive' && !user.active);
    
    // Filter by date range
    const matchesDateRange = 
      (!filters.dateRange.from || user.createdAt >= filters.dateRange.from) && 
      (!filters.dateRange.to || user.createdAt <= filters.dateRange.to);

    return matchesSearchTerm && matchesRole && matchesActiveStatus && matchesDateRange;
  });

  return {
    users,
    filteredUsers,
    loading,
    filters,
    updateFilters,
    fetchUsers
  };
};
