
import { exportAssociados } from "../associadoService";
import { logOperation } from "../../audit/auditLogService";
import { useToast } from "@/hooks/use-toast";

export function useAssociadoExport() {
  const { toast } = useToast();

  const formatDateForExport = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const downloadFile = (content: string, mimeType: string, filename: string): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = async (isAdmin: boolean) => {
    if (!isAdmin) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem exportar dados.",
        variant: "destructive",
      });
      return;
    }
    try {
      const associados = await exportAssociados();
      if (!associados.length) {
        toast({
          title: "Nenhum dado para exportar",
          description: "Não há associados cadastrados para exportar.",
        });
        return;
      }
      const Papa = (await import('papaparse')).default;
      const csvContent = Papa.unparse({
        fields: [
          'Nome', 'Sobrenome', 'Email', 'Celular', 'CRECI-SC', 'CPF', 
          'Rua', 'Número', 'Complemento', 'Bairro', 'Cidade', 
          'Estado', 'CEP', 'Valor Pago', 'Valor Devido',
          'Tipo Pagamento', 'Tipo Associado', 'Validade'
        ],
        data: associados.map((a: any) => ([
          a.nome,
          a.sobrenome || '',
          a.email,
          a.telefone,
          a.creci || '',
          a.cpf,
          a.rua || '',
          a.numero || '',
          a.complemento || '',
          a.bairro || '',
          a.cidade || '',
          a.estado || '',
          a.cep || '',
          a.valor_pago || '',
          a.valor_devido || '',
          a.tipo_pagamento || '',
          a.tipo_associado || '',
          formatDateForExport(a.validade || '')
        ]))
      });
      downloadFile(csvContent, 'text/csv;charset=utf-8;', `associados_${new Date().toISOString().split('T')[0]}.csv`);
      await logOperation({
        eventType: 'export',
        entityType: 'associado',
        format: 'csv',
        recordCount: associados.length,
        details: `Exportação de ${associados.length} associados em CSV`
      });

    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os associados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleExportXml = async (isAdmin: boolean) => {
    if (!isAdmin) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem exportar dados.",
        variant: "destructive",
      });
      return;
    }
    try {
      const associados = await exportAssociados();
      if (!associados.length) {
        toast({
          title: "Nenhum dado para exportar",
          description: "Não há associados cadastrados para exportar.",
        });
        return;
      }
      let xml = '<?xml version="1.0" encoding="UTF-8" ?>\n<associados>\n';
      associados.forEach((a: any) => {
        xml += '  <associado>\n';
        xml += `    <nome>${a.nome}</nome>\n`;
        xml += `    <sobrenome>${a.sobrenome || ''}</sobrenome>\n`;
        xml += `    <email>${a.email}</email>\n`;
        xml += `    <celular>${a.telefone}</celular>\n`;
        xml += `    <creci>${a.creci || ''}</creci>\n`;
        xml += `    <cpf>${a.cpf}</cpf>\n`;
        xml += `    <rua>${a.rua || ''}</rua>\n`;
        xml += `    <numero>${a.numero || ''}</numero>\n`;
        xml += `    <complemento>${a.complemento || ''}</complemento>\n`;
        xml += `    <bairro>${a.bairro || ''}</bairro>\n`;
        xml += `    <cidade>${a.cidade || ''}</cidade>\n`;
        xml += `    <estado>${a.estado || ''}</estado>\n`;
        xml += `    <cep>${a.cep || ''}</cep>\n`;
        xml += `    <valorPago>${a.valor_pago || ''}</valorPago>\n`;
        xml += `    <valorDevido>${a.valor_devido || ''}</valorDevido>\n`;
        xml += `    <tipoPagamento>${a.tipo_pagamento || ''}</tipoPagamento>\n`;
        xml += `    <tipoAssociado>${a.tipo_associado || ''}</tipoAssociado>\n`;
        xml += `    <validade>${formatDateForExport(a.validade || '')}</validade>\n`;
        xml += '  </associado>\n';
      });
      xml += '</associados>';
      downloadFile(xml, 'application/xml;charset=utf-8;', `associados_${new Date().toISOString().split('T')[0]}.xml`);
      await logOperation({
        eventType: 'export',
        entityType: 'associado',
        format: 'xml',
        recordCount: associados.length,
        details: `Exportação de ${associados.length} associados em XML`
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os associados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return { handleExportCsv, handleExportXml };
}
