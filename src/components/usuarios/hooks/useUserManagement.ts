
import { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mapToDbRole, mapFromDbRole } from '../utils/roleUtils';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as UserRole,
    password: ''
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

  const handleNewUserChange = (field: string, value: string) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectedUserChange = (field: string, value: any) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [field]: value });
    }
  };

  const addUser = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            name: newUser.name,
            role: mapToDbRole(newUser.role),
          }
        }
      });

      if (authError) throw authError;
      
      if (authData && authData.user) {
        const createdUser: User = {
          id: authData.user.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          active: true,
          createdAt: new Date()
        };
        
        setUsers([...users, createdUser]);
        setIsAddUserDialogOpen(false);
        setNewUser({
          name: '',
          email: '',
          role: 'user',
          password: ''
        });
        
        toast({
          title: "Usuário criado",
          description: `O usuário ${createdUser.name} foi criado com sucesso.`
        });
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Erro ao criar usuário",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "Não foi possível criar o usuário.",
        variant: "destructive"
      });
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: selectedUser.name,
          role: mapToDbRole(selectedUser.role) as any
        })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      );
      
      setUsers(updatedUsers);
      setIsEditUserDialogOpen(false);
      setSelectedUser(null);
      
      toast({
        title: "Usuário atualizado",
        description: `O usuário ${selectedUser.name} foi atualizado com sucesso.`
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Não foi possível atualizar o usuário.",
        variant: "destructive"
      });
    }
  };

  const toggleUserActive = async (userId: string, active: boolean) => {
    try {
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, active } : user
      );
      
      setUsers(updatedUsers);
      
      toast({
        title: active ? "Usuário ativado" : "Usuário desativado",
        description: `O usuário foi ${active ? "ativado" : "desativado"} com sucesso.`
      });
    } catch (error) {
      console.error("Error toggling user active status:", error);
      toast({
        title: "Erro ao atualizar status do usuário",
        description: "Não foi possível atualizar o status do usuário.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    filteredUsers,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    selectedUser,
    setSelectedUser,
    newUser,
    handleNewUserChange,
    handleSelectedUserChange,
    addUser,
    updateUser,
    toggleUserActive,
    fetchUsers
  };
};
