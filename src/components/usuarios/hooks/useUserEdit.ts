
import { useState, useCallback } from 'react';
import { User, UserRole, UserTag } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { mapToDbRole } from '../utils/roleUtils';

export const useUserEdit = (onSuccess: (user: User) => void) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSelectedUserChange = (field: string, value: any) => {
    if (!selectedUser) return;
    setSelectedUser({ ...selectedUser, [field]: value });
  };

  const updateUser = useCallback(async () => {
    if (!selectedUser) return false;

    try {
      // Update the user's metadata and profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: selectedUser.name,
          role: mapToDbRole(selectedUser.role),
          tags: selectedUser.tags || []
        })
        .eq('id', selectedUser.id);

      if (profileError) throw profileError;

      onSuccess(selectedUser);
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  }, [selectedUser, onSuccess]);

  const toggleUserActive = useCallback(async (userId: string, active: boolean) => {
    try {
      // Toggle user active status in auth.users
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId, 
        { user_metadata: { active } }
      );

      if (authError) throw authError;

      return true;
    } catch (error) {
      console.error("Error toggling user active status:", error);
      return false;
    }
  }, []);

  return {
    selectedUser,
    setSelectedUser,
    handleSelectedUserChange,
    updateUser,
    toggleUserActive
  };
};
