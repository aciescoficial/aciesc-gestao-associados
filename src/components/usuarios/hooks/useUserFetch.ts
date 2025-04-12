
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
        user.email.toLowerCase().includes(normalizedSearch) ||
        (user.associado_cpf && user.associado_cpf.toLowerCase().includes(normalizedSearch)) ||
        (user.empresa_cnpj && user.empresa_cnpj.toLowerCase().includes(normalizedSearch))
    );
  }, [users, searchTerm]);

  // Fetch all users from the database
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching users from database...');
      
      // First try to use the RPC function that returns auth users
      let authUsers: { id: string; email: string }[] = [];
      try {
        const { data: authUsersData, error: authError } = await supabase.rpc('get_auth_users');
        if (authError) {
          console.warn('Could not fetch auth users via RPC:', authError);
        } else if (authUsersData) {
          authUsers = authUsersData;
          console.log('Auth users fetched via RPC:', authUsers.length);
        }
      } catch (err) {
        console.warn('Error in RPC call for auth users:', err);
      }
      
      // Fetch profiles with role information and join with associados and empresas
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          associado:associado_id(cpf),
          empresa:empresa_id(cnpj)
        `);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      console.log('Profiles fetched:', profiles?.length || 0);

      if (!profiles) {
        setUsers([]);
        return;
      }

      // Map profiles to User objects and fill in email from auth users if available
      const mappedUsers: User[] = profiles.map(profile => {
        // Try to find matching auth user email
        let email = profile.email || '';
        const matchingAuthUser = authUsers.find(au => au.id === profile.id);
        if (matchingAuthUser && matchingAuthUser.email) {
          email = matchingAuthUser.email;
        }

        // Convert string[] to UserTag[] by filtering to only valid UserTag values
        const validUserTags = Array.isArray(profile.tags) ? profile.tags.filter(tag => 
          ['corretor', 'corretor_autonomo', 'empresa_conveniada', 'diretoria_aciesc', 
           'administrador', 'financeiro', 'proprietario_imobiliaria', 'imobiliaria', 'aciesc'].includes(tag)
        ) as UserTag[] : [];
        
        return {
          id: profile.id,
          name: profile.name || '',
          email: email,  
          role: mapFromDbRole(profile.role),
          tags: validUserTags,
          active: profile.active !== false, // Default to true if not specified
          createdAt: new Date(profile.created_at),
          associado_id: profile.associado_id || undefined,
          associado_cpf: profile.associado?.cpf || undefined,
          empresa_id: profile.empresa_id || undefined,
          empresa_cnpj: profile.empresa?.cnpj || undefined
        };
      });

      console.log('Mapped users:', mappedUsers.length);
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
    console.log('useUserFetch hook mounted, fetching users...');
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
