
import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-auto">
      <div className="max-w-full mx-auto">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
