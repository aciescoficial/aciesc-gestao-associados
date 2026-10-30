
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useUserTags() {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all unique tags from users
        const { data, error } = await supabase
          .from('user')
          .select('tags')
          .not('tags', 'is', null);
        
        if (error) {
          throw error;
        }
        
        // Extract and deduplicate all tags
        const allTags = data
          .flatMap(user => user.tags || [])
          .filter(Boolean);
          
        const uniqueTags = [...new Set(allTags)];
        
        setTags(uniqueTags);
      } catch (error) {
        console.error('Error fetching user tags:', error);
        toast.error('Não foi possível carregar as tags de usuários');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, []);
  
  return { tags, isLoading };
}
