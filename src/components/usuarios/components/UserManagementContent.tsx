
import React from 'react';
import { User, UserRole } from '../types';
import UserSearch from './UserSearch';
import ConnectionAlert from './ConnectionAlert';
import UserListSkeleton from './UserListSkeleton';
import EmptyUserState from './EmptyUserState';
import UserList from './UserList';
import { getRoleBadgeColor, getRoleLabel } from '../utils/roleUtils';

interface UserManagementContentProps {
  loading: boolean;
  error: Error | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  roleFilter: UserRole | 'all';
  setRoleFilter: (role: UserRole | 'all') => void;
  filteredUsers: User[];
  connectionStatus: boolean | null;
  handleRefresh: () => void;
  handleEdit: (user: User) => void;
  handleToggleActive: (userId: string, active: boolean) => void;
  handleChangePassword: (user: User) => void;
  handleDelete: (user: User) => void;
  isMobile: boolean;
}

const UserManagementContent: React.FC<UserManagementContentProps> = ({
  loading,
  error,
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  filteredUsers,
  connectionStatus,
  handleRefresh,
  handleEdit,
  handleToggleActive,
  handleChangePassword,
  handleDelete,
  isMobile,
}) => {
  return (
    <div className="wp-card space-y-4">
      <ConnectionAlert 
        connectionStatus={connectionStatus} 
        error={error} 
        handleRefresh={handleRefresh} 
      />

      <UserSearch 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        loading={loading}
      />

      {loading && filteredUsers.length === 0 ? (
        <UserListSkeleton />
      ) : (
        <>
          {!loading && filteredUsers.length === 0 ? (
            <EmptyUserState searchTerm={searchTerm} />
          ) : (
            <UserList 
              loading={loading}
              filteredUsers={filteredUsers}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              onChangePassword={handleChangePassword}
              onDelete={handleDelete}
              getRoleBadgeColor={getRoleBadgeColor}
              getRoleLabel={getRoleLabel}
              isMobile={isMobile}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserManagementContent;
