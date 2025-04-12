
import React from 'react';
import { SidebarGroupContent, SidebarMenu } from '@/components/ui/sidebar';
import SidebarMenuItem from './SidebarMenuItem';
import { LucideIcon } from 'lucide-react';

interface SubmenuItem {
  icon?: LucideIcon;
  label?: string;
  path?: string;
  roles?: string[];
}

interface SubmenuContentProps {
  submenu: SubmenuItem[];
  isExpanded: boolean;
  isActive: (path: string) => boolean;
}

const SubmenuContent: React.FC<SubmenuContentProps> = ({ 
  submenu, 
  isExpanded, 
  isActive 
}) => {
  if (!isExpanded || !submenu || submenu.length === 0) {
    return null;
  }

  return (
    <SidebarGroupContent className="absolute left-full top-0 mt-0 ml-1 bg-aciesc-dark bg-opacity-95 rounded-md py-2 px-2 min-w-[200px] z-50 shadow-lg">
      <SidebarMenu>
        {submenu.map((subItem, index) => (
          <div key={index} className="py-1">
            <a 
              href={subItem.path} 
              className={`flex items-center px-3 py-2 text-white hover:bg-aciesc-primary rounded-md ${isActive(subItem.path!) ? 'bg-aciesc-primary' : ''}`}
            >
              {subItem.icon && <subItem.icon className="h-4 w-4 mr-2" />}
              <span>{subItem.label}</span>
            </a>
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};

export default SubmenuContent;
