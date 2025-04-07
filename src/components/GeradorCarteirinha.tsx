
import React, { useState } from 'react';
import { Search, Printer, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Mock data - would be fetched from API in real implementation
  const mockData: ConveniadoData[] = [
    { id: '1', nome: 'João', sobrenome: 'Silva', cpf: '123.456.789-00', creci: '12345', validade: '31/12/2025' },
    { id: '2', nome: 'Maria', sobrenome: 'Oliveira', cpf: '987.654.321-00', creci: '54321', validade: '31/12/2025' },
    { id: '3', nome: 'Pedro', sobrenome: 'Santos', cpf: '456.789.123-00', creci: '67890', validade: '31/12/2025' },
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
            <h2 className="wp-subheader">Previsualização da Carteirinha</h2>
            <div className="aspect-[85/54] bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-4 text-white flex flex-col justify-between">
              <div className="flex justify-between">
                <div>
                  <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" alt="ACIESC Logo" className="h-8 w-auto rounded" />
                </div>
                <div className="text-right">
                  <h3 className="font-bold">CONVENIADO</h3>
                  <p className="text-xs opacity-80">Associação Comercial e Industrial</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="w-1/4">
                  <div className="bg-white h-20 w-20 rounded-md flex items-center justify-center text-blue-800">
                    <span className="text-xs">FOTO</span>
                  </div>
                </div>
                <div className="w-3/4 pl-4 space-y-1">
                  <p className="font-bold text-sm">{`${selectedConveniado.nome} ${selectedConveniado.sobrenome}`}</p>
                  <p className="text-xs">CRECI: {selectedConveniado.creci}</p>
                  <p className="text-xs">CPF: {selectedConveniado.cpf}</p>
                  <p className="text-xs">Validade: {selectedConveniado.validade}</p>
                </div>
              </div>
              
              <div className="text-center text-xs mt-2">
                <p>www.aciesc.com.br</p>
              </div>
            </div>
            
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
