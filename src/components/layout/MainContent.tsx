
import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="flex-1 p-6 bg-wp-body overflow-auto">
      <div className="wp-container">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
