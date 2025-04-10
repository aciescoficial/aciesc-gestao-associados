
import React, { useState } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EmpresaFormData } from './EmpresaForm';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';

interface EmpresaImageUploadProps {
  register: UseFormRegister<EmpresaFormData>;
  errors: FieldErrors<EmpresaFormData>;
  setValue: (name: any, value: any) => void;
  defaultLogoUrl?: string;
  defaultCapaUrl?: string;
}

const EmpresaImageUpload: React.FC<EmpresaImageUploadProps> = ({ 
  register, 
  errors, 
  setValue, 
  defaultLogoUrl,
  defaultCapaUrl 
}) => {
  const { toast } = useToast();
  const [logoUploading, setLogoUploading] = useState(false);
  const [capaUploading, setCapaUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(defaultLogoUrl || null);
  const [capaPreview, setCapaPreview] = useState<string | null>(defaultCapaUrl || null);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate image dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      
      if (img.width !== 200 || img.height !== 200) {
        toast({
          title: "Tamanho inválido",
          description: "A imagem do logo deve ter 200px x 200px.",
          variant: "destructive",
        });
        return;
      }

      setLogoUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `logo_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('empresas')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase
          .storage
          .from('empresas')
          .getPublicUrl(fileName);
          
        setLogoPreview(data.publicUrl);
        setValue('logoUrl', data.publicUrl);
        
        toast({
          title: "Sucesso!",
          description: "Logo carregado com sucesso.",
        });
      } catch (error: any) {
        console.error("Error uploading logo:", error);
        toast({
          title: "Erro no upload",
          description: error.message || "Ocorreu um erro ao fazer o upload do logo.",
          variant: "destructive",
        });
      } finally {
        setLogoUploading(false);
      }
    };
    
    img.src = objectUrl;
  };

  const handleCapaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate image dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      
      if (img.width !== 851 || img.height !== 315) {
        toast({
          title: "Tamanho inválido",
          description: "A imagem de capa deve ter 851px x 315px.",
          variant: "destructive",
        });
        return;
      }

      setCapaUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `capa_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('empresas')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase
          .storage
          .from('empresas')
          .getPublicUrl(fileName);
          
        setCapaPreview(data.publicUrl);
        setValue('capaUrl', data.publicUrl);
        
        toast({
          title: "Sucesso!",
          description: "Imagem de capa carregada com sucesso.",
        });
      } catch (error: any) {
        console.error("Error uploading cover image:", error);
        toast({
          title: "Erro no upload",
          description: error.message || "Ocorreu um erro ao fazer o upload da capa.",
          variant: "destructive",
        });
      } finally {
        setCapaUploading(false);
      }
    };
    
    img.src = objectUrl;
  };

  const clearLogoPreview = () => {
    setLogoPreview(null);
    setValue('logoUrl', '');
  };

  const clearCapaPreview = () => {
    setCapaPreview(null);
    setValue('capaUrl', '');
  };

  return (
    <div className="space-y-4 md:col-span-2">
      <h3 className="text-lg font-medium">Imagens da Empresa</h3>
      
      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Logo (200px x 200px)</label>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="logo-upload"
                className="sr-only"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={logoUploading}
              />
              <label
                htmlFor="logo-upload"
                className={`wp-button-secondary flex items-center gap-2 ${logoUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {logoUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Escolher Logo
                  </>
                )}
              </label>
              <input 
                type="hidden" 
                {...register('logoUrl')}
              />
            </div>
          </div>
          
          {logoPreview && (
            <div className="relative">
              <img 
                src={logoPreview} 
                alt="Logo Preview" 
                className="w-16 h-16 border rounded object-contain bg-white"
              />
              <button 
                type="button" 
                onClick={clearLogoPreview}
                className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">Tamanho exato: 200px x 200px.</p>
      </div>
      
      {/* Cover Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Imagem de Capa (851px x 315px)</label>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="capa-upload"
                className="sr-only"
                accept="image/*"
                onChange={handleCapaUpload}
                disabled={capaUploading}
              />
              <label
                htmlFor="capa-upload"
                className={`wp-button-secondary flex items-center gap-2 ${capaUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {capaUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Escolher Capa
                  </>
                )}
              </label>
              <input 
                type="hidden" 
                {...register('capaUrl')}
              />
            </div>
          </div>
          
          {capaPreview && (
            <div className="relative">
              <img 
                src={capaPreview} 
                alt="Cover Preview" 
                className="h-16 border rounded object-contain bg-white"
              />
              <button 
                type="button" 
                onClick={clearCapaPreview}
                className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">Tamanho exato: 851px x 315px (formato Facebook).</p>
      </div>
      
      {/* YouTube Video Link */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Vídeo de Apresentação (Link do YouTube)</label>
        <input
          type="url"
          className={`wp-input w-full ${errors.videoUrl ? 'border-wp-error' : ''}`}
          placeholder="https://www.youtube.com/watch?v=..."
          {...register('videoUrl')}
        />
        {errors.videoUrl && <p className="text-wp-error text-sm">{errors.videoUrl.message}</p>}
        <p className="text-xs text-gray-500">Cole aqui a URL completa do vídeo no YouTube.</p>
      </div>
    </div>
  );
};

export default EmpresaImageUpload;
