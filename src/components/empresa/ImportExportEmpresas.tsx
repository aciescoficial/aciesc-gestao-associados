
import React from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useImportExport } from './import/useImportExport';
import ImportPreview from './import/ImportPreview';
import ImportInstructions from './import/ImportInstructions';
import { useAuth } from '@/components/auth';
import { useToast } from '@/hooks/use-toast';
import { logOperation } from '@/components/audit/auditLogService';

interface ImportExportEmpresasProps {
  onImportSuccess: () => void;
}

const ImportExportEmpresas: React.FC<ImportExportEmpresasProps> = ({ onImportSuccess }) => {
  const {
    isImportDialogOpen,
    setIsImportDialogOpen,
    isExporting,
    isImporting,
    importData,
    rawCsvData,
    csvHeaders,
    importErrors,
    fieldMapping,
    fileInputRef,
    handleFileSelect,
    handleFieldMappingChange,
    handleExportEmpresas,
    handleConfirmImport
  } = useImportExport({ 
    onImportSuccess,
    onExportSuccess: async (format, count) => {
      await logOperation({
        eventType: 'export',
        entityType: 'empresa',
        format,
        recordCount: count,
        details: `Exportação de ${count} empresas em ${format.toUpperCase()}`
      });
    } 
  });
  
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground bg-muted/10 rounded-lg">
        <p>Apenas administradores podem acessar as funcionalidades de importação e exportação.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Download className="h-5 w-5" />
              Importação e Exportação
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie os dados das empresas conveniadas através de arquivos CSV
            </p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={handleExportEmpresas}
              disabled={isExporting}
              className="flex-1 md:flex-none"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exportando...' : 'Exportar CSV'}
            </Button>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex-1 md:flex-none"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? 'Importando...' : 'Importar CSV'}
            </Button>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".csv"
              className="hidden" 
            />
          </div>
        </div>
        
        <div className="bg-muted/10 rounded-lg p-6">
          <ImportInstructions />
        </div>
        
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Revisar Dados para Importação</DialogTitle>
              <DialogDescription>
                Mapeie os campos do seu arquivo CSV para os campos do sistema e revise os dados antes de confirmar a importação.
              </DialogDescription>
            </DialogHeader>
            
            <ImportPreview 
              data={importData}
              rawData={rawCsvData}
              csvHeaders={csvHeaders} 
              errors={importErrors}
              fieldMapping={fieldMapping}
              onFieldMappingChange={handleFieldMappingChange}
              onConfirm={handleConfirmImport}
              onCancel={() => setIsImportDialogOpen(false)}
              isImporting={isImporting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ImportExportEmpresas;
