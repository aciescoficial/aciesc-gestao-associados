
import React, { useState, useRef } from 'react';
import { Search, Check, X, Car, FileUp, FileDown, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface ConveniadoData {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  creci: string;
  status: 'ativo' | 'pendente' | 'inativo';
  email: string;
  telefone: string;
  placa_principal?: string;
  placa_secundaria?: string;
  foto?: string;
}

interface ImportValidationData {
  fieldName: string;
  targetField: string;
  isValid: boolean;
}

const PesquisaConveniado: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cpf' | 'creci' | 'placa'>('nome');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ConveniadoData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState<ConveniadoData[]>([]);
  const [validationData, setValidationData] = useState<ImportValidationData[]>([]);
  const [importFormat, setImportFormat] = useState<'csv' | 'xml'>('csv');
  const { toast } = useToast();

  // Mock data - would be fetched from API in real implementation
  const mockData: ConveniadoData[] = [
    { 
      id: '1', 
      nome: 'João', 
      sobrenome: 'Silva', 
      cpf: '123.456.789-00', 
      creci: '12345', 
      status: 'ativo', 
      email: 'joao@example.com', 
      telefone: '(47) 99999-1111',
      placa_principal: 'ABC1234',
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    { 
      id: '2', 
      nome: 'Maria', 
      sobrenome: 'Oliveira', 
      cpf: '987.654.321-00', 
      creci: '54321', 
      status: 'ativo', 
      email: 'maria@example.com', 
      telefone: '(47) 99999-2222',
      placa_principal: 'XYZ9876',
      placa_secundaria: 'DEF5432',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    { 
      id: '3', 
      nome: 'Pedro', 
      sobrenome: 'Santos', 
      cpf: '456.789.123-00', 
      creci: '67890', 
      status: 'pendente', 
      email: 'pedro@example.com', 
      telefone: '(47) 99999-3333',
      placa_principal: 'GHI7890'
    },
    { 
      id: '4', 
      nome: 'Ana', 
      sobrenome: 'Costa', 
      cpf: '789.123.456-00', 
      creci: '09876', 
      status: 'inativo', 
      email: 'ana@example.com', 
      telefone: '(47) 99999-4444',
      placa_principal: 'JKL4567'
    },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Campo de busca vazio",
        description: "Por favor, insira um termo para realizar a busca.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Mock API call - would call actual API in real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock data based on search criteria
      let filteredResults: ConveniadoData[] = [];
      
      if (searchType === 'nome') {
        const term = searchTerm.toLowerCase();
        // Changed to search for full name (nome + sobrenome)
        filteredResults = mockData.filter(
          item => `${item.nome} ${item.sobrenome}`.toLowerCase().includes(term)
        );
      } else if (searchType === 'cpf') {
        filteredResults = mockData.filter(item => item.cpf.includes(searchTerm));
      } else if (searchType === 'creci') {
        filteredResults = mockData.filter(item => item.creci.includes(searchTerm));
      } else if (searchType === 'placa') {
        const term = searchTerm.toLowerCase();
        filteredResults = mockData.filter(
          item => 
            (item.placa_principal && item.placa_principal.toLowerCase().includes(term)) || 
            (item.placa_secundaria && item.placa_secundaria.toLowerCase().includes(term))
        );
      }
      
      setResults(filteredResults);
      
      if (filteredResults.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontrados conveniados com os critérios informados.",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 flex items-center gap-1"><Check size={14} />Ativo</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600">Pendente</Badge>;
      case 'inativo':
        return <Badge variant="destructive" className="flex items-center gap-1"><X size={14} />Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
          let parsedData: ConveniadoData[] = [];
          
          // Detect file format based on extension
          const fileFormat = file.name.toLowerCase().endsWith('.xml') ? 'xml' : 'csv';
          setImportFormat(fileFormat as 'csv' | 'xml');
          
          if (fileFormat === 'xml') {
            // Simple XML parsing (in real implementation, use proper XML parser)
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
                creci: conv.getElementsByTagName("creci")[0]?.textContent || '',
                status: 'pendente',
                email: conv.getElementsByTagName("email")[0]?.textContent || '',
                telefone: conv.getElementsByTagName("telefone")[0]?.textContent || '',
                placa_principal: conv.getElementsByTagName("placa_principal")[0]?.textContent || undefined,
                placa_secundaria: conv.getElementsByTagName("placa_secundaria")[0]?.textContent || undefined,
              });
            }
          } else {
            // CSV parsing (simple implementation, in real world use proper CSV parser)
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
                creci: row.creci || '',
                status: 'pendente',
                email: row.email || '',
                telefone: row.telefone || '',
                placa_principal: row.placa_principal || undefined,
                placa_secundaria: row.placa_secundaria || undefined,
              });
            }
          }
          
          // Basic field validation
          const validations: ImportValidationData[] = [];
          const requiredFields = ['nome', 'sobrenome', 'cpf', 'email', 'telefone'];
          
          const firstRow = parsedData[0] || {};
          Object.keys(firstRow).forEach(key => {
            if (key === 'id' || key === 'status' || key === 'foto') return;
            
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

  const handleImportConfirm = () => {
    // In a real application, this would send the data to the backend
    toast({
      title: "Importação realizada com sucesso",
      description: `${importData.length} conveniados foram importados.`,
    });
    
    setShowImportDialog(false);
    
    // Add the imported data to the results for demonstration
    setResults([...mockData, ...importData]);
  };

  const handleExport = (format: 'csv' | 'xml') => {
    try {
      let data: string;
      let fileName: string;
      let mimeType: string;
      
      // Get data to export (either search results or all mock data)
      const dataToExport = results.length > 0 ? results : mockData;
      
      if (format === 'csv') {
        // Create CSV
        const headers = ['id', 'nome', 'sobrenome', 'cpf', 'creci', 'status', 'email', 'telefone', 'placa_principal', 'placa_secundaria'];
        const csvRows = [
          headers.join(','),
          ...dataToExport.map(item => {
            return [
              item.id,
              item.nome,
              item.sobrenome,
              item.cpf,
              item.creci,
              item.status,
              item.email,
              item.telefone,
              item.placa_principal || '',
              item.placa_secundaria || ''
            ].join(',');
          })
        ];
        
        data = csvRows.join('\n');
        fileName = 'conveniados.csv';
        mimeType = 'text/csv';
      } else {
        // Create XML
        const xmlRows = dataToExport.map(item => {
          return `  <conveniado>
    <id>${item.id}</id>
    <nome>${item.nome}</nome>
    <sobrenome>${item.sobrenome}</sobrenome>
    <cpf>${item.cpf}</cpf>
    <creci>${item.creci || ''}</creci>
    <status>${item.status}</status>
    <email>${item.email}</email>
    <telefone>${item.telefone}</telefone>
    <placa_principal>${item.placa_principal || ''}</placa_principal>
    <placa_secundaria>${item.placa_secundaria || ''}</placa_secundaria>
  </conveniado>`;
        });
        
        data = `<?xml version="1.0" encoding="UTF-8"?>
<conveniados>
${xmlRows.join('\n')}
</conveniados>`;
        fileName = 'conveniados.xml';
        mimeType = 'application/xml';
      }
      
      // Create and trigger download
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
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Pesquisar Conveniados</h1>
      
      <div className="wp-card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Termo de busca</label>
              <div className="relative">
                <Input
                  className="pl-10"
                  placeholder={`Buscar por ${
                    searchType === 'nome' ? 'nome completo' : 
                    searchType === 'cpf' ? 'CPF' : 
                    searchType === 'creci' ? 'número CRECI' : 
                    'placa do veículo'
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Buscar por</label>
              <select 
                className="wp-input w-full"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'nome' | 'cpf' | 'creci' | 'placa')}
              >
                <option value="nome">Nome Completo</option>
                <option value="cpf">CPF</option>
                <option value="creci">CRECI</option>
                <option value="placa">Placa do Veículo</option>
              </select>
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
      </div>
      
      {results.length > 0 && (
        <div className="wp-card">
          <h2 className="wp-subheader">Resultados da Busca</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conveniado</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>CRECI</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Placa Principal</TableHead>
                  <TableHead>Placa Secundária</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={item.foto} alt={`${item.nome} ${item.sobrenome}`} />
                          <AvatarFallback>{item.nome.charAt(0)}{item.sobrenome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{`${item.nome} ${item.sobrenome}`}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.cpf}</TableCell>
                    <TableCell>{item.creci}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      {item.placa_principal && (
                        <div className="flex items-center space-x-1">
                          <Car size={16} />
                          <span>{item.placa_principal}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.placa_secundaria && (
                        <div className="flex items-center space-x-1">
                          <Car size={16} />
                          <span>{item.placa_secundaria}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{item.email}</p>
                        <p>{item.telefone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button className="wp-button-secondary text-xs py-1 px-2">Ver</button>
                        <button className="wp-button text-xs py-1 px-2">Carteirinha</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Import Data Dialog */}
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
                    </TableRow>
                  ))}
                  {importData.length > 5 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
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
            <Button onClick={handleImportConfirm}>
              Importar {importData.length} Registros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PesquisaConveniado;
