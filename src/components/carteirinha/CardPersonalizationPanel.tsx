
import React from 'react';
import { CardSettings } from './types';

interface CardPersonalizationPanelProps {
  cardSettings: CardSettings;
  updateCardSetting: <K extends keyof CardSettings>(key: K, value: CardSettings[K]) => void;
}

const CardPersonalizationPanel: React.FC<CardPersonalizationPanelProps> = ({ 
  cardSettings,
  updateCardSetting
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Personalizar Carteirinha</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Color controls */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Cor Primária</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={cardSettings.primaryColor} 
                onChange={(e) => updateCardSetting('primaryColor', e.target.value)} 
                className="h-8 w-12 border-0"
              />
              <span className="text-sm">{cardSettings.primaryColor}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cor Secundária</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={cardSettings.secondaryColor} 
                onChange={(e) => updateCardSetting('secondaryColor', e.target.value)} 
                className="h-8 w-12 border-0"
              />
              <span className="text-sm">{cardSettings.secondaryColor}</span>
            </div>
          </div>
        </div>
        
        {/* Toggle controls */}
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
        </div>
      </div>
    </div>
  );
};

export default CardPersonalizationPanel;
