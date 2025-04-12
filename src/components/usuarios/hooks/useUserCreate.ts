
import { useState, useCallback } from 'react';
import { User, UserRole, UserTag } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { mapToDbRole } from '../utils/roleUtils';

export const useUserCreate = (onSuccess: (user: User) => void) => {
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'user' as UserRole,
    tags: [] as UserTag[],
    active: true
  });

  const handleNewUserChange = (field: string, value: any) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const addUser = useCallback(async () => {
    try {
      // Step 1: Create the user in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email!,
        email_confirm: true,
        password: 'temporary-password', // Temporary password, will be changed on first login
        user_metadata: {
          name: newUser.name,
          role: mapToDbRole(newUser.role as UserRole),
          tags: newUser.tags
        }
      });

      if (authError) throw authError;

      // Step 2: Update the profile with role and tags
      if (authData && authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: newUser.name,
            role: mapToDbRole(newUser.role as UserRole),
            tags: newUser.tags || []
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        // Return the created user to the caller
        onSuccess({
          id: authData.user.id,
          name: newUser.name!,
          email: newUser.email!,
          role: newUser.role as UserRole,
          tags: newUser.tags || [],
          active: true,
          createdAt: new Date()
        });

        // Reset the form
        setNewUser({
          name: '',
          email: '',
          role: 'user' as UserRole,
          tags: [] as UserTag[],
          active: true
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating user:", error);
      return false;
    }
  }, [newUser, onSuccess]);

  return {
    newUser,
    handleNewUserChange,
    addUser
  };
};
