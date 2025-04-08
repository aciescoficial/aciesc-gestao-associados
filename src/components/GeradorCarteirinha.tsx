
import React, { useState } from 'react';
import { Search, Printer, Download, RotateCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConveniadoData {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  creci: string;
  validade: string;
  foto?: string;
}

const GeradorCarteirinha: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedConveniado, setSelectedConveniado] = useState<ConveniadoData | null>(null);
  const [cardView, setCardView] = useState<'front' | 'back'>('front');
  const { toast } = useToast();

  // Mock data - would be fetched from API in real implementation
  const mockData: ConveniadoData[] = [
    { 
      id: '1', 
      nome: 'João', 
      sobrenome: 'Silva', 
      cpf: '123.456.789-00', 
      creci: '12345', 
      validade: '01/2026',
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    { 
      id: '2', 
      nome: 'Maria', 
      sobrenome: 'Oliveira', 
      cpf: '987.654.321-00', 
      creci: '54321', 
      validade: '01/2026',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    { 
      id: '3', 
      nome: 'Pedro', 
      sobrenome: 'Santos', 
      cpf: '456.789.123-00', 
      creci: '67890', 
      validade: '01/2026',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
  ];

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

  const toggleCardView = () => {
    setCardView(prev => prev === 'front' ? 'back' : 'front');
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Gerar Carteirinha</h1>
      
      <div className="wp-card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Buscar conveniado</label>
              <div className="relative">
                <input
                  type="text"
                  className="wp-input w-full pl-10"
                  placeholder="Digite o nome ou CPF do conveniado"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex items-end">
              <button 
                type="submit" 
                className="wp-button w-full"
                disabled={isSearching}
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {selectedConveniado && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="wp-card">
            <h2 className="wp-subheader">Dados do Conveniado</h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Nome:</span>
                <span>{`${selectedConveniado.nome} ${selectedConveniado.sobrenome}`}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">CPF:</span>
                <span>{selectedConveniado.cpf}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">CRECI:</span>
                <span>{selectedConveniado.creci}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Validade:</span>
                <span>{selectedConveniado.validade}</span>
              </div>
            </div>
          </div>
          
          <div className="wp-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="wp-subheader mb-0">Previsualização da Carteirinha</h2>
              <button
                onClick={toggleCardView}
                className="flex items-center gap-1 text-sm text-wp-primary hover:text-wp-primary-hover"
              >
                <RotateCw size={16} />
                {cardView === 'front' ? 'Ver Verso' : 'Ver Frente'}
              </button>
            </div>

            <Tabs value={cardView} onValueChange={(value) => setCardView(value as 'front' | 'back')} className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="front" className="flex-1">Frente</TabsTrigger>
                <TabsTrigger value="back" className="flex-1">Verso</TabsTrigger>
              </TabsList>
              
              <TabsContent value="front" className="mt-0">
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                  <AspectRatio ratio={600/300} className="bg-[linear-gradient(90deg,#1a3b39,#2d6e6a)]">
                    <div className="h-full w-full relative p-0">
                      {/* Left side with patterns and photo */}
                      <div className="absolute left-0 top-0 bottom-0 w-1/3 overflow-hidden">
                        {/* Green pattern background */}
                        <div className="absolute left-0 top-0 bottom-0 w-full">
                          <svg viewBox="0 0 200 400" className="h-full">
                            <path d="M0,0 L50,0 C80,0 80,30 80,30 L80,80 C80,110 110,110 110,110 L160,110 L160,160 C160,190 190,190 190,190 L190,400 L0,400 Z" 
                                  fill="#00E676" />
                          </svg>
                        </div>
                        
                        {/* Validity badge */}
                        <div className="absolute right-0 top-24 transform translate-x-1/2 bg-[#00E676] text-black rounded-full py-2 px-6 font-bold">
                          Validade - {selectedConveniado.validade}
                        </div>
                        
                        {/* Profile photo */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/4 w-48 h-48 rounded-md overflow-hidden border-4 border-[#00E676]">
                          {selectedConveniado.foto ? (
                            <img 
                              src={selectedConveniado.foto} 
                              alt={`${selectedConveniado.nome}`} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                              Sem foto
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Right side with text content */}
                      <div className="absolute right-0 top-0 bottom-0 w-2/3 p-4 text-white flex flex-col items-end justify-between">
                        {/* ACIESC Logo */}
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-4xl font-bold tracking-wider">ACIESC</div>
                            <div className="text-xs max-w-xs">
                              ASSOCIAÇÃO DE CORRETORES E IMOBILIÁRIAS DO ESTADO DE SANTA CATARINA
                            </div>
                          </div>
                        </div>
                        
                        {/* Conveniado Info */}
                        <div className="text-right space-y-2 mt-8">
                          <div>
                            <h2 className="text-3xl font-bold text-[#00E676]">CORRETOR DE</h2>
                            <h2 className="text-3xl font-bold text-[#00E676]">IMÓVEIS</h2>
                          </div>
                          
                          <div className="mt-4">
                            <p className="font-bold">CRECI-SC: {selectedConveniado.creci}</p>
                            <p className="font-bold">CPF: {selectedConveniado.cpf}</p>
                          </div>
                        </div>
                        
                        {/* Slogan */}
                        <div className="text-right mt-auto">
                          <p className="text-xl font-bold mb-1">Ser associado</p>
                          <p className="bg-[#00E676] text-black px-4 py-1 rounded-md inline-block font-bold">
                            que fazem a diferença!
                          </p>
                        </div>
                      </div>
                    </div>
                  </AspectRatio>
                </div>
              </TabsContent>
              
              <TabsContent value="back" className="mt-0">
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                  <AspectRatio ratio={600/300} className="bg-[linear-gradient(90deg,#1a3b39,#2d6e6a)]">
                    <div className="h-full w-full relative p-0">
                      {/* Left side with patterns and QR code */}
                      <div className="absolute left-0 top-0 bottom-0 w-1/3 overflow-hidden">
                        {/* Green pattern background */}
                        <div className="absolute left-0 top-0 bottom-0 w-full">
                          <svg viewBox="0 0 200 400" className="h-full">
                            <path d="M0,0 L50,0 C80,0 80,30 80,30 L80,80 C80,110 110,110 110,110 L160,110 L160,160 C160,190 190,190 190,190 L190,400 L0,400 Z" 
                                  fill="#00E676" />
                          </svg>
                        </div>
                        
                        {/* QR Code */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/4 w-48 h-48 bg-white p-2 rounded-md">
                          <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aciesc.com.br" 
                            alt="QR Code"
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                      
                      {/* Right side with text content */}
                      <div className="absolute right-0 top-0 bottom-0 w-2/3 p-4 text-white flex flex-col items-end justify-between">
                        {/* Website */}
                        <div className="text-right">
                          <p className="text-2xl font-bold">www.aciesc.com.br</p>
                        </div>
                        
                        {/* Main content */}
                        <div className="text-right space-y-2">
                          <div>
                            <h2 className="text-xl font-bold text-[#00E676]">EU SOU</h2>
                            <h2 className="text-2xl font-bold text-[#00E676]">CORRETOR</h2>
                            <h2 className="text-2xl font-bold text-[#00E676]">DE IMÓVEIS</h2>
                            <h2 className="text-2xl font-bold text-[#00E676]">ASSOCIADO</h2>
                          </div>
                        </div>
                        
                        {/* ACIESC Logo bottom */}
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-3xl font-bold tracking-wider">ACIESC</div>
                            <div className="text-xs max-w-xs">
                              ASSOCIAÇÃO DE CORRETORES E IMOBILIÁRIAS DO ESTADO DE SANTA CATARINA
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AspectRatio>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 flex space-x-3">
              <button 
                className="wp-button flex items-center gap-2"
                onClick={handlePrint}
              >
                <Printer size={18} />
                Imprimir
              </button>
              <button 
                className="wp-button-secondary flex items-center gap-2"
                onClick={handleDownload}
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeradorCarteirinha;
