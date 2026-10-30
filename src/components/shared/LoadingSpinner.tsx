
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  text?: string;
  size?: number | 'small' | 'medium' | 'large';
  centered?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Carregando...', 
  size = 24,
  centered = true,
  className = '' 
}) => {
  // Define sizes in pixels
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32
  };
  
  // Calculate actual size in pixels
  const actualSize = typeof size === 'string' ? sizeMap[size] : size;
  
  const containerClasses = cn(
    'flex flex-col p-4',
    centered ? 'items-center justify-center' : 'items-start',
    className
  );
  
  const spinnerClasses = cn(
    'animate-spin',
    `h-[${actualSize}px] w-[${actualSize}px]`
  );

  return (
    <div className={containerClasses}>
      <Loader2 
        className={spinnerClasses}
        style={{ width: `${actualSize}px`, height: `${actualSize}px` }}
      />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
