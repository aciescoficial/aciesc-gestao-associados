
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Phone, MapPin, Globe, UploadCloud, Save, Loader2 } from 'lucide-react';
import { NichoType } from './types';

// Map for display labels
const nichoLabels: Record<NichoType | string, string> = {
  '': 'Selecione o nicho',
  'alimentacao': 'Alimentação',
  'vestuario': 'Vestuário',
  'saude': 'Saúde',
  'educacao': 'Educação',
  'servicos': 'Serviços',
  'tecnologia': 'Tecnologia',
  'outro': 'Outro'
};

// Nicho options based on the database enum
const nichoOptions = [
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'vestuario', label: 'Vestuário' },
  { value: 'saude', label: 'Saúde' },
  { value: 'educacao', label: 'Educação' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'tecnologia', label: 'Tecnologia' },
  { value: 'outro', label: 'Outro' }
];

const EmpresaProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [empresa, setEmpresa] = useState<any>(null);
  
  // Form states
  const [nome, setNome] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [cep, setCep] = useState('');
  const [site, setSite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nicho, setNicho] = useState<string>('');
  const [desconto, setDesconto] = useState('');
  const [produtos, setProdutos] = useState('');

  useEffect(() => {
    const fetchEmpresaData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // First get the user data to find empresa_id
        const { data: userData, error: userError } = await supabase
          .from('user')
          .select('empresa_id')
          .eq('id', user.id)
          .single();
          
        if (userError) throw userError;
        
        if (!userData.empresa_id) {
          toast({
            title: "Empresa não encontrada",
            description: "Sua conta não está associada a nenhuma empresa. Entre em contato com a administração.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        // Then fetch empresa data
        const { data: empresaData, error: empresaError } = await supabase
          .from('empresas')
          .select('*')
          .eq('id', userData.empresa_id)
          .single();
          
        if (empresaError) throw empresaError;
        
        setEmpresa(empresaData);
        
        // Populate form fields
        setNome(empresaData.nome_fantasia || '');
        setRazaoSocial(empresaData.razao_social || '');
        setCnpj(empresaData.cnpj || '');
        setResponsavel(empresaData.responsavel || '');
        setTelefone(empresaData.telefone || '');
        setEmail(empresaData.email || '');
        setEndereco(empresaData.endereco || '');
        setCidade(empresaData.cidade || '');
        setCep(empresaData.cep || '');
        setSite(empresaData.site || '');
        setInstagram(empresaData.instagram || '');
        setWhatsapp(empresaData.whatsapp || '');
        setNicho(empresaData.nicho || '');
        setDesconto(empresaData.desconto || '');
        setProdutos(empresaData.produtos || '');
      } catch (error: any) {
        console.error("Error fetching empresa data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Não foi possível carregar os dados da empresa.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmpresaData();
  }, [user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresa) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('empresas')
        .update({
          nome_fantasia: nome,
          razao_social: razaoSocial,
          cnpj: cnpj,
          responsavel: responsavel,
          telefone: telefone,
          email: email,
          endereco: endereco,
          cidade: cidade,
          cep: cep,
          site: site,
          instagram: instagram,
          whatsapp: whatsapp,
          nicho: nicho as NichoType,
          desconto: desconto,
          produtos: produtos,
          updated_at: new Date().toISOString()
        })
        .eq('id', empresa.id);
        
      if (error) throw error;
      
      toast({
        title: "Dados atualizados",
        description: "Os dados da empresa foram atualizados com sucesso.",
        variant: "default"
      });
    } catch (error: any) {
      console.error("Error updating empresa data:", error);
      toast({
        title: "Erro ao atualizar dados",
        description: error.message || "Não foi possível atualizar os dados da empresa.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando dados da empresa...</p>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">Sem vínculo com empresa</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Sua conta não está vinculada a nenhuma empresa. Entre em contato com a administração.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Dados da Empresa</h1>
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="informacoes" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
            <TabsTrigger value="informacoes" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Informações Gerais</span>
            </TabsTrigger>
            <TabsTrigger value="contato" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Contato e Endereço</span>
            </TabsTrigger>
            <TabsTrigger value="beneficios" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Produtos e Benefícios</span>
            </TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="pt-6">
              <TabsContent value="informacoes" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                    <Input
                      id="nome_fantasia"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="razao_social">Razão Social</Label>
                    <Input
                      id="razao_social"
                      value={razaoSocial}
                      onChange={(e) => setRazaoSocial(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Nome do Responsável</Label>
                    <Input
                      id="responsavel"
                      value={responsavel}
                      onChange={(e) => setResponsavel(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nicho">Nicho de Mercado</Label>
                    <Select 
                      value={nicho} 
                      onValueChange={(value) => setNicho(value)}
                    >
                      <SelectTrigger id="nicho">
                        <SelectValue placeholder="Selecione o nicho de mercado" />
                      </SelectTrigger>
                      <SelectContent>
                        {nichoOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contato" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="site">Site</Label>
                    <Input
                      id="site"
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@seuinstagram"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="endereco">Endereço Completo</Label>
                    <Input
                      id="endereco"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="beneficios" className="mt-0">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="desconto">Desconto ou Benefícios Oferecidos</Label>
                    <Input
                      id="desconto"
                      value={desconto}
                      onChange={(e) => setDesconto(e.target.value)}
                      placeholder="Ex: 10% de desconto em todos os produtos"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Descreva os benefícios que sua empresa oferece aos associados da ACIESC.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="produtos">Produtos/Serviços Oferecidos</Label>
                    <Textarea
                      id="produtos"
                      value={produtos}
                      onChange={(e) => setProdutos(e.target.value)}
                      placeholder="Descreva os principais produtos ou serviços oferecidos pela sua empresa"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmpresaProfile;

