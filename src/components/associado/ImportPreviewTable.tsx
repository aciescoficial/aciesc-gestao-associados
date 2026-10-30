
import React from 'react';
import { ImportAssociadoData, ImportValidationData } from './types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImportPreviewTableProps {
  importData: ImportAssociadoData[];
  validationData: ImportValidationData[];
}

export const ImportPreviewTable: React.FC<ImportPreviewTableProps> = ({ 
  importData, 
  validationData
}) => {
  // Filter out ignored fields
  const ignoredFields = new Set(
    validationData
      .filter(v => v.ignored)
      .map(v => v.fieldName)
  );

  // Get fields to display
  const fieldsToShow = validationData
    .filter(v => !v.ignored)
    .map(v => v.fieldName)
    .filter(field => field !== 'id'); // Don't show id field

  // Limit to at most 10 fields for preview
  const limitedFields = fieldsToShow.slice(0, 10);
  
  // Determine how many rows to show in preview
  const rowsToShow = importData.slice(0, 5); // Show first 5 rows
  const totalRows = importData.length;
  const hiddenRows = totalRows - rowsToShow.length;

  return (
    <div className="space-y-4 my-4">
      <h4 className="font-medium">Pré-visualização dos dados</h4>

      <ScrollArea className="h-[350px] w-full rounded-md border overflow-auto">
        <Table className="w-auto min-w-full">
          <TableHeader className="sticky top-0 bg-muted">
            <TableRow>
              {limitedFields.map(field => (
                <TableHead key={field} className="whitespace-nowrap">
                  {field}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowsToShow.map((item, idx) => (
              <TableRow key={idx}>
                {limitedFields.map(field => (
                  <TableCell key={field} className="truncate max-w-[200px]">
                    {item[field] !== undefined && item[field] !== null && item[field] !== '' 
                      ? String(item[field]) 
                      : <span className="text-muted-foreground italic">(vazio)</span>}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      
      <div className="flex flex-col gap-2">
        {hiddenRows > 0 && (
          <p className="text-sm text-muted-foreground">
            {hiddenRows} {hiddenRows === 1 ? 'linha adicional não mostrada' : 'linhas adicionais não mostradas'} no preview.
          </p>
        )}
        
        {fieldsToShow.length > limitedFields.length && (
          <p className="text-sm text-muted-foreground">
            {fieldsToShow.length - limitedFields.length} {(fieldsToShow.length - limitedFields.length) === 1 ? 'campo adicional não mostrado' : 'campos adicionais não mostrados'} no preview.
          </p>
        )}
        
        {ignoredFields.size > 0 && (
          <p className="text-sm text-muted-foreground">
            {ignoredFields.size} {ignoredFields.size === 1 ? 'campo ignorado' : 'campos ignorados'} não {ignoredFields.size === 1 ? 'será importado' : 'serão importados'}.
          </p>
        )}
      </div>
    </div>
  );
};
