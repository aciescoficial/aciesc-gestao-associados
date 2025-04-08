
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CardSettings, ConveniadoData } from './types';
import { mockData } from './mock-data';
import SearchPanel from './SearchPanel';
import ConveniadoInfoCard from './ConveniadoInfoCard';
import CardPersonalizationPanel from './CardPersonalizationPanel';
import CardPreviewPanel from './CardPreviewPanel';

const GeradorCarteirinha: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedConveniado, setSelectedConveniado] = useState<ConveniadoData | null>(null);
  const [cardView, setCardView] = useState<'front' | 'back'>('front');
  const { toast } = useToast();
  
  // Card customization settings with default values
  const [cardSettings, setCardSettings] = useState<CardSettings>({
    primaryColor: '#00E676',
    secondaryColor: '#1a3b39',
    textColor: '#FFFFFF',
    fontFamily: 'Arial, sans-serif',
    showCPF: true,
    showCreci: true,
    showQRCode: true,
    logoPosition: 'top',
    photoPosition: { x: 50, y: 50 },
    textPosition: { x: 70, y: 50 },
    frontBackgroundImage: undefined,
    backBackgroundImage: undefined,
    defaultBackImage: '/lovable-uploads/3da9ac21-93f9-4795-bef1-3943d4484a78.png'
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Campo de busca vazio",
        description: "Por favor, insira um nome ou CPF para buscar o conveniado.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Mock API call - would call actual API in real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock data based on search criteria
      const term = searchTerm.toLowerCase();
      const filteredResults = mockData.filter(
        item => item.nome.toLowerCase().includes(term) || 
                item.sobrenome.toLowerCase().includes(term) || 
                item.cpf.includes(searchTerm)
      );
      
      if (filteredResults.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontrados conveniados com os critérios informados.",
        });
        setSelectedConveniado(null);
      } else if (filteredResults.length === 1) {
        setSelectedConveniado(filteredResults[0]);
      } else {
        // If more than one result, select the first one for this demo
        // In a real application, you might show a list for selection
        setSelectedConveniado(filteredResults[0]);
        toast({
          title: "Múltiplos resultados",
          description: `Encontramos ${filteredResults.length} conveniados. Exibindo o primeiro resultado.`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

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

  const updateCardSetting = <K extends keyof CardSettings>(key: K, value: CardSettings[K]) => {
    setCardSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Gerar Carteirinha</h1>
      
      <SearchPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        isSearching={isSearching}
      />
      
      {selectedConveniado && (
        <div className="wp-card">
          <h2 className="wp-subheader">Dados do Conveniado</h2>
          <ConveniadoInfoCard selectedConveniado={selectedConveniado} />
          
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
