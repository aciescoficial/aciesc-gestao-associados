import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import { 
  FileUp, 
  FileDown, 
  AlertCircle, 
  Check,
  User,
  CreditCard,
  Car,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type StatusType = Database['public']['Enums']['status_type'];

interface ConveniadoFormData {
  nome: string;
  sobrenome: string;
  cpf: string;
  creci?: string;
  dataNascimento?: string;
  email: string;
  celular: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  estado?: string;
  cep?: string;
  placaPrincipal?: string;
  placaSecundaria?: string;
  valorPago?: string;
  dataUltimoPagamento?: string;
  valorDevido?: string;
  tipoPagamento?: string;
  tipoAssociado?: string;
  validade?: string;
  foto?: FileList;
}

interface ImportConveniadoData {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  creci?: string;
  dataNascimento?: string;
  email: string;
  celular: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  estado?: string;
  cep?: string;
  status: 'pendente';
  placaPrincipal?: string;
  placaSecundaria?: string;
  valorPago?: string;
  dataUltimoPagamento?: string;
  valorDevido?: string;
  tipoPagamento?: string;
  tipoAssociado?: string;
  validade?: string;
}

interface ImportValidationData {
  fieldName: string;
  targetField: string;
  isValid: boolean;
}

const estados = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
  'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
];

const tiposAssociados = [
  'Padrão',
  'Premium',
  'Familiar',
  'Empresarial'
];

const tiposPagamento = [
  'Boleto',
  'Cartão de Crédito',
  'Pix',
  'Dinheiro',
  'Transferência'
];

