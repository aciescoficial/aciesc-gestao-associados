
import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = React.memo(({ children }) => {
  return (
    <main className="flex-1 p-6 bg-gray-100 overflow-auto">
      <div className="max-w-full mx-auto">
        {children}
      </div>
    </main>
  );
});

// Add display name for React DevTools
MainContent.displayName = 'MainContent';

export default MainContent;
