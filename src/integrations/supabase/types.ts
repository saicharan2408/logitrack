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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          created_at: string
          id: string
          parts: Json
          role: string
          sdk_id: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parts: Json
          role: string
          sdk_id: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parts?: Json
          role?: string
          sdk_id?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          created_at: string
          earnings: number | null
          id: string
          license: string | null
          location: string | null
          name: string
          phone: string | null
          rating: number
          safety: number | null
          status: string
          success_rate: number | null
          trips: number
          vehicle: string | null
        }
        Insert: {
          created_at?: string
          earnings?: number | null
          id: string
          license?: string | null
          location?: string | null
          name: string
          phone?: string | null
          rating?: number
          safety?: number | null
          status?: string
          success_rate?: number | null
          trips?: number
          vehicle?: string | null
        }
        Update: {
          created_at?: string
          earnings?: number | null
          id?: string
          license?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          rating?: number
          safety?: number | null
          status?: string
          success_rate?: number | null
          trips?: number
          vehicle?: string | null
        }
        Relationships: []
      }
      fuel_logs: {
        Row: {
          cost: number
          created_at: string
          id: string
          litres: number
          log_date: string
          station: string | null
          vehicle: string
        }
        Insert: {
          cost: number
          created_at?: string
          id?: string
          litres: number
          log_date?: string
          station?: string | null
          vehicle: string
        }
        Update: {
          cost?: number
          created_at?: string
          id?: string
          litres?: number
          log_date?: string
          station?: string | null
          vehicle?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string
          location: string | null
          name: string
          qty: number
          sku: string
          weight: string | null
        }
        Insert: {
          created_at?: string
          location?: string | null
          name: string
          qty?: number
          sku: string
          weight?: string | null
        }
        Update: {
          created_at?: string
          location?: string | null
          name?: string
          qty?: number
          sku?: string
          weight?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          customer: string
          due: string
          id: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer: string
          due: string
          id: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer?: string
          due?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      maintenance: {
        Row: {
          cost: number | null
          created_at: string
          due: string
          id: string
          model: string | null
          status: string
          type: string
          vehicle: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          due: string
          id?: string
          model?: string | null
          status?: string
          type: string
          vehicle: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          due?: string
          id?: string
          model?: string | null
          status?: string
          type?: string
          vehicle?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          text: string
          type: string
          unread: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          text: string
          type?: string
          unread?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          text?: string
          type?: string
          unread?: boolean
          user_id?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          created_at: string
          customer: string
          destination: string
          driver: string | null
          eta: string | null
          id: string
          pickup: string
          price: number
          priority: string
          ship_date: string
          status: string
          vehicle: string | null
          weight: string | null
        }
        Insert: {
          created_at?: string
          customer: string
          destination: string
          driver?: string | null
          eta?: string | null
          id: string
          pickup: string
          price?: number
          priority?: string
          ship_date?: string
          status?: string
          vehicle?: string | null
          weight?: string | null
        }
        Update: {
          created_at?: string
          customer?: string
          destination?: string
          driver?: string | null
          eta?: string | null
          id?: string
          pickup?: string
          price?: number
          priority?: string
          ship_date?: string
          status?: string
          vehicle?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          message: string
          status: string
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          status?: string
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          capacity: string | null
          created_at: string
          driver: string | null
          fuel: number
          id: string
          last_service: string | null
          location: string | null
          mileage: string | null
          model: string
          next_service: string | null
          number: string
          odometer: number | null
          status: string
          type: string
        }
        Insert: {
          capacity?: string | null
          created_at?: string
          driver?: string | null
          fuel?: number
          id: string
          last_service?: string | null
          location?: string | null
          mileage?: string | null
          model: string
          next_service?: string | null
          number: string
          odometer?: number | null
          status?: string
          type?: string
        }
        Update: {
          capacity?: string | null
          created_at?: string
          driver?: string | null
          fuel?: number
          id?: string
          last_service?: string | null
          location?: string | null
          mileage?: string | null
          model?: string
          next_service?: string | null
          number?: string
          odometer?: number | null
          status?: string
          type?: string
        }
        Relationships: []
      }
      warehouses: {
        Row: {
          capacity_used: number
          city: string
          created_at: string
          id: string
          incoming: number | null
          name: string
          outgoing: number | null
          skus: number | null
        }
        Insert: {
          capacity_used?: number
          city: string
          created_at?: string
          id: string
          incoming?: number | null
          name: string
          outgoing?: number | null
          skus?: number | null
        }
        Update: {
          capacity_used?: number
          city?: string
          created_at?: string
          id?: string
          incoming?: number | null
          name?: string
          outgoing?: number | null
          skus?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
