
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FilterBarProps } from '../types/MapTypes';
import { nichoColors } from '../constants/colorScheme';

/**
 * Filter bar component for filtering companies by nicho
 */
const FilterBar: React.FC<FilterBarProps> = ({ 
  uniqueNichos, 
  activeNichoFilters, 
  toggleNichoFilter 
}) => {
  return (
    <div className="absolute top-3 left-16 right-3 z-10 flex flex-wrap gap-1 bg-white bg-opacity-90 p-2 rounded-md shadow-md max-w-full overflow-x-auto">
      {uniqueNichos.map(nicho => {
        const isActive = activeNichoFilters.includes(nicho);
        const nichoColor = nichoColors[nicho] || '#9E9E9E';
        
        return (
          <Badge 
            key={nicho}
            variant={isActive ? "default" : "outline"}
            style={{
              backgroundColor: isActive ? nichoColor : 'transparent',
              borderColor: nichoColor,
              color: isActive ? 'white' : nichoColor,
              cursor: 'pointer'
            }}
            onClick={() => toggleNichoFilter(nicho)}
            className="transition-all duration-200 hover:opacity-80"
          >
            {nicho}
          </Badge>
        );
      })}
    </div>
  );
};

export default FilterBar;
