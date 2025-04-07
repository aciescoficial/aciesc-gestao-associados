
import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IntegracaoFinanceira: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [environment, setEnvironment] = useState('sandbox');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalClientes: 0,
    pagamentosAtivos: 0,
    recebidoMes: 'R$ 0,00',
    ultimoCliente: '-'
  });
  
  const { toast } = useToast();
  
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira a chave de API do Asaas.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call - would call actual API in real implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsConnected(true);
      setStats({
        totalClientes: 127,
        pagamentosAtivos: 98,
        recebidoMes: 'R$ 3.920,00',
        ultimoCliente: 'João Silva (há 2 dias)'
      });
      
      toast({
        title: "Integração realizada com sucesso!",
        description: "A conexão com a API do Asaas foi estabelecida.",
      });
    } catch (error) {
      toast({
        title: "Erro na integração",
        description: "Não foi possível estabelecer conexão com a API do Asaas. Verifique a chave e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
    setApiKey('');
    toast({
      title: "Desconectado",
      description: "A integração com o Asaas foi desconectada.",
    });
  };
  
  const handleRefreshStats = async () => {
    setIsLoading(true);
    
    try {
      // Mock API call - would call actual API in real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalClientes: 128, // Incremented to simulate update
        pagamentosAtivos: 99, // Incremented to simulate update
        recebidoMes: 'R$ 4.000,00', // Updated to simulate update
        ultimoCliente: 'Maria Oliveira (agora)'
      });
      
      toast({
        title: "Dados atualizados",
        description: "Os dados da integração foram atualizados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar os dados da integração.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Integração Financeira</h1>
      
      {/* Connection Status */}
      <div className="wp-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="https://s3-sa-east-1.amazonaws.com/asaasfiles/public/manual_integracao/logo-asaas.svg" 
              alt="Asaas Logo" 
              className="h-8 w-auto mr-3" 
            />
            <div>
              <h2 className="wp-subheader mb-0">Asaas</h2>
              <p className="text-sm text-gray-500">Plataforma de cobranças e pagamentos</p>
            </div>
          </div>
          
          <div className="flex items-center">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <span className="wp-badge-success flex items-center gap-1">
                  <CheckCircle size={14} />
                  Conectado
                </span>
                <button 
                  className="wp-button-secondary text-wp-error hover:bg-red-50 border-wp-error"
                  onClick={handleDisconnect}
                >
                  Desconectar
                </button>
              </div>
            ) : (
              <span className="wp-badge-error flex items-center gap-1">
                <XCircle size={14} />
                Desconectado
              </span>
            )}
          </div>
        </div>
      </div>
      
      {!isConnected ? (
        <div className="wp-card">
          <h2 className="wp-subheader">Configurar integração</h2>
          <p className="text-gray-600 mb-4">
            Conecte sua conta Asaas para gerenciar pagamentos dos conveniados. Você precisará de uma conta Asaas e uma chave de API.
          </p>
          
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Ambiente</label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="environment"
                    value="sandbox"
                    checked={environment === 'sandbox'}
                    onChange={() => setEnvironment('sandbox')}
                  />
                  <span className="ml-2">Sandbox (Teste)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="environment"
                    value="production"
                    checked={environment === 'production'}
                    onChange={() => setEnvironment('production')}
                  />
                  <span className="ml-2">Produção</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Chave de API</label>
              <div className="relative">
                <input
                  type="password"
                  className="wp-input w-full pl-10"
                  placeholder="Insira sua chave de API do Asaas"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                A chave de API pode ser encontrada no painel do Asaas em Configurações &gt; Integrações.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="wp-button"
                disabled={isLoading}
              >
                {isLoading ? 'Conectando...' : 'Conectar'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Não tem uma conta Asaas?</h3>
            <a 
              href="https://www.asaas.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-wp-primary hover:underline"
            >
              Criar uma conta no Asaas
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="wp-card flex items-center">
              <div className="mr-4 bg-blue-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-wp-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Clientes</p>
                <p className="text-2xl font-semibold">{stats.totalClientes}</p>
              </div>
            </div>
            
            <div className="wp-card flex items-center">
              <div className="mr-4 bg-green-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-wp-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pagamentos Ativos</p>
                <p className="text-2xl font-semibold">{stats.pagamentosAtivos}</p>
              </div>
            </div>
            
            <div className="wp-card flex items-center">
              <div className="mr-4 bg-purple-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Recebido (Mês)</p>
                <p className="text-2xl font-semibold">{stats.recebidoMes}</p>
              </div>
            </div>
            
            <div className="wp-card flex items-center">
              <div className="mr-4 bg-yellow-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Último Cliente</p>
                <p className="text-sm font-semibold">{stats.ultimoCliente}</p>
              </div>
            </div>
          </div>
          
          <div className="wp-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="wp-subheader mb-0">Configurações da Integração</h2>
              <button 
                className="wp-button-secondary flex items-center gap-1"
                onClick={handleRefreshStats}
                disabled={isLoading}
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                {isLoading ? 'Atualizando...' : 'Atualizar'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Configurações de Pagamento</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Plano Anual - À vista</span>
                    <span className="font-medium">R$ 400,00</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Plano Anual - Parcelado (12x)</span>
                    <span className="font-medium">R$ 40,00/mês</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Parcelado</span>
                    <span className="font-medium">R$ 480,00</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Status da API</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Ambiente</span>
                    <span className="font-medium capitalize">{environment}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>API Asaas</span>
                    <span className="wp-badge-success">Operacional</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Webhooks</span>
                    <span className="wp-badge-success">Configurados</span>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <span>Última Sincronização</span>
                    <span className="text-sm">07/04/2025 14:30</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Links Úteis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a 
                  href="https://www.asaas.com/dashboard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="wp-button-secondary text-center"
                >
                  Acessar Dashboard Asaas
                </a>
                <a 
                  href="https://docs.asaas.com/reference/comece-por-aqui" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="wp-button-secondary text-center"
                >
                  Documentação da API
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IntegracaoFinanceira;
