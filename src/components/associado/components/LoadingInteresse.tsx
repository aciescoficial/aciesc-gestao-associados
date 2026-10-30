
import React from 'react';
import { RefreshCcw } from 'lucide-react';

const LoadingInteresse = () => {
  return (
    <div className="flex justify-center p-8">
      <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
};

export default LoadingInteresse;

