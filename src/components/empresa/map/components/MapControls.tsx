
import React from 'react';
import { Button } from '@/components/ui/button';
import { Compass, Plus, Minus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapControlProps } from '../types/MapTypes';

/**
 * Location button that triggers geolocation functionality
 */
export const LocationButton: React.FC<MapControlProps> = ({ onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 shadow-md bg-white"
            onClick={onClick}
          >
            <Compass size={16} className="text-blue-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Minha localização</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * Zoom controls for the map
 */
export const ZoomControls: React.FC<{
  onZoomIn: () => void;
  onZoomOut: () => void;
}> = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="flex flex-col gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full shadow-md"
              onClick={onZoomIn}
            >
              <Plus size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Aumentar zoom</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full shadow-md"
              onClick={onZoomOut}
            >
              <Minus size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Diminuir zoom</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
