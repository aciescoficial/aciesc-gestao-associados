
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import MainSidebar from './sidebar/MainSidebar';
import Header from './layout/Header';
import MainContent from './layout/MainContent';

interface LayoutProps {
  children: React.ReactNode;
}

const PluginLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <MainSidebar location={location} />

        <div className="flex-1 flex flex-col">
          <Header />
          <MainContent>
            {children}
          </MainContent>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PluginLayout;
