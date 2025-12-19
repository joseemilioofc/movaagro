export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alert_history: {
        Row: {
          alert_type: string
          details: Json | null
          id: string
          kpi_names: string[]
          recipients: string[]
          sent_at: string
        }
        Insert: {
          alert_type: string
          details?: Json | null
          id?: string
          kpi_names: string[]
          recipients: string[]
          sent_at?: string
        }
        Update: {
          alert_type?: string
          details?: Json | null
          id?: string
          kpi_names?: string[]
          recipients?: string[]
          sent_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_id: string
          transport_request_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_id: string
          transport_request_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
          transport_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_transport_request_id_fkey"
            columns: ["transport_request_id"]
            isOneToOne: false
            referencedRelation: "transport_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_contracts: {
        Row: {
          cargo_type: string
          contract_number: string
          cooperative_id: string
          cooperative_signature: string | null
          cooperative_signed_at: string | null
          created_at: string
          destination_address: string
          id: string
          origin_address: string
          pickup_date: string
          price: number
          proposal_id: string
          status: string
          terms: string
          transport_request_id: string
          transporter_id: string
          transporter_signature: string | null
          transporter_signed_at: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          cargo_type: string
          contract_number: string
          cooperative_id: string
          cooperative_signature?: string | null
          cooperative_signed_at?: string | null
          created_at?: string
          destination_address: string
          id?: string
          origin_address: string
          pickup_date: string
          price: number
          proposal_id: string
          status?: string
          terms: string
          transport_request_id: string
          transporter_id: string
          transporter_signature?: string | null
          transporter_signed_at?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          cargo_type?: string
          contract_number?: string
          cooperative_id?: string
          cooperative_signature?: string | null
          cooperative_signed_at?: string | null
          created_at?: string
          destination_address?: string
          id?: string
          origin_address?: string
          pickup_date?: string
          price?: number
          proposal_id?: string
          status?: string
          terms?: string
          transport_request_id?: string
          transporter_id?: string
          transporter_signature?: string | null
          transporter_signed_at?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_contracts_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "transport_proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "digital_contracts_transport_request_id_fkey"
            columns: ["transport_request_id"]
            isOneToOne: false
            referencedRelation: "transport_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_alerts: {
        Row: {
          created_at: string
          email_alert: boolean
          id: string
          kpi_name: string
          last_alert_sent_at: string | null
          threshold_percentage: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_alert?: boolean
          id?: string
          kpi_name: string
          last_alert_sent_at?: string | null
          threshold_percentage?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_alert?: boolean
          id?: string
          kpi_name?: string
          last_alert_sent_at?: string | null
          threshold_percentage?: number
          updated_at?: string
        }
        Relationships: []
      }
      kpi_goals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          target_value: number
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          target_value?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          target_value?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      price_calculations: {
        Row: {
          cargo_type: string
          created_at: string
          destination: string
          distance_km: number
          id: string
          origin: string
          price_max: number
          price_min: number
          user_id: string
          weight_kg: number
        }
        Insert: {
          cargo_type: string
          created_at?: string
          destination: string
          distance_km: number
          id?: string
          origin: string
          price_max: number
          price_min: number
          user_id: string
          weight_kg: number
        }
        Update: {
          cargo_type?: string
          created_at?: string
          destination?: string
          distance_km?: number
          id?: string
          origin?: string
          price_max?: number
          price_min?: number
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewed_id: string
          reviewer_id: string
          transport_request_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewed_id: string
          reviewer_id: string
          transport_request_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewed_id?: string
          reviewer_id?: string
          transport_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_transport_request_id_fkey"
            columns: ["transport_request_id"]
            isOneToOne: false
            referencedRelation: "transport_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_locations: {
        Row: {
          accuracy: number | null
          created_at: string
          heading: number | null
          id: string
          latitude: number
          longitude: number
          speed: number | null
          transport_request_id: string
          transporter_id: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          speed?: number | null
          transport_request_id: string
          transporter_id: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          speed?: number | null
          transport_request_id?: string
          transporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_locations_transport_request_id_fkey"
            columns: ["transport_request_id"]
            isOneToOne: false
            referencedRelation: "transport_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_proposals: {
        Row: {
          admin_confirmed_at: string | null
          admin_confirmed_by: string | null
          created_at: string
          description: string
          id: string
          mova_account: string | null
          payment_code: string | null
          payment_proof_url: string | null
          price: number
          status: string | null
          transport_request_id: string
          transporter_id: string
          updated_at: string
        }
        Insert: {
          admin_confirmed_at?: string | null
          admin_confirmed_by?: string | null
          created_at?: string
          description: string
          id?: string
          mova_account?: string | null
          payment_code?: string | null
          payment_proof_url?: string | null
          price: number
          status?: string | null
          transport_request_id: string
          transporter_id: string
          updated_at?: string
        }
        Update: {
          admin_confirmed_at?: string | null
          admin_confirmed_by?: string | null
          created_at?: string
          description?: string
          id?: string
          mova_account?: string | null
          payment_code?: string | null
          payment_proof_url?: string | null
          price?: number
          status?: string | null
          transport_request_id?: string
          transporter_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_proposals_transport_request_id_fkey"
            columns: ["transport_request_id"]
            isOneToOne: false
            referencedRelation: "transport_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_requests: {
        Row: {
          cargo_type: string
          cooperative_id: string
          created_at: string
          description: string | null
          destination_address: string
          external_form_link: string | null
          id: string
          origin_address: string
          pickup_date: string
          status: string | null
          title: string
          transporter_id: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          cargo_type: string
          cooperative_id: string
          created_at?: string
          description?: string | null
          destination_address: string
          external_form_link?: string | null
          id?: string
          origin_address: string
          pickup_date: string
          status?: string | null
          title: string
          transporter_id?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          cargo_type?: string
          cooperative_id?: string
          created_at?: string
          description?: string | null
          destination_address?: string
          external_form_link?: string | null
          id?: string
          origin_address?: string
          pickup_date?: string
          status?: string | null
          title?: string
          transporter_id?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "cooperative" | "transporter"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "cooperative", "transporter"],
    },
  },
} as const
