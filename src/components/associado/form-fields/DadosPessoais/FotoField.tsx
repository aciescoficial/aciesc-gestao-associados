
import React from 'react';
import { FotoUpload } from '../../FotoUpload';

interface FotoFieldProps {
  fotoPreview: string | null;
  onFotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFotoRemove: () => void;
  register: any;
}

export const FotoField: React.FC<FotoFieldProps> = ({ 
  fotoPreview, 
  onFotoUpload, 
  onFotoRemove, 
  register 
}) => {
  return (
    <div className="w-32">
      <FotoUpload 
        fotoPreview={fotoPreview}
        onUpload={onFotoUpload}
        onRemove={onFotoRemove}
        register={register}
      />
    </div>
  );
};
