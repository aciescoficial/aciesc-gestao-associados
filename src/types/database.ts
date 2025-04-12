
import { Database as OriginalDatabase } from "@/integrations/supabase/types";

// Extended Database type with additional tables
export interface ExtendedDatabase extends OriginalDatabase {
  public: {
    Tables: {
      // Include all original tables from OriginalDatabase
      ...OriginalDatabase['public']['Tables'],
      
      // Add new tables
      associado_interesse: {
        Row: {
          id: string;
          nome: string;
          sobrenome: string;
          cpf: string;
          creci: string | null;
          email: string;
          celular: string;
          cidade: string;
          estado: string;
          motivo_interesse: string | null;
          status: string;
          pagamento_url: string | null;
          pagamento_confirmado: boolean | null;
          pagamento_data: string | null;
          created_at: string | null;
          updated_at: string | null;
          payment_proof_url: string | null;
        };
        Insert: {
          id?: string;
          nome: string;
          sobrenome: string;
          cpf: string;
          creci?: string | null;
          email: string;
          celular: string;
          cidade: string;
          estado: string;
          motivo_interesse?: string | null;
          status?: string;
          pagamento_url?: string | null;
          pagamento_confirmado?: boolean | null;
          pagamento_data?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          payment_proof_url?: string | null;
        };
        Update: {
          id?: string;
          nome?: string;
          sobrenome?: string;
          cpf?: string;
          creci?: string | null;
          email?: string;
          celular?: string;
          cidade?: string;
          estado?: string;
          motivo_interesse?: string | null;
          status?: string;
          pagamento_url?: string | null;
          pagamento_confirmado?: boolean | null;
          pagamento_data?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          payment_proof_url?: string | null;
        };
        Relationships: [];
      };
      
      email_templates: {
        Row: {
          id: string;
          nome: string;
          assunto: string;
          corpo: string;
          codigo: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          nome: string;
          assunto: string;
          corpo: string;
          codigo: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          nome?: string;
          assunto?: string;
          corpo?: string;
          codigo?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      
      signup_tokens: {
        Row: {
          id: string;
          token: string;
          associado_interesse_id: string;
          expires_at: string;
          used: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          token: string;
          associado_interesse_id: string;
          expires_at: string;
          used?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          token?: string;
          associado_interesse_id?: string;
          expires_at?: string;
          used?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "signup_tokens_associado_interesse_id_fkey";
            columns: ["associado_interesse_id"];
            referencedRelation: "associado_interesse";
            referencedColumns: ["id"];
          }
        ];
      };
      
      email_logs: {
        Row: {
          id: string;
          recipient: string;
          subject: string;
          body: string;
          status: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          recipient: string;
          subject: string;
          body: string;
          status: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          recipient?: string;
          subject?: string;
          body?: string;
          status?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      ...OriginalDatabase['public']['Views'];
    };
    Functions: {
      ...OriginalDatabase['public']['Functions'];
    };
    Enums: {
      ...OriginalDatabase['public']['Enums'];
    };
  };
}

// Create a customized supabase client type
export type ExtendedSupabaseClient = ReturnType<typeof createExtendedClient>;

// Helper function to create the extended client
export function createExtendedClient() {
  // This is just a type helper, not meant to be called at runtime
  throw new Error("This function is not meant to be called at runtime");
}
