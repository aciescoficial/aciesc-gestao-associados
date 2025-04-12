
import React, { useEffect, useState } from 'react';
import { Inbox, Building, User, MapPin, Phone, Link, Instagram } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This would come from a database in a real implementation
const mockSugestoes = [
  {
    id: '1',
    nome_empresa: 'Café & Tal',
    cidade: 'São José',
    estado: 'SC',
    telefone: '(48) 99999-8888',
    instagram: '@cafeetaloficial',
    site: 'www.cafetal.com.br',
    contato: 'Ana Silva',
    motivo: 'Ótimo café, ambiente aconchegante. Seria um ótimo espaço para networking entre associados.',
    produtos: 'Cafés especiais, doces artesanais, sanduíches naturais',
    status: 'pendente',
    data_sugestao: '2025-04-05T10:30:00Z'
  },
  {
    id: '2',
    nome_empresa: 'Tech Solutions',
    cidade: 'Florianópolis',
    estado: 'SC',
    telefone: '(48) 98765-4321',
    instagram: '@techsolutionsfln',
    site: 'www.techsolutions.com.br',
    contato: 'Roberto Mendes',
    motivo: 'Empresa de tecnologia que oferece serviços de desenvolvimento web e aplicativos.',
    produtos: 'Desenvolvimento de software, consultoria em TI, serviços em nuvem',
    status: 'aprovada',
    data_sugestao: '2025-03-28T14:15:00Z'
  },
  {
    id: '3',
    nome_empresa: 'Moda Express',
    cidade: 'Biguaçu',
    estado: 'SC',
    telefone: '(48) 99988-7766',
    instagram: '@modaexpressbig',
    site: 'www.modaexpress.com.br',
    contato: 'Carla Rodrigues',
    motivo: 'Loja com ótimos descontos e variedade de produtos. Seria um benefício para os associados.',
    produtos: 'Roupas, calçados, acessórios',
    status: 'rejeitada',
    data_sugestao: '2025-04-01T09:45:00Z'
  }
];

const EmpresaSugestoes: React.FC = () => {
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('todas');
  
  useEffect(() => {
    // In a real implementation, this would fetch from a database
    setSugestoes(mockSugestoes);
  }, []);
  
  const getFilteredSugestoes = () => {
    if (activeTab === 'todas') return sugestoes;
    return sugestoes.filter(s => s.status === activeTab);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'aprovada':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovada</Badge>;
      case 'rejeitada':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeitada</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="wp-header flex items-center gap-2">
        <Inbox className="h-6 w-6" />
        Sugestões de Empresas
      </h1>
      
      <div className="wp-card">
        <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="pendente">Pendentes</TabsTrigger>
            <TabsTrigger value="aprovada">Aprovadas</TabsTrigger>
            <TabsTrigger value="rejeitada">Rejeitadas</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {getFilteredSugestoes().length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Inbox className="mx-auto h-12 w-12 opacity-30 mb-2" />
                <p>Nenhuma sugestão {activeTab !== 'todas' ? `com status "${activeTab}"` : ''} encontrada.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getFilteredSugestoes().map((sugestao) => (
                  <Card key={sugestao.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{sugestao.nome_empresa}</CardTitle>
                        {getStatusBadge(sugestao.status)}
                      </div>
                      <CardDescription className="flex items-center gap-1 text-sm">
                        <MapPin size={14} />
                        {sugestao.cidade}/{sugestao.estado}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Dados do Contato</h4>
                        <div className="text-sm grid grid-cols-1 gap-1">
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>{sugestao.contato}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>{sugestao.telefone}</span>
                          </div>
                          
                          {sugestao.instagram && (
                            <div className="flex items-center gap-2">
                              <Instagram size={14} />
                              <span>{sugestao.instagram}</span>
                            </div>
                          )}
                          
                          {sugestao.site && (
                            <div className="flex items-center gap-2">
                              <Link size={14} />
                              <span>{sugestao.site}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Motivo</h4>
                        <p className="text-sm text-gray-600">{sugestao.motivo}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Produtos/Serviços</h4>
                        <p className="text-sm text-gray-600">{sugestao.produtos}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <p className="text-xs text-gray-500">
                        Sugestão recebida em: {formatDate(sugestao.data_sugestao)}
                      </p>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmpresaSugestoes;
