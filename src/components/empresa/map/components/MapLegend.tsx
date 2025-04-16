
import React from 'react';
import { Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { MapLegendProps } from '../types/MapTypes';

/**
 * Map legend showing nicho colors
 */
const MapLegend: React.FC<MapLegendProps> = ({ nichoColors }) => {
  return (
    <div className="absolute bottom-3 left-3 z-10 bg-white bg-opacity-90 p-2 rounded-md shadow-md max-w-[200px]">
      <p className="text-xs font-medium mb-1 flex items-center">
        <Info className="h-3 w-3 mr-1" />
        Legenda
      </p>
      <Separator className="my-1" />
      <div className="space-y-1">
        {Object.entries(nichoColors).slice(0, 6).map(([nicho, color]) => (
          <div key={nicho} className="flex items-center gap-1 text-xs">
            <div style={{ backgroundColor: color }} className="h-2 w-2 rounded-full" />
            <span>{nicho}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
