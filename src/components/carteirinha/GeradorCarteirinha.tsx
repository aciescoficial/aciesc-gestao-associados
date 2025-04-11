
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CardSettings, ConveniadoData, ACIESC_COLORS } from './types';
import SearchPanel from './SearchPanel';
import AssociadoInfoCard from './ConveniadoInfoCard';
import CardPersonalizationPanel from './CardPersonalizationPanel';
import CardPreviewPanel from './CardPreviewPanel';
import { supabase } from '@/integrations/supabase/client';

const GeradorCarteirinha: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedConveniado, setSelectedConveniado] = useState<ConveniadoData | null>(null);
  const [cardView, setCardView] = useState<'front' | 'back'>('front');
  const { toast } = useToast();
  
  // Card customization settings with ACIESC colors as default values
  const [cardSettings, setCardSettings] = useState<CardSettings>({
    primaryColor: ACIESC_COLORS.primaryGreen,
    secondaryColor: ACIESC_COLORS.darkGreen,
    textColor: ACIESC_COLORS.white,
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
        description: "Por favor, insira um nome ou CPF para buscar o associado.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Real API call to Supabase
      const term = searchTerm.toLowerCase();
      const { data, error } = await supabase
        .from('associados')
        .select('*')
        .or(`nome.ilike.%${term}%,sobrenome.ilike.%${term}%,cpf.ilike.%${term}%`);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontrados associados com os critérios informados.",
        });
        setSelectedConveniado(null);
      } else if (data.length === 1) {
        // Map the database record to ConveniadoData type
        const associado = data[0];
        setSelectedConveniado({
          nome: associado.nome || '',
          sobrenome: associado.sobrenome || '',
          cpf: associado.cpf || '',
          creci: associado.creci || '',
          validade: associado.validade ? new Date(associado.validade).toLocaleDateString() : 'N/A',
          foto: associado.foto_url || undefined
        });
      } else {
        // If more than one result, select the first one for this demo
        const associado = data[0];
        setSelectedConveniado({
          nome: associado.nome || '',
          sobrenome: associado.sobrenome || '',
          cpf: associado.cpf || '',
          creci: associado.creci || '',
          validade: associado.validade ? new Date(associado.validade).toLocaleDateString() : 'N/A',
          foto: associado.foto_url || undefined
        });
        
        toast({
          title: "Múltiplos resultados",
          description: `Encontramos ${data.length} associados. Exibindo o primeiro resultado.`,
        });
      }
    } catch (error) {
      console.error("Error searching:", error);
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
