
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  SidebarMenuItem as SidebarMenuItemComponent, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';

interface SidebarMenuItemProps {
  icon?: LucideIcon;
  label?: string;
  path?: string;
  isActive: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ 
  icon: Icon, 
  label, 
  path, 
  isActive 
}) => {
  return (
    <SidebarMenuItemComponent>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        tooltip={label}
      >
        <a href={path} className={cn("flex items-center",
          isActive && "text-sidebar-accent-foreground"
        )}>
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          <span>{label}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItemComponent>
  );
};

export default SidebarMenuItem;
