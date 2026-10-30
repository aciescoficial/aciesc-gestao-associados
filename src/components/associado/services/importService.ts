
import { ImportAssociadoData } from "../types";
import { processBatches } from "./batch/batchProcessor";
import { toast } from "@/hooks/use-toast";

/**
 * Imports associados in batches to avoid hitting Supabase limits
 * @param associados Array of associados to import
 * @param criarUsuarios Boolean to indicate if users should be created
 */
export const importAssociados = async (associados: ImportAssociadoData[], criarUsuarios: boolean): Promise<number> => {
  try {
    console.log(`Starting import of ${associados.length} associados, create users: ${criarUsuarios}`);
    
    // First, validate required fields
    const invalidAssociados = associados.filter(a => 
      !a.email || !a.nome || !a.sobrenome || !a.cpf || !a.cidade
    );
    
    if (invalidAssociados.length > 0) {
      console.error("Found invalid associados:", invalidAssociados);
      toast({
        title: "Dados inválidos",
        description: `${invalidAssociados.length} associados não possuem todos os dados obrigatórios e serão ignorados.`,
        variant: "warning"
      });
    }
    
    // Filter out invalid associados
    const validAssociados = associados.filter(a => 
      a.email && a.nome && a.sobrenome && a.cpf && a.cidade
    );
    
    if (validAssociados.length === 0) {
      toast({
        title: "Sem dados válidos",
        description: "Nenhum associado possui todos os dados obrigatórios para importação.",
        variant: "destructive"
      });
      return 0;
    }
    
    const result = await processBatches(validAssociados, criarUsuarios);
    
    // Log success
    console.log(`Import completed: ${result} associados imported`);
    
    return result;
  } catch (error) {
    console.error("Error during import:", error);
    toast({
      title: "Erro na importação",
      description: "Ocorreu um erro durante a importação. Verifique os logs para mais detalhes.",
      variant: "destructive"
    });
    return 0;
  }
};
