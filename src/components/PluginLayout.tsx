
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import MainSidebar from './sidebar/MainSidebar';
import Header from './layout/Header';
import MainContent from './layout/MainContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { TooltipProvider } from './ui/tooltip';

interface LayoutProps {
  children: React.ReactNode;
}

const PluginLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={!isMobile} defaultCollapsed={!isMobile}>
        <div className="flex min-h-screen w-full flex-col bg-gray-50">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <MainSidebar location={location} />
            <MainContent>
              {children}
            </MainContent>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default PluginLayout;
