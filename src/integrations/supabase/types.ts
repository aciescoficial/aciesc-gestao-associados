export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      conveniados: {
        Row: {
          cidade: string
          cpf: string
          created_at: string
          creci: string | null
          email: string
          id: string
          nome: string
          placa_principal: string | null
          placa_secundaria: string | null
          sobrenome: string
          status: Database["public"]["Enums"]["status_type"]
          telefone: string
          updated_at: string
        }
        Insert: {
          cidade: string
          cpf: string
          created_at?: string
          creci?: string | null
          email: string
          id?: string
          nome: string
          placa_principal?: string | null
          placa_secundaria?: string | null
          sobrenome: string
          status?: Database["public"]["Enums"]["status_type"]
          telefone: string
          updated_at?: string
        }
        Update: {
          cidade?: string
          cpf?: string
          created_at?: string
          creci?: string | null
          email?: string
          id?: string
          nome?: string
          placa_principal?: string | null
          placa_secundaria?: string | null
          sobrenome?: string
          status?: Database["public"]["Enums"]["status_type"]
          telefone?: string
          updated_at?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          cep: string
          cidade: string
          cnpj: string
          created_at: string
          desconto: string
          email: string
          endereco: string
          id: string
          instagram: string | null
          nicho: Database["public"]["Enums"]["nicho_type"]
          nome_fantasia: string
          produtos: string
          razao_social: string
          responsavel: string
          site: string | null
          status: Database["public"]["Enums"]["status_type"]
          telefone: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          cep: string
          cidade: string
          cnpj: string
          created_at?: string
          desconto: string
          email: string
          endereco: string
          id?: string
          instagram?: string | null
          nicho: Database["public"]["Enums"]["nicho_type"]
          nome_fantasia: string
          produtos: string
          razao_social: string
          responsavel: string
          site?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          telefone: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          cep?: string
          cidade?: string
          cnpj?: string
          created_at?: string
          desconto?: string
          email?: string
          endereco?: string
          id?: string
          instagram?: string | null
          nicho?: Database["public"]["Enums"]["nicho_type"]
          nome_fantasia?: string
          produtos?: string
          razao_social?: string
          responsavel?: string
          site?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          telefone?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      user_2fa: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          enabled: boolean
          id: string
          secret: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          enabled?: boolean
          id?: string
          secret?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          enabled?: boolean
          id?: string
          secret?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_access_logs: {
        Row: {
          created_at: string
          event: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          role_to_check: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      nicho_type:
        | "Alimentação"
        | "Saúde"
        | "Educação"
        | "Serviços"
        | "Comércio"
        | "Lazer"
        | "Tecnologia"
        | "Outro"
      status_type: "ativo" | "pendente" | "inativo"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      nicho_type: [
        "Alimentação",
        "Saúde",
        "Educação",
        "Serviços",
        "Comércio",
        "Lazer",
        "Tecnologia",
        "Outro",
      ],
      status_type: ["ativo", "pendente", "inativo"],
      user_role: ["admin", "user"],
    },
  },
} as const
