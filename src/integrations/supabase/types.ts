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
      associados: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string
          complemento: string | null
          cpf: string
          created_at: string
          creci: string | null
          data_nascimento: string | null
          data_ultimo_pagamento: string | null
          email: string
          estado: string | null
          id: string
          nome: string
          numero: string | null
          placa_principal: string | null
          placa_secundaria: string | null
          rua: string | null
          sobrenome: string
          status: Database["public"]["Enums"]["status_type"]
          telefone: string
          tipo_associado: string | null
          tipo_pagamento: string | null
          updated_at: string
          validade: string | null
          valor_devido: string | null
          valor_pago: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade: string
          complemento?: string | null
          cpf: string
          created_at?: string
          creci?: string | null
          data_nascimento?: string | null
          data_ultimo_pagamento?: string | null
          email: string
          estado?: string | null
          id?: string
          nome: string
          numero?: string | null
          placa_principal?: string | null
          placa_secundaria?: string | null
          rua?: string | null
          sobrenome: string
          status?: Database["public"]["Enums"]["status_type"]
          telefone: string
          tipo_associado?: string | null
          tipo_pagamento?: string | null
          updated_at?: string
          validade?: string | null
          valor_devido?: string | null
          valor_pago?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string
          complemento?: string | null
          cpf?: string
          created_at?: string
          creci?: string | null
          data_nascimento?: string | null
          data_ultimo_pagamento?: string | null
          email?: string
          estado?: string | null
          id?: string
          nome?: string
          numero?: string | null
          placa_principal?: string | null
          placa_secundaria?: string | null
          rua?: string | null
          sobrenome?: string
          status?: Database["public"]["Enums"]["status_type"]
          telefone?: string
          tipo_associado?: string | null
          tipo_pagamento?: string | null
          updated_at?: string
          validade?: string | null
          valor_devido?: string | null
          valor_pago?: string | null
        }
        Relationships: []
      }
      association_types: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          interest_payment_by:
            | Database["public"]["Enums"]["interest_payment_by"]
            | null
          max_installments: number | null
          payment_methods: Database["public"]["Enums"]["payment_method"][]
          title: string
          updated_at: string
          value: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          interest_payment_by?:
            | Database["public"]["Enums"]["interest_payment_by"]
            | null
          max_installments?: number | null
          payment_methods: Database["public"]["Enums"]["payment_method"][]
          title: string
          updated_at?: string
          value: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          interest_payment_by?:
            | Database["public"]["Enums"]["interest_payment_by"]
            | null
          max_installments?: number | null
          payment_methods?: Database["public"]["Enums"]["payment_method"][]
          title?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      empresas: {
        Row: {
          capa_url: string | null
          cep: string
          cidade: string
          cnpj: string
          created_at: string
          desconto: string
          email: string
          endereco: string
          id: string
          instagram: string | null
          logo_url: string | null
          nicho: Database["public"]["Enums"]["nicho_type"]
          nome_fantasia: string
          produtos: string
          razao_social: string
          responsavel: string
          site: string | null
          status: Database["public"]["Enums"]["status_type"]
          telefone: string
          updated_at: string
          video_url: string | null
          whatsapp: string | null
        }
        Insert: {
          capa_url?: string | null
          cep: string
          cidade: string
          cnpj: string
          created_at?: string
          desconto: string
          email: string
          endereco: string
          id?: string
          instagram?: string | null
          logo_url?: string | null
          nicho: Database["public"]["Enums"]["nicho_type"]
          nome_fantasia: string
          produtos: string
          razao_social: string
          responsavel: string
          site?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          telefone: string
          updated_at?: string
          video_url?: string | null
          whatsapp?: string | null
        }
        Update: {
          capa_url?: string | null
          cep?: string
          cidade?: string
          cnpj?: string
          created_at?: string
          desconto?: string
          email?: string
          endereco?: string
          id?: string
          instagram?: string | null
          logo_url?: string | null
          nicho?: Database["public"]["Enums"]["nicho_type"]
          nome_fantasia?: string
          produtos?: string
          razao_social?: string
          responsavel?: string
          site?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          telefone?: string
          updated_at?: string
          video_url?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      member_subscriptions: {
        Row: {
          asaas_customer_id: string | null
          asaas_subscription_id: string | null
          associado_id: string
          association_type_id: string
          created_at: string
          id: string
          installments: number | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status: string | null
          updated_at: string
        }
        Insert: {
          asaas_customer_id?: string | null
          asaas_subscription_id?: string | null
          associado_id: string
          association_type_id: string
          created_at?: string
          id?: string
          installments?: number | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status?: string | null
          updated_at?: string
        }
        Update: {
          asaas_customer_id?: string | null
          asaas_subscription_id?: string | null
          associado_id?: string
          association_type_id?: string
          created_at?: string
          id?: string
          installments?: number | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_subscriptions_associado_id_fkey"
            columns: ["associado_id"]
            isOneToOne: false
            referencedRelation: "associados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_subscriptions_association_type_id_fkey"
            columns: ["association_type_id"]
            isOneToOne: false
            referencedRelation: "association_types"
            referencedColumns: ["id"]
          },
        ]
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
      system_config: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
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
      get_auth_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          user_id: string
          role_to_check: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      interest_payment_by: "associacao" | "associado"
      nicho_type:
        | "Alimentação"
        | "Saúde"
        | "Educação"
        | "Serviços"
        | "Comércio"
        | "Lazer"
        | "Tecnologia"
        | "Outro"
      payment_method: "cartao" | "pix" | "boleto"
      status_type: "ativo" | "pendente" | "inativo"
      user_role: "admin" | "user" | "diretoria" | "conveniado" | "associado"
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
      interest_payment_by: ["associacao", "associado"],
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
      payment_method: ["cartao", "pix", "boleto"],
      status_type: ["ativo", "pendente", "inativo"],
      user_role: ["admin", "user", "diretoria", "conveniado", "associado"],
    },
  },
} as const
