export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      locations: {
        Row: {
          id: number
          name: string
          code: string
          address: string | null
          type: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          code: string
          address?: string | null
          type: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          code?: string
          address?: string | null
          type?: string
          created_at?: string
        }
      }
      emission_factors: {
        Row: {
          id: number
          activity_type: string
          category: string
          factor: number
          unit: string
          valid_from: string
          valid_to: string | null
          created_at: string
        }
        Insert: {
          id?: number
          activity_type: string
          category: string
          factor: number
          unit: string
          valid_from?: string
          valid_to?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          activity_type?: string
          category?: string
          factor?: number
          unit?: string
          valid_from?: string
          valid_to?: string | null
          created_at?: string
        }
      }
      esg_entries: {
        Row: {
          id: number
          date: string
          location: string
          department: string
          activity_type: string
          activity_amount: number
          emission_factor: number
          emission: number
          status: string
          submitter: string
          submitted_at: string
          approved_by: string | null
          approved_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          date: string
          location: string
          department: string
          activity_type: string
          activity_amount: number
          emission_factor: number
          emission: number
          status?: string
          submitter: string
          submitted_at?: string
          approved_by?: string | null
          approved_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          date?: string
          location?: string
          department?: string
          activity_type?: string
          activity_amount?: number
          emission_factor?: number
          emission?: number
          status?: string
          submitter?: string
          submitted_at?: string
          approved_by?: string | null
          approved_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
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