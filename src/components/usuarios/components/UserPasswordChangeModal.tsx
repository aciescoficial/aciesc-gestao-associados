
import React from "react";
import ChangePasswordModal from "./ChangePasswordModal";

interface UserPasswordChangeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userId: string;
  userEmail: string;
}

const UserPasswordChangeModal: React.FC<UserPasswordChangeModalProps> = ({
  isOpen,
  onOpenChange,
  userId,
  userEmail
}) => {
  return (
    <ChangePasswordModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      userId={userId}
      userEmail={userEmail}
    />
  );
};

export default UserPasswordChangeModal;