const CadastroConveniado: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState<ImportConveniadoData[]>([]);
  const [validationData, setValidationData] = useState<ImportValidationData[]>([]);
  const [importFormat, setImportFormat] = useState<'csv' | 'xml'>('csv');
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ConveniadoFormData>();
  const fotoFile = watch('foto');
  
  React.useEffect(() => {
    if (fotoFile && fotoFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(fotoFile[0]);
    }
  }, [fotoFile]);
  
  const onSubmit = async (data: ConveniadoFormData) => {
    setIsSubmitting(true);
    
    try {
      const conveniadoData = {
        nome: data.nome,
        sobrenome: data.sobrenome,
        telefone: data.celular,
        email: data.email,
        cidade: data.cidade,
        cpf: data.cpf,
        creci: data.creci || null,
        data_nascimento: data.dataNascimento || null,
        rua: data.rua || null,
        numero: data.numero || null,
        complemento: data.complemento || null,
        bairro: data.bairro || null,
        estado: data.estado || null,
        cep: data.cep || null,
        placa_principal: data.placaPrincipal || null,
        placa_secundaria: data.placaSecundaria || null,
        valor_pago: data.valorPago || null,
        data_ultimo_pagamento: data.dataUltimoPagamento || null,
        valor_devido: data.valorDevido || null,
        tipo_pagamento: data.tipoPagamento || null,
        tipo_associado: data.tipoAssociado || null,
        validade: data.validade || null,
        status: 'pendente' as StatusType
      };
      
      const { data: conveniadoResult, error } = await supabase
        .from('conveniados')
        .insert(conveniadoData)
        .select('id')
        .single();
        
      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }
      
      if (fotoFile && fotoFile[0]) {
        const fileExt = fotoFile[0].name.split('.').pop();
        const fileName = `${conveniadoResult.id}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('conveniados')
          .upload(fileName, fotoFile[0]);
          
        if (uploadError) {
          console.error("Error uploading file:", uploadError);
        }
      }
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "O conveniado foi cadastrado e está aguardando aprovação.",
      });
      
      reset();
      setFotoPreview(null);
    } catch (error: any) {
      console.error("Error inserting data:", error);
      
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao cadastrar o conveniado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          let parsedData: ImportConveniadoData[] = [];
          
          const fileFormat = file.name.toLowerCase().endsWith('.xml') ? 'xml' : 'csv';
          setImportFormat(fileFormat as 'csv' | 'xml');
          
          if (fileFormat === 'xml') {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(content, "text/xml");
            const conveniados = xmlDoc.getElementsByTagName("conveniado");
            
            for (let i = 0; i < conveniados.length; i++) {
              const conv = conveniados[i];
              parsedData.push({
                id: `import-${i}`,
                nome: conv.getElementsByTagName("nome")[0]?.textContent || '',
                sobrenome: conv.getElementsByTagName("sobrenome")[0]?.textContent || '',
                cpf: conv.getElementsByTagName("cpf")[0]?.textContent || '',
                creci: conv.getElementsByTagName("creci")[0]?.textContent || undefined,
                status: 'pendente',
                email: conv.getElementsByTagName("email")[0]?.textContent || '',
                telefone: conv.getElementsByTagName("telefone")[0]?.textContent || '',
                cidade: conv.getElementsByTagName("cidade")[0]?.textContent || '',
                placa_principal: conv.getElementsByTagName("placa_principal")[0]?.textContent || undefined,
                placa_secundaria: conv.getElementsByTagName("placa_secundaria")[0]?.textContent || undefined,
                dataNascimento: conv.getElementsByTagName("dataNascimento")[0]?.textContent || undefined,
                validade: conv.getElementsByTagName("validade")[0]?.textContent || undefined,
                rua: conv.getElementsByTagName("rua")[0]?.textContent || undefined,
                numero: conv.getElementsByTagName("numero")[0]?.textContent || undefined,
                complemento: conv.getElementsByTagName("complemento")[0]?.textContent || undefined,
                bairro: conv.getElementsByTagName("bairro")[0]?.textContent || undefined,
                estado: conv.getElementsByTagName("estado")[0]?.textContent || undefined,
                cep: conv.getElementsByTagName("cep")[0]?.textContent || undefined,
                valorPago: conv.getElementsByTagName("valorPago")[0]?.textContent || undefined,
                dataUltimoPagamento: conv.getElementsByTagName("dataUltimoPagamento")[0]?.textContent || undefined,
                valorDevido: conv.getElementsByTagName("valorDevido")[0]?.textContent || undefined,
                tipoPagamento: conv.getElementsByTagName("tipoPagamento")[0]?.textContent || undefined,
                tipoAssociado: conv.getElementsByTagName("tipoAssociado")[0]?.textContent || undefined,
              });
            }
          } else {
            const rows = content.split('\n');
            const headers = rows[0].split(',').map(h => h.trim());
            
            for (let i = 1; i < rows.length; i++) {
              if (!rows[i].trim()) continue;
              
              const values = rows[i].split(',').map(v => v.trim());
              const row: any = {};
              
              headers.forEach((header, index) => {
                row[header.toLowerCase()] = values[index] || '';
              });
              
              parsedData.push({
                id: `import-${i}`,
                nome: row.nome || '',
                sobrenome: row.sobrenome || '',
                cpf: row.cpf || '',
                creci: row.creci || undefined,
                status: 'pendente',
                email: row.email || '',
                telefone: row.telefone || '',
                cidade: row.cidade || '',
                placa_principal: row.placa_principal || undefined,
                placa_secundaria: row.placa_secundaria || undefined,
                dataNascimento: row.dataNascimento || undefined,
                validade: row.validade || undefined,
                rua: row.rua || undefined,
                numero: row.numero || undefined,
                complemento: row.complemento || undefined,
                bairro: row.bairro || undefined,
                estado: row.estado || undefined,
                cep: row.cep || undefined,
                valorPago: row.valorPago || undefined,
                dataUltimoPagamento: row.dataUltimoPagamento || undefined,
                valorDevido: row.valorDevido || undefined,
                tipoPagamento: row.tipoPagamento || undefined,
                tipoAssociado: row.tipoAssociado || undefined,
              });
            }
          }
          
          const validations: ImportValidationData[] = [];
          const requiredFields = ['nome', 'sobrenome', 'cpf', 'email', 'telefone', 'cidade'];
          
          const firstRow = parsedData[0] || {};
          Object.keys(firstRow).forEach(key => {
            if (key === 'id' || key === 'status') return;
            
            const isValid = requiredFields.includes(key) 
              ? parsedData.every(row => !!(row as any)[key])
              : true;
              
            validations.push({
              fieldName: key,
              targetField: key,
              isValid
            });
          });
          
          setImportData(parsedData);
          setValidationData(validations);
          setShowImportDialog(true);
        } catch (error) {
          console.error("Error parsing file:", error);
          toast({
            title: "Erro ao processar arquivo",
            description: "O arquivo não pôde ser processado. Verifique o formato e tente novamente.",
            variant: "destructive",
          });
        }
      };
      
      fileReader.readAsText(file);
    }
  };

  const handleImportConfirm = async () => {
    try {
      setIsSubmitting(true);
      
      const conveniados = importData.map(item => ({
        nome: item.nome,
        sobrenome: item.sobrenome,
        cpf: item.cpf,
        creci: item.creci || null,
        email: item.email,
        telefone: item.telefone,
        cidade: item.cidade || '',
        placa_principal: item.placa_principal || null,
        placa_secundaria: item.placa_secundaria || null,
        dataNascimento: item.dataNascimento || null,
        validade: item.validade || null,
        rua: item.rua || undefined,
        numero: item.numero || undefined,
        complemento: item.complemento || undefined,
        bairro: item.bairro || undefined,
        estado: item.estado || undefined,
        cep: item.cep || undefined,
        valorPago: item.valorPago || undefined,
        dataUltimoPagamento: item.dataUltimoPagamento || undefined,
        valorDevido: item.valorDevido || undefined,
        tipoPagamento: item.tipoPagamento || undefined,
        tipoAssociado: item.tipoAssociado || undefined,
        status: 'pendente' as StatusType
      }));
      
      const { error } = await supabase
        .from('conveniados')
        .insert(conveniados);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Importação realizada com sucesso",
        description: `${importData.length} conveniados foram importados.`,
      });
      
      setShowImportDialog(false);
    } catch (error: any) {
      console.error("Error importing data:", error);
      toast({
        title: "Erro na importação",
        description: error.message || "Ocorreu um erro ao importar os conveniados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async (format: 'csv' | 'xml') => {
    try {
      let data: string;
      let fileName: string;
      let mimeType: string;
      
      const { data: conveniados, error } = await supabase
        .from('conveniados')
        .select('*');
        
      if (error) throw error;
      
      if (format === 'csv') {
        const headers = ['id', 'nome', 'sobrenome', 'cpf', 'creci', 'status', 'email', 'telefone', 'cidade', 'placa_principal', 'placa_secundaria', 'data_nascimento', 'validade', 'rua', 'numero', 'complemento', 'bairro', 'estado', 'cep', 'valor_pago', 'data_ultimo_pagamento', 'valor_devido', 'tipo_pagamento', 'tipo_associado'];
        const csvRows = [
          headers.join(','),
          ...conveniados.map(item => {
            return [
              item.id,
              item.nome,
              item.sobrenome,
              item.cpf,
              item.creci || '',
              item.status,
              item.email,
              item.telefone,
              item.cidade,
              item.placa_principal || '',
              item.placa_secundaria || '',
              item.data_nascimento || '',
              item.validade || '',
              item.rua || '',
              item.numero || '',
              item.complemento || '',
              item.bairro || '',
              item.estado || '',
              item.cep || '',
              item.valor_pago || '',
              item.data_ultimo_pagamento || '',
              item.valor_devido || '',
              item.tipo_pagamento || '',
              item.tipo_associado || ''
            ].join(',');
          })
        ];
        
        data = csvRows.join('\n');
        fileName = 'conveniados.csv';
        mimeType = 'text/csv';
      } else {
        const xmlRows = conveniados.map(item => {
          return `  <conveniado>
    <id>${item.id}</id>
    <nome>${item.nome}</nome>
    <sobrenome>${item.sobrenome}</sobrenome>
    <cpf>${item.cpf}</cpf>
    <creci>${item.creci || ''}</creci>
    <status>${item.status}</status>
    <email>${item.email}</email>
    <telefone>${item.telefone}</telefone>
    <cidade>${item.cidade}</cidade>
    <placa_principal>${item.placa_principal || ''}</placa_principal>
    <placa_secundaria>${item.placa_secundaria || ''}</placa_secundaria>
    <data_nascimento>${item.data_nascimento || ''}</data_nascimento>
    <validade>${item.validade || ''}</validade>
    <rua>${item.rua || ''}</rua>
    <numero>${item.numero || ''}</numero>
    <complemento>${item.complemento || ''}</complemento>
    <bairro>${item.bairro || ''}</bairro>
    <estado>${item.estado || ''}</estado>
    <cep>${item.cep || ''}</cep>
    <valor_pago>${item.valor_pago || ''}</valor_pago>
    <data_ultimo_pagamento>${item.data_ultimo_pagamento || ''}</data_ultimo_pagamento>
    <valor_devido>${item.valor_devido || ''}</valor_devido>
    <tipo_pagamento>${item.tipo_pagamento || ''}</tipo_pagamento>
    <tipo_associado>${item.tipo_associado || ''}</tipo_associado>
  </conveniado>`;
        });
        
        data = `<?xml version="1.0" encoding="UTF-8"?>
<conveniados>
${xmlRows.join('\n')}
</conveniados>`;
        fileName = 'conveniados.xml';
        mimeType = 'application/xml';
      }
      
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exportação realizada com sucesso",
        description: `Os dados foram exportados para ${fileName}.`,
      });
    } catch (error: any) {
      console.error("Error exporting data:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const removeFoto = () => {
    setValue('foto', undefined);
    setFotoPreview(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Cadastrar Conveniado</h1>
      
      <div className="wp-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-32">
              <Label htmlFor="foto" className="mb-2 block">Foto</Label>
              <div className="relative h-40 w-32 border rounded-md flex flex-col items-center justify-center overflow-hidden bg-gray-50">
                {fotoPreview ? (
                  <>
                    <img 
                      src={fotoPreview} 
                      alt="Preview" 
                      className="object-cover h-full w-full"
                    />
                    <button
                      type="button"
                      onClick={removeFoto}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-70 hover:opacity-100"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <>
                    <Image size={24} className="text-gray-400 mb-1" />
                    <label 
                      htmlFor="foto-upload" 
                      className="text-sm text-blue-600 cursor-pointer hover:underline"
                    >
                      Adicionar foto
                    </label>
                  </>
                )}
                <input 
                  id="foto-upload"
                  type="file" 
                  {...register('foto')}
                  accept="image/*"
                  className="sr-only"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">JPG ou PNG. Máx 1MB</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome" className="flex items-center gap-2">
                  <User size={16} />
                  Nome*
                </Label>
                <Input
                  id="nome"
                  type="text"
                  className={`${errors.nome ? 'border-red-500' : ''}`}
                  {...register('nome', { required: "Nome é obrigatório" })}
                />
                {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="sobrenome">Sobrenome*</Label>
                <Input
                  id="sobrenome"
                  type="text"
                  className={`${errors.sobrenome ? 'border-red-500' : ''}`}
                  {...register('sobrenome', { required: "Sobrenome é obrigatório" })}
                />
                {errors.sobrenome && <p className="text-red-500 text-sm mt-1">{errors.sobrenome.message}</p>}
              </div>

              <div>
                <Label htmlFor="cpf" className="flex items-center gap-2">
                  <CreditCard size={16} />
                  CPF*
                </Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  className={`${errors.cpf ? 'border-red-500' : ''}`}
                  {...register('cpf', { required: "CPF é obrigatório" })}
                />
                {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>}
              </div>

              <div>
                <Label htmlFor="creci">Número CRECI-SC</Label>
                <Input
                  id="creci"
                  type="text"
                  {...register('creci')}
                />
              </div>
              
              <div>
                <Label htmlFor="dataNascimento" className="flex items-center gap-2">
                  <Calendar size={16} />
                  Data de Nascimento
                </Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  {...register('dataNascimento')}
                />
              </div>

              <div>
                <Label htmlFor="validade" className="flex items-center gap-2">
                  <Calendar size={16} />
                  Validade
                </Label>
                <Input
                  id="validade"
                  type="date"
                  {...register('validade')}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-full">
              <h3 className="text-lg font-medium mb-2">Informações de Contato</h3>
            </div>
            
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail size={16} />
                E-mail*
              </Label>
              <Input
                id="email"
                type="email"
                className={`${errors.email ? 'border-red-500' : ''}`}
                {...register('email', { 
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "E-mail inválido"
                  } 
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="celular" className="flex items-center gap-2">
                <Phone size={16} />
                Celular*
              </Label>
              <Input
                id="celular"
                type="text"
                placeholder="(00) 00000-0000"
                className={`${errors.celular ? 'border-red-500' : ''}`}
                {...register('celular', { required: "Celular é obrigatório" })}
              />
              {errors.celular && <p className="text-red-500 text-sm mt-1">{errors.celular.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-full">
              <h3 className="text-lg font-medium mb-2">Endereço</h3>
            </div>
            
            <div>
              <Label htmlFor="rua" className="flex items-center gap-2">
                <MapPin size={16} />
                Rua
              </Label>
              <Input
                id="rua"
                type="text"
                {...register('rua')}
              />
            </div>
            
            <div className="md:col-span-1">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                type="text"
                {...register('numero')}
              />
            </div>
            
            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                type="text"
                {...register('complemento')}
              />
            </div>
            
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                type="text"
                {...register('bairro')}
              />
            </div>
            
            <div>
              <Label htmlFor="cidade">Cidade*</Label>
              <Input
                id="cidade"
                type="text"
                className={`${errors.cidade ? 'border-red-500' : ''}`}
                {...register('cidade', { required: "Cidade é obrigatória" })}
              />
              {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select 
                onValueChange={(value) => setValue('estado', value)} 
                defaultValue={watch('estado') || ''}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                type="text"
                placeholder="00000-000"
                {...register('cep')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-full">
              <h3 className="text-lg font-medium mb-2">Informações do Veículo</h3>
            </div>
            
            <div>
              <Label htmlFor="placaPrincipal" className="flex items-center gap-2">
                <Car size={16} />
                Placa Principal
              </Label>
              <Input
                id="placaPrincipal"
                type="text"
                placeholder="AAA0A00"
                {...register('placaPrincipal')}
              />
            </div>
            
            <div>
              <Label htmlFor="placaSecundaria">Placa Secundária</Label>
              <Input
                id="placaSecundaria"
                type="text"
                placeholder="AAA0A00"
                {...register('placaSecundaria')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-full">
              <h3 className="text-lg font-medium mb-2">Informações Financeiras</h3>
            </div>
            
            <div>
              <Label htmlFor="valorPago" className="flex items-center gap-2">
                <DollarSign size={16} />
                Valor Pago
              </Label>
              <Input
                id="valorPago"
                type="text"
                placeholder="R$ 0,00"
                {...register('valorPago')}
              />
            </div>
            
            <div>
              <Label htmlFor="dataUltimoPagamento">Data Último Pagamento</Label>
              <Input
                id="dataUltimoPagamento"
                type="date"
                {...register('dataUltimoPagamento')}
              />
            </div>
            
            <div>
              <Label htmlFor="valorDevido">Valor Devido</Label>
              <Input
                id="valorDevido"
                type="text"
                placeholder="R$ 0,00"
                {...register('valorDevido')}
              />
            </div>
            
            <div>
              <Label htmlFor="tipoPagamento">Tipo de Pagamento</Label>
              <Select 
                onValueChange={(value) => setValue('tipoPagamento', value)} 
                defaultValue={watch('tipoPagamento') || ''}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposPagamento.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tipoAssociado" className="flex items-center gap-2">
                <Tag size={16} />
                Tipo de Associado
              </Label>
              <Select 
                onValueChange={(value) => setValue('tipoAssociado', value)} 
                defaultValue={watch('tipoAssociado') || ''}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposAssociados.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="wp-notice-warning">
            <p className="font-medium">Atenção</p>
            <p className="text-sm">Após o cadastro, o conveniado ficará com status pendente de aprovação até que a documentação seja verificada.</p>
          </div>
          
          <div className="mt-5 flex justify-between items-center border-t pt-5">
            <div className="font-medium">Importar/Exportar Conveniados</div>
            <div className="flex space-x-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv,.xml" 
                style={{ display: 'none' }}
              />
              <Button 
                variant="outline"
                onClick={handleImportClick}
                className="flex gap-2 items-center"
              >
                <FileUp size={16} />
                Importar
              </Button>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleExport('csv')}
                  className="flex gap-2 items-center"
                >
                  <FileDown size={16} />
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleExport('xml')}
                  className="flex gap-2 items-center"
                >
                  <FileDown size={16} />
                  XML
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              className="wp-button-secondary mr-2"
              onClick={() => {
                reset();
                setFotoPreview(null);
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="wp-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
      
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Importar Conveniados</DialogTitle>
            <DialogDescription>
              Verifique os dados a serem importados e confirme o mapeamento dos campos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <h4 className="font-medium">Validação de Campos</h4>
            
            <div className="space-y-2">
              {validationData.map((validation, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-2 rounded-md ${validation.isValid ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}
                >
                  <div className="flex items-center gap-2">
                    {validation.isValid ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <AlertCircle size={18} className="text-yellow-500" />
                    )}
                    <span className="font-medium">{validation.fieldName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>Mapear para:</span>
                    <select 
                      className="border rounded-md p-1 bg-white"
                      value={validation.targetField}
                      onChange={(e) => {
                        const newValidationData = [...validationData];
                        newValidationData[idx] = {
                          ...validation,
                          targetField: e.target.value
                        };
                        setValidationData(newValidationData);
                      }}
                    >
                      <option value="nome">Nome</option>
                      <option value="sobrenome">Sobrenome</option>
                      <option value="cpf">CPF</option>
                      <option value="creci">CRECI</option>
                      <option value="email">Email</option>
                      <option value="telefone">Telefone</option>
                      <option value="cidade">Cidade</option>
                      <option value="placa_principal">Placa Principal</option>
                      <option value="placa_secundaria">Placa Secundária</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            <h4 className="font-medium mt-4">Pré-visualização dos dados ({importData.length} registros)</h4>
            <div className="overflow-x-auto max-h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Sobrenome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Cidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importData.slice(0, 5).map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.sobrenome}</TableCell>
                      <TableCell>{item.cpf}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.telefone}</TableCell>
                      <TableCell>{item.cidade}</TableCell>
                    </TableRow>
                  ))}
                  {importData.length > 5 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        + {importData.length - 5} outros registros
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImportConfirm} disabled={isSubmitting}>
              {isSubmitting ? 'Importando...' : `Importar ${importData.length} Registros`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CadastroConveniado;
