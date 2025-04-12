import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';

type NichoType = Database['public']['Enums']['nicho_type'];

interface EmpresaData {
  id: string;
  nome_fantasia: string;
  razao_social: string;
  nicho: NichoType;
  cidade: string;
  desconto: string;
  logo_url: string | null;
}

const EmpresasConveniadas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNicho, setSelectedNicho] = useState<string>('');
  const [empresas, setEmpresas] = useState<EmpresaData[]>([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState<EmpresaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch active companies on component mount
  useEffect(() => {
    fetchEmpresas();
  }, []);
  
  // Apply filters when search term or nicho changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedNicho, empresas]);
  
  const fetchEmpresas = async () => {
    try {
      setIsLoading(true);
      
      // Only fetch companies with 'ativo' status
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('status', 'ativo');
        
      if (error) throw error;
      
      setEmpresas(data || []);
    } catch (error) {
      console.error("Error fetching empresas:", error);
      toast({
        title: "Erro ao carregar empresas",
        description: "Não foi possível carregar a lista de empresas conveniadas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...empresas];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(empresa => 
        empresa.nome_fantasia.toLowerCase().includes(term) || 
        empresa.razao_social.toLowerCase().includes(term)
      );
    }
    
    // Apply nicho filter
    if (selectedNicho) {
      filtered = filtered.filter(empresa => empresa.nicho === selectedNicho);
    }
    
    setFilteredEmpresas(filtered);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  return (
    <div className="space-y-6">
      <h1 className="wp-header">Empresas Conveniadas</h1>
      
      <div className="wp-card">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Buscar empresas</label>
            <div className="relative">
              <input
                type="text"
                className="wp-input w-full pl-10"
                placeholder="Nome da empresa ou razão social"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Nicho</label>
            <select 
              className="wp-input w-full"
              value={selectedNicho}
              onChange={(e) => setSelectedNicho(e.target.value)}
            >
              <option value="">Todos os nichos</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Saúde">Saúde</option>
              <option value="Educação">Educação</option>
              <option value="Serviços">Serviços</option>
              <option value="Comércio">Comércio</option>
              <option value="Lazer">Lazer</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </form>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredEmpresas.length === 0 ? (
          <div className="wp-notice-warning">
            <p>Nenhuma empresa encontrada com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmpresas.map((empresa) => (
              <div key={empresa.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  {empresa.logo_url ? (
                    <img 
                      src={empresa.logo_url} 
                      alt={empresa.nome_fantasia} 
                      className="max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">Sem logotipo</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{empresa.nome_fantasia}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{empresa.cidade}</span>
                  </div>
                  <div className="mt-2">
                    <span className="wp-badge">{empresa.nicho}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="font-medium">Desconto para associados:</p>
                    <p className="text-green-600 font-bold">{empresa.desconto}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpresasConveniadas;
