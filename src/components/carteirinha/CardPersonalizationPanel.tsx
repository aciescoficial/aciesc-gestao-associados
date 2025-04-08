
import React, { useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardSettings } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ImageUp } from 'lucide-react';

interface CardPersonalizationPanelProps {
  cardSettings: CardSettings;
  updateCardSetting: <K extends keyof CardSettings>(key: K, value: CardSettings[K]) => void;
}

const CardPersonalizationPanel: React.FC<CardPersonalizationPanelProps> = ({ 
  cardSettings,
  updateCardSetting
}) => {
  const frontFileInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);
  
  const fontOptions = [
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Courier New, monospace', label: 'Courier New' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Impact, sans-serif', label: 'Impact' }
  ];

  const handleFrontImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCardSetting('frontBackgroundImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCardSetting('backBackgroundImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Personalizar Carteirinha</h3>
      
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="colors">Cores</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="background">Imagens de Fundo</TabsTrigger>
          <TabsTrigger value="positioning">Posicionamento</TabsTrigger>
          <TabsTrigger value="fonts">Fonte e Textos</TabsTrigger>
        </TabsList>
        
        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Label className="block text-sm font-medium mb-1">Cor Primária</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="color" 
                    value={cardSettings.primaryColor} 
                    onChange={(e) => updateCardSetting('primaryColor', e.target.value)} 
                    className="h-8 w-12 border-0 p-0"
                  />
                  <span className="text-sm">{cardSettings.primaryColor}</span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium mb-1">Cor Secundária</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="color" 
                    value={cardSettings.secondaryColor} 
                    onChange={(e) => updateCardSetting('secondaryColor', e.target.value)} 
                    className="h-8 w-12 border-0 p-0"
                  />
                  <span className="text-sm">{cardSettings.secondaryColor}</span>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium mb-1">Cor do Texto</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="color" 
                    value={cardSettings.textColor || '#FFFFFF'} 
                    onChange={(e) => updateCardSetting('textColor', e.target.value)} 
                    className="h-8 w-12 border-0 p-0"
                  />
                  <span className="text-sm">{cardSettings.textColor || '#FFFFFF'}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-medium">Mostrar CPF</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" 
                  checked={cardSettings.showCPF} 
                  onChange={(e) => updateCardSetting('showCPF', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-medium">Mostrar CRECI</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" 
                  checked={cardSettings.showCreci} 
                  onChange={(e) => updateCardSetting('showCreci', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mostrar QR Code</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" 
                  checked={cardSettings.showQRCode} 
                  onChange={(e) => updateCardSetting('showQRCode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium">Posição do Logo</span>
              <select 
                value={cardSettings.logoPosition}
                onChange={(e) => updateCardSetting('logoPosition', e.target.value as 'top' | 'bottom')}
                className="border rounded p-2"
              >
                <option value="top">Topo</option>
                <option value="bottom">Base</option>
              </select>
            </div>
          </div>
        </TabsContent>
        
        {/* Background Images Tab */}
        <TabsContent value="background" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="block text-sm font-medium">Imagem de Fundo (Frente)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                   onClick={() => frontFileInputRef.current?.click()}>
                {cardSettings.frontBackgroundImage ? (
                  <div className="relative w-full aspect-video">
                    <img 
                      src={cardSettings.frontBackgroundImage} 
                      alt="Background preview" 
                      className="w-full h-full object-cover rounded"
                    />
                    <button 
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCardSetting('frontBackgroundImage', undefined);
                      }}
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageUp size={24} />
                    <span className="text-sm">Clique para fazer upload da imagem</span>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  ref={frontFileInputRef}
                  accept="image/*"
                  onChange={handleFrontImageUpload}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="block text-sm font-medium">Imagem de Fundo (Verso)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                   onClick={() => backFileInputRef.current?.click()}>
                {cardSettings.backBackgroundImage ? (
                  <div className="relative w-full aspect-video">
                    <img 
                      src={cardSettings.backBackgroundImage} 
                      alt="Background preview" 
                      className="w-full h-full object-cover rounded"
                    />
                    <button 
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCardSetting('backBackgroundImage', undefined);
                      }}
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageUp size={24} />
                    <span className="text-sm">Clique para fazer upload da imagem</span>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  ref={backFileInputRef}
                  accept="image/*"
                  onChange={handleBackImageUpload}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Positioning Tab */}
        <TabsContent value="positioning" className="space-y-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Posição da Foto</h4>
              <div className="space-y-2">
                <Label className="block text-sm">Posição X (%)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[cardSettings.photoPosition?.x || 50]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => updateCardSetting('photoPosition', { 
                      ...cardSettings.photoPosition, 
                      x: value[0] 
                    })}
                    className="flex-1"
                  />
                  <span className="text-sm w-8 text-center">{cardSettings.photoPosition?.x || 50}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="block text-sm">Posição Y (%)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[cardSettings.photoPosition?.y || 50]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => updateCardSetting('photoPosition', { 
                      ...cardSettings.photoPosition, 
                      y: value[0] 
                    })}
                    className="flex-1"
                  />
                  <span className="text-sm w-8 text-center">{cardSettings.photoPosition?.y || 50}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Posição dos Textos</h4>
              <div className="space-y-2">
                <Label className="block text-sm">Posição X (%)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[cardSettings.textPosition?.x || 50]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => updateCardSetting('textPosition', { 
                      ...cardSettings.textPosition, 
                      x: value[0] 
                    })}
                    className="flex-1"
                  />
                  <span className="text-sm w-8 text-center">{cardSettings.textPosition?.x || 50}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="block text-sm">Posição Y (%)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[cardSettings.textPosition?.y || 50]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => updateCardSetting('textPosition', { 
                      ...cardSettings.textPosition, 
                      y: value[0] 
                    })}
                    className="flex-1"
                  />
                  <span className="text-sm w-8 text-center">{cardSettings.textPosition?.y || 50}%</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Fonts Tab */}
        <TabsContent value="fonts" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-1">Família de Fonte</Label>
              <select
                value={cardSettings.fontFamily || 'Arial, sans-serif'}
                onChange={(e) => updateCardSetting('fontFamily', e.target.value)}
                className="w-full border rounded p-2"
              >
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
              <div className="mt-2 p-2 border rounded" style={{ fontFamily: cardSettings.fontFamily || 'Arial, sans-serif' }}>
                <p>Exemplo de texto com a fonte selecionada</p>
                <p>CRECI: 12345</p>
                <p>CPF: 123.456.789-00</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CardPersonalizationPanel;
