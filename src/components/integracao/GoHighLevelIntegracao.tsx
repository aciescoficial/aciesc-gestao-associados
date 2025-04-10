
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ArrowUpFromLine, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  testGohighlevelConnection,
  syncConveniados,
  syncEmpresas,
  SyncResults
} from '@/integrations/gohighlevel/gohighlevelService';
import { supabase } from '@/integrations/supabase/client';

const GoHighLevelIntegracao: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isLoadingConveniados, setIsLoadingConveniados] = useState(false);
  const [isLoadingEmpresas, setIsLoadingEmpresas] = useState(false);
  const [isSyncingConveniados, setIsSyncingConveniados] = useState(false);
  const [isSyncingEmpresas, setIsSyncingEmpresas] = useState(false);
  const [conveniados, setConveniados] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [syncResultsConveniados, setSyncResultsConveniados] = useState<SyncResults | null>(null);
  const [syncResultsEmpresas, setSyncResultsEmpresas] = useState<SyncResults | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const connected = await testGohighlevelConnection();
      setIsConnected(connected);
      if (connected) {
        toast({
          title: "Conexão estabelecida",
          description: "API do Go High Level conectada com sucesso.",
        });
      } else {
        toast({
          title: "Falha na conexão",
          description: "Não foi possível conectar à API do Go High Level. Verifique sua chave de API.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      setIsConnected(false);
      toast({
        title: "Erro de conexão",
        description: "Ocorreu um erro ao testar a conexão com o Go High Level.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const fetchConveniados = async () => {
    setIsLoadingConveniados(true);
    try {
      const { data, error } = await supabase
        .from('conveniados')
        .select('id, nome, sobrenome, email, telefone, cpf, cidade, estado, cep, rua, numero, complemento, bairro, creci')
        .order('nome', { ascending: true });
        
      if (error) throw error;
      
      setConveniados(data || []);
      toast({
        title: "Conveniados carregados",
        description: `${data?.length || 0} conveniados prontos para sincronização.`,
      });
    } catch (error) {
      console.error("Erro ao buscar conveniados:", error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar a lista de conveniados.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingConveniados(false);
    }
  };

  const fetchEmpresas = async () => {
    setIsLoadingEmpresas(true);
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, razao_social, nome_fantasia, cnpj, responsavel, email, telefone, endereco, cidade, cep, site, instagram, whatsapp')
        .order('nome_fantasia', { ascending: true });
        
      if (error) throw error;
      
      // Mapear os dados para corresponder à interface esperada
      const mappedData = data?.map(empresa => ({
        id: empresa.id,
        razaoSocial: empresa.razao_social,
        nomeFantasia: empresa.nome_fantasia,
        cnpj: empresa.cnpj,
        responsavel: empresa.responsavel,
        email: empresa.email,
        telefone: empresa.telefone,
        endereco: empresa.endereco,
        cidade: empresa.cidade,
        cep: empresa.cep,
        site: empresa.site,
        instagram: empresa.instagram,
        whatsapp: empresa.whatsapp
      })) || [];
      
      setEmpresas(mappedData);
      toast({
        title: "Empresas carregadas",
        description: `${mappedData.length} empresas prontas para sincronização.`,
      });
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar a lista de empresas.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEmpresas(false);
    }
  };

  const handleSyncConveniados = async () => {
    if (conveniados.length === 0) {
      toast({
        title: "Nenhum conveniado",
        description: "Carregue a lista de conveniados antes de sincronizar.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncingConveniados(true);
    setSyncResultsConveniados(null);
    try {
      const results = await syncConveniados(conveniados);
      setSyncResultsConveniados(results);
      
      toast({
        title: "Sincronização concluída",
        description: `${results.successful} conveniados sincronizados com sucesso. ${results.failed} falhas.`,
        variant: results.failed > 0 ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Erro na sincronização:", error);
      toast({
        title: "Erro de sincronização",
        description: "Ocorreu um erro ao sincronizar os conveniados com o Go High Level.",
        variant: "destructive",
      });
    } finally {
      setIsSyncingConveniados(false);
    }
  };

  const handleSyncEmpresas = async () => {
    if (empresas.length === 0) {
      toast({
        title: "Nenhuma empresa",
        description: "Carregue a lista de empresas antes de sincronizar.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncingEmpresas(true);
    setSyncResultsEmpresas(null);
    try {
      const results = await syncEmpresas(empresas);
      setSyncResultsEmpresas(results);
      
      toast({
        title: "Sincronização concluída",
        description: `${results.successful} empresas sincronizadas com sucesso. ${results.failed} falhas.`,
        variant: results.failed > 0 ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Erro na sincronização:", error);
      toast({
        title: "Erro de sincronização",
        description: "Ocorreu um erro ao sincronizar as empresas com o Go High Level.",
        variant: "destructive",
      });
    } finally {
      setIsSyncingEmpresas(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Integração Go High Level</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status da API:</span>
          {isTesting ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : isConnected === null ? (
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          ) : isConnected ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={testConnection}
            disabled={isTesting}
          >
            {isTesting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Testar Conexão
          </Button>
        </div>
      </div>

      <div className="wp-notice-info">
        <p>
          Esta integração permite sincronizar seus conveniados e empresas parceiras com o Go High Level, 
          criando contatos e empresas automaticamente na plataforma.
        </p>
      </div>

      <Tabs defaultValue="conveniados" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="conveniados">Conveniados</TabsTrigger>
          <TabsTrigger value="empresas">Empresas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conveniados" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Sincronização de Conveniados</h3>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={fetchConveniados}
                disabled={isLoadingConveniados}
              >
                {isLoadingConveniados ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Carregar Conveniados
              </Button>
              
              <Button
                onClick={handleSyncConveniados}
                disabled={conveniados.length === 0 || isSyncingConveniados || !isConnected}
              >
                {isSyncingConveniados ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ArrowUpFromLine className="h-4 w-4 mr-2" />
                )}
                Sincronizar com GHL
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md p-4 bg-muted/20">
            {conveniados.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum conveniado carregado. Clique em "Carregar Conveniados" para começar.
              </p>
            ) : (
              <>
                <p className="mb-4">Total de conveniados: <strong>{conveniados.length}</strong></p>
                
                {syncResultsConveniados && (
                  <div className="mt-4 p-4 border rounded-md bg-card">
                    <h4 className="font-medium mb-2">Resultado da sincronização:</h4>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Sucesso: {syncResultsConveniados.successful}</span>
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>Falhas: {syncResultsConveniados.failed}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="empresas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Sincronização de Empresas</h3>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={fetchEmpresas}
                disabled={isLoadingEmpresas}
              >
                {isLoadingEmpresas ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Carregar Empresas
              </Button>
              
              <Button
                onClick={handleSyncEmpresas}
                disabled={empresas.length === 0 || isSyncingEmpresas || !isConnected}
              >
                {isSyncingEmpresas ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ArrowUpFromLine className="h-4 w-4 mr-2" />
                )}
                Sincronizar com GHL
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md p-4 bg-muted/20">
            {empresas.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma empresa carregada. Clique em "Carregar Empresas" para começar.
              </p>
            ) : (
              <>
                <p className="mb-4">Total de empresas: <strong>{empresas.length}</strong></p>
                
                {syncResultsEmpresas && (
                  <div className="mt-4 p-4 border rounded-md bg-card">
                    <h4 className="font-medium mb-2">Resultado da sincronização:</h4>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Sucesso: {syncResultsEmpresas.successful}</span>
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>Falhas: {syncResultsEmpresas.failed}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoHighLevelIntegracao;
