
import React, { useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/components/auth';
import { ImportExportActions } from './ImportExportActions';
import { ImportDialog } from './ImportDialog';
import { ImportAssociadoData, ImportValidationData } from './types';
import { importAssociados } from './associadoService';
import { logOperation } from '../audit/auditLogService';
import { useAssociadoExport } from "./hooks/useAssociadoExport";
import { useAssociadoImport } from "./hooks/useAssociadoImport";

export const ImportExportAssociado: React.FC = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState<ImportAssociadoData[]>([]);
  const [validationData, setValidationData] = useState<ImportValidationData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const { handleExportCsv, handleExportXml } = useAssociadoExport();
  const { parseImportFile } = useAssociadoImport();

  const handleImportClick = () => {
    if (!isAdmin) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem importar dados.",
        variant: "destructive",
      });
      return;
    }
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;

    const file = e.target.files?.[0];
    if (!file) return;
    await parseImportFile(file, setImportData, setValidationData);
    setImportDialogOpen(true);
  };

  // Persist user choice of "criar usuário" in ImportDialog via localStorage
  const handleConfirmImport = async () => {
    if (!isAdmin) return;
    setIsSubmitting(true);
    try {
      const criarUsuarios = localStorage.getItem('importarCriarUsuarios') === 'true';
      const count = await importAssociados(importData, criarUsuarios);
      await logOperation({
        eventType: 'import',
        entityType: 'associado',
        format: 'csv',
        recordCount: count,
        details: `Importação de ${count} associados${criarUsuarios ? ' com criação de usuários' : ''}`
      });
      toast({
        title: "Importação concluída",
        description: `${count} associados foram importados com sucesso${criarUsuarios ? ' e usuários foram criados' : ''}.`,
      });
      localStorage.removeItem('importarCriarUsuarios');
      setImportDialogOpen(false);
      setImportData([]);
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: "Erro na importação",
        description: "Não foi possível importar os associados. Tente novamente.",
        variant: "destructive",
      });
      localStorage.removeItem('importarCriarUsuarios');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ImportExportActions
        onImportClick={handleImportClick}
        onFileChange={handleFileChange}
        onExportCsv={() => handleExportCsv(isAdmin)}
        onExportXml={() => handleExportXml(isAdmin)}
        fileInputRef={fileInputRef}
        isAdmin={isAdmin}
      />

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        importData={importData}
        validationData={validationData}
        setValidationData={setValidationData}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirmImport}
      />
    </>
  );
};
