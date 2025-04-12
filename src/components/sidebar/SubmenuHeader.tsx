
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SidebarGroupLabel } from '@/components/ui/sidebar';

interface SubmenuHeaderProps {
  header: string;
  isExpanded: boolean;
  toggleMenu: () => void;
}

const SubmenuHeader: React.FC<SubmenuHeaderProps> = ({ 
  header, 
  isExpanded, 
  toggleMenu 
}) => {
  return (
    <div 
      className="flex items-center justify-between cursor-pointer py-2 px-4 text-white hover:bg-aciesc-dark transition-colors"
      onClick={toggleMenu}
    >
      <SidebarGroupLabel className="text-white text-sm">{header}</SidebarGroupLabel>
      {isExpanded ? (
        <ChevronDown className="h-4 w-4 text-white" />
      ) : (
        <ChevronRight className="h-4 w-4 text-white" />
      )}
    </div>
  );
};

export default SubmenuHeader;
