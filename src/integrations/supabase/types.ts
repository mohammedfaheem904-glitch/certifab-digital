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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          country: string | null
          created_at: string
          id: string
          industry: string | null
          name: string
          plan: string
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name: string
          plan?: string
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name?: string
          plan?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          asset_id: string
          calibration_due: string | null
          company_id: string
          created_at: string
          id: string
          model: string
          status: Database["public"]["Enums"]["equipment_status"]
          updated_at: string
        }
        Insert: {
          asset_id: string
          calibration_due?: string | null
          company_id: string
          created_at?: string
          id?: string
          model: string
          status?: Database["public"]["Enums"]["equipment_status"]
          updated_at?: string
        }
        Update: {
          asset_id?: string
          calibration_due?: string | null
          company_id?: string
          created_at?: string
          id?: string
          model?: string
          status?: Database["public"]["Enums"]["equipment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          company_id: string
          created_at: string
          defect_type: string | null
          id: string
          inspected_at: string
          inspection_type: string
          inspector_name: string | null
          ncr_code: string | null
          project_id: string | null
          severity: Database["public"]["Enums"]["severity_level"] | null
          status: string
          updated_at: string
          weld_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          defect_type?: string | null
          id?: string
          inspected_at?: string
          inspection_type: string
          inspector_name?: string | null
          ncr_code?: string | null
          project_id?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          status?: string
          updated_at?: string
          weld_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          defect_type?: string | null
          id?: string
          inspected_at?: string
          inspection_type?: string
          inspector_name?: string | null
          ncr_code?: string | null
          project_id?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          status?: string
          updated_at?: string
          weld_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_weld_id_fkey"
            columns: ["weld_id"]
            isOneToOne: false
            referencedRelation: "welds"
            referencedColumns: ["id"]
          },
        ]
      }
      procedures: {
        Row: {
          code: string
          company_id: string
          created_at: string
          id: string
          notes: string | null
          process: string
          revision: string
          standard: string
          status: Database["public"]["Enums"]["procedure_status"]
          thickness_range: string | null
          updated_at: string
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string
          id?: string
          notes?: string | null
          process: string
          revision?: string
          standard: string
          status?: Database["public"]["Enums"]["procedure_status"]
          thickness_range?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          process?: string
          revision?: string
          standard?: string
          status?: Database["public"]["Enums"]["procedure_status"]
          thickness_range?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procedures_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          display_name: string | null
          id: string
          job_title: string | null
          language: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          job_title?: string | null
          language?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          job_title?: string | null
          language?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client: string | null
          code: string
          company_id: string
          created_at: string
          end_date: string | null
          id: string
          location: string | null
          name: string
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          client?: string | null
          code: string
          company_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          location?: string | null
          name: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          client?: string | null
          code?: string
          company_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          location?: string | null
          name?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      qualifications: {
        Row: {
          company_id: string
          created_at: string
          employee_id: string
          expiry_date: string
          id: string
          process: string
          standard: string
          status: Database["public"]["Enums"]["qualification_status"]
          updated_at: string
          welder_name: string
        }
        Insert: {
          company_id: string
          created_at?: string
          employee_id: string
          expiry_date: string
          id?: string
          process: string
          standard: string
          status?: Database["public"]["Enums"]["qualification_status"]
          updated_at?: string
          welder_name: string
        }
        Update: {
          company_id?: string
          created_at?: string
          employee_id?: string
          expiry_date?: string
          id?: string
          process?: string
          standard?: string
          status?: Database["public"]["Enums"]["qualification_status"]
          updated_at?: string
          welder_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "qualifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      welds: {
        Row: {
          company_id: string
          created_at: string
          heat_input: string | null
          id: string
          procedure_id: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["weld_status"]
          updated_at: string
          weld_date: string
          weld_no: string
          welder_name: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          heat_input?: string | null
          id?: string
          procedure_id?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["weld_status"]
          updated_at?: string
          weld_date?: string
          weld_no: string
          welder_name?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          heat_input?: string | null
          id?: string
          procedure_id?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["weld_status"]
          updated_at?: string
          weld_date?: string
          weld_no?: string
          welder_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "welds_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "welds_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "welds_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_company_id: { Args: never; Returns: string }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_company_member: { Args: { _company_id: string }; Returns: boolean }
      is_editor: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "qa_qc_manager"
        | "welding_engineer"
        | "inspector"
        | "welder"
        | "client_viewer"
      equipment_status:
        | "Operational"
        | "Maintenance"
        | "Calibration Due"
        | "Out of Service"
      procedure_status: "Draft" | "Review" | "Approved" | "Archived"
      project_status:
        | "Planning"
        | "Active"
        | "On Hold"
        | "Completed"
        | "Cancelled"
      qualification_status: "Active" | "Expiring Soon" | "Expired" | "Suspended"
      severity_level: "Low" | "Medium" | "High" | "Critical"
      weld_status: "Accepted" | "Rejected" | "Repair" | "Pending"
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
      app_role: [
        "super_admin",
        "qa_qc_manager",
        "welding_engineer",
        "inspector",
        "welder",
        "client_viewer",
      ],
      equipment_status: [
        "Operational",
        "Maintenance",
        "Calibration Due",
        "Out of Service",
      ],
      procedure_status: ["Draft", "Review", "Approved", "Archived"],
      project_status: [
        "Planning",
        "Active",
        "On Hold",
        "Completed",
        "Cancelled",
      ],
      qualification_status: ["Active", "Expiring Soon", "Expired", "Suspended"],
      severity_level: ["Low", "Medium", "High", "Critical"],
      weld_status: ["Accepted", "Rejected", "Repair", "Pending"],
    },
  },
} as const
