
import React from 'react';
import UserProfileMenu from '../auth/UserProfileMenu';

const Header: React.FC = () => {
  return (
    <div className="bg-aciesc-primary text-white py-3 px-6 flex justify-between items-center shadow-sm">
      <div className="flex items-center">
        <span className="text-lg font-medium">Gestão ACIESC</span>
      </div>
      <div className="flex items-center gap-4">
        <UserProfileMenu />
      </div>
    </div>
  );
};

export default Header;
