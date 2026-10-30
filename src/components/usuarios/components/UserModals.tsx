
import React from 'react';
import { User } from '../types';
import DeleteUserDialog from './DeleteUserDialog';
import UserPasswordChangeModal from './UserPasswordChangeModal';

interface UserModalsProps {
  selectedUser: User | null;
  isPasswordDialogOpen: boolean;
  setIsPasswordDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  deleteUser: (userId: string, deleteAssociado: boolean) => Promise<boolean>;
  onDeleteSuccess: () => void;
}

const UserModals: React.FC<UserModalsProps> = ({
  selectedUser,
  isPasswordDialogOpen,
  setIsPasswordDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  deleteUser,
  onDeleteSuccess
}) => {
  return (
    <>
      {selectedUser && (
        <>
          <UserPasswordChangeModal
            isOpen={isPasswordDialogOpen}
            onOpenChange={setIsPasswordDialogOpen}
            userId={selectedUser.id}
            userEmail={selectedUser.email}
          />
          
          <DeleteUserDialog
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
            selectedUser={selectedUser}
            onSuccess={onDeleteSuccess}
            deleteUser={deleteUser}
          />
        </>
      )}
    </>
  );
};

export default UserModals;
