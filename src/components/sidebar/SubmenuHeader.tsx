
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
      className="flex items-center justify-center cursor-pointer py-2 text-white hover:bg-aciesc-dark transition-colors rounded-md mx-1"
      onClick={toggleMenu}
    >
      <ChevronDown className="h-4 w-4 text-white" />
      <span className="sr-only">{header}</span>
    </div>
  );
};

export default SubmenuHeader;
