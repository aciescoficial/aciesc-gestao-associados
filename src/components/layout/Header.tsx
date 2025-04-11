
import React from 'react';
import UserProfileMenu from '../auth/UserProfileMenu';

const Header: React.FC = () => {
  return (
    <div className="wp-admin-bar">
      <div className="flex items-center">
        <span>Gestão ACIESC</span>
      </div>
      <div className="flex items-center gap-4">
        <UserProfileMenu />
      </div>
    </div>
  );
};

export default Header;
