
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  tags?: string[];
}

export function useUserSearch(tag?: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase.from('user')
          .select('id, name, email, tags')
          .eq('active', true);
          
        // Filter by tag if provided
        if (tag && tag !== 'todos') {
          query = query.contains('tags', [tag]);
        }
          
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Não foi possível carregar a lista de usuários');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [tag]);
  
  const toggleUser = useCallback((userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  }, []);
  
  return { 
    users, 
    isLoading, 
    selectedUsers, 
    toggleUser,
    setSelectedUsers
  };
}
