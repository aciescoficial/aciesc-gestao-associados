
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, UserTag } from '../types';
import { mapFromDbRole } from '../utils/roleUtils';

export const useUserFetch = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    
    const normalizedSearch = searchTerm.toLowerCase();
    return users.filter(
      user => 
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch)
    );
  }, [users, searchTerm]);

  // Fetch all users from the database
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch profiles with role information
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Map profiles to User objects
      const mappedUsers: User[] = profiles.map(profile => ({
        id: profile.id,
        name: profile.name || '',
        email: profile.email || '',  
        role: mapFromDbRole(profile.role),
        tags: profile.tags || [],
        active: profile.active !== false, // Default to true if not specified
        createdAt: new Date(profile.created_at)
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredUsers,
    fetchUsers
  };
};
