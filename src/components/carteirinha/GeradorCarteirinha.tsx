
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import SearchPanel from './SearchPanel';
import AssociadoInfoCard from './ConveniadoInfoCard';
import CardPersonalizationPanel from './CardPersonalizationPanel';
import CardPreviewPanel from './CardPreviewPanel';
import { useConveniadoSearch } from './hooks/useConveniadoSearch';
import { useCardSettings } from './hooks/useCardSettings';

const GeradorCarteirinha: React.FC = () => {
  const [cardView, setCardView] = useState<'front' | 'back'>('front');
  const { toast } = useToast();
  const { searchTerm, setSearchTerm, isSearching, selectedConveniado, handleSearch } = useConveniadoSearch();
  const { cardSettings, updateCardSetting } = useCardSettings();
  
  const handlePrint = () => {
    toast({
      title: "Impressão iniciada",
      description: "A carteirinha foi enviada para impressão.",
    });
    // In a real implementation, this would trigger browser print or generate a PDF
  };

  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: "O arquivo da carteirinha foi gerado para download.",
    });
    // In a real implementation, this would generate and download a PDF
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header text-aciesc-primary">Gerar Carteirinha</h1>
      
      <SearchPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        isSearching={isSearching}
      />
      
      {selectedConveniado && (
        <div className="wp-card">
          <h2 className="wp-subheader text-aciesc-primary">Dados do Associado</h2>
          <AssociadoInfoCard selectedConveniado={selectedConveniado} />
          
          <CardPersonalizationPanel
            cardSettings={cardSettings}
            updateCardSetting={updateCardSetting}
          />
          
          <div className="mt-8">
            <CardPreviewPanel
              selectedConveniado={selectedConveniado}
              cardView={cardView}
              setCardView={setCardView}
              cardSettings={cardSettings}
              handlePrint={handlePrint}
              handleDownload={handleDownload}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GeradorCarteirinha;
