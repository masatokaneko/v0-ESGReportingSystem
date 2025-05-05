export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      data_entries: {
        Row: {
          activity_amount: number | null
          activity_type: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          department_id: number | null
          emission: number | null
          emission_factor_id: number | null
          entry_date: string | null
          id: number
          location_id: number | null
          notes: string | null
          status: string | null
          submitter: string | null
          updated_at: string | null
        }
        Insert: {
          activity_amount?: number | null
          activity_type?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          department_id?: number | null
          emission?: number | null
          emission_factor_id?: number | null
          entry_date?: string | null
          id?: number
          location_id?: number | null
          notes?: string | null
          status?: string | null
          submitter?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_amount?: number | null
          activity_type?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          department_id?: number | null
          emission?: number | null
          emission_factor_id?: number | null
          entry_date?: string | null
          id?: number
          location_id?: number | null
          notes?: string | null
          status?: string | null
          submitter?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_entries_department_id_fkey"
            columns: ["department_id"]
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_entries_emission_factor_id_fkey"
            columns: ["emission_factor_id"]
            referencedRelation: "emission_factors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_entries_location_id_fkey"
            columns: ["location_id"]
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string | null
          created_at: string
          id: number
          name: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: number
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: number
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      emission_factors: {
        Row: {
          activity_type: string | null
          category: string | null
          created_at: string
          factor: number | null
          id: number
          unit: string | null
          updated_at: string | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          activity_type?: string | null
          category?: string | null
          created_at?: string
          factor?: number | null
          id?: number
          unit?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          activity_type?: string | null
          category?: string | null
          created_at?: string
          factor?: number | null
          id?: number
          unit?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          component: string | null
          context: Json | null
          created_at: string
          error_type: string | null
          id: string
          message: string | null
          request_data: Json | null
          resolution_notes: string | null
          resolved_at: string | null
          route: string | null
          severity: string | null
          stack_trace: string | null
          status: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          component?: string | null
          context?: Json | null
          created_at?: string
          error_type?: string | null
          id?: string
          message?: string | null
          request_data?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          route?: string | null
          severity?: string | null
          stack_trace?: string | null
          status?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          component?: string | null
          context?: Json | null
          created_at?: string
          error_type?: string | null
          id?: string
          message?: string | null
          request_data?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          route?: string | null
          severity?: string | null
          stack_trace?: string | null
          status?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          code: string | null
          created_at: string
          id: number
          name: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          code?: string | null
          created_at?: string
          id?: number
          name?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          code?: string | null
          created_at?: string
          id?: number
          name?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          policy_name: string
          roles: string[]
          cmd: string
          qual: string
          with_check: string
        }[]
      }
      get_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          row_security: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
