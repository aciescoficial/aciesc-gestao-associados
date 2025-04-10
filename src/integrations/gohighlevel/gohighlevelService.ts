
import { supabase } from "@/integrations/supabase/client";

// Tipos para sincronização
export interface SyncItemResult {
  id: string;
  success: boolean;
  ghlId?: string;
  error?: string;
}

export interface SyncResults {
  successful: number;
  failed: number;
  details: SyncItemResult[];
}

// Testa a conexão com o Go High Level
export const testGohighlevelConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("gohighlevel-integration", {
      body: {},
      methodName: "test-connection"
    });

    if (error) throw error;
    return !!data && !!data.id;
  } catch (error) {
    console.error("Erro ao testar conexão com Go High Level:", error);
    return false;
  }
};

// Sincroniza conveniados selecionados com o Go High Level
export const syncConveniados = async (conveniados: any[]): Promise<SyncResults> => {
  try {
    const { data, error } = await supabase.functions.invoke("gohighlevel-integration", {
      body: { conveniados },
      methodName: "sync-conveniados"
    });

    if (error) throw error;
    
    const successful = data.filter((item: SyncItemResult) => item.success).length;
    const failed = data.length - successful;
    
    return {
      successful,
      failed,
      details: data
    };
  } catch (error) {
    console.error("Erro ao sincronizar conveniados:", error);
    throw error;
  }
};

// Sincroniza empresas selecionadas com o Go High Level
export const syncEmpresas = async (empresas: any[]): Promise<SyncResults> => {
  try {
    const { data, error } = await supabase.functions.invoke("gohighlevel-integration", {
      body: { empresas },
      methodName: "sync-empresas"
    });

    if (error) throw error;
    
    const successful = data.filter((item: SyncItemResult) => item.success).length;
    const failed = data.length - successful;
    
    return {
      successful,
      failed,
      details: data
    };
  } catch (error) {
    console.error("Erro ao sincronizar empresas:", error);
    throw error;
  }
};
