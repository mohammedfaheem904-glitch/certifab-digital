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
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          after: Json | null
          before: Json | null
          company_id: string
          created_at: string
          id: string
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          after?: Json | null
          before?: Json | null
          company_id: string
          created_at?: string
          id?: string
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          after?: Json | null
          before?: Json | null
          company_id?: string
          created_at?: string
          id?: string
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          allowed_email_domains: string[]
          country: string | null
          created_at: string
          dedicated_domain: string | null
          email_from_name: string | null
          id: string
          industry: string | null
          is_internal: boolean
          logo_url: string | null
          name: string
          plan: string
          report_footer: string | null
          updated_at: string
        }
        Insert: {
          allowed_email_domains?: string[]
          country?: string | null
          created_at?: string
          dedicated_domain?: string | null
          email_from_name?: string | null
          id?: string
          industry?: string | null
          is_internal?: boolean
          logo_url?: string | null
          name: string
          plan?: string
          report_footer?: string | null
          updated_at?: string
        }
        Update: {
          allowed_email_domains?: string[]
          country?: string | null
          created_at?: string
          dedicated_domain?: string | null
          email_from_name?: string | null
          id?: string
          industry?: string | null
          is_internal?: boolean
          logo_url?: string | null
          name?: string
          plan?: string
          report_footer?: string | null
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
      heat_inputs: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          current_amp: number
          heat_input: number
          id: string
          notes: string | null
          procedure_id: string | null
          travel_speed: number
          voltage: number
          weld_id: string | null
          within_limits: boolean | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          current_amp: number
          heat_input: number
          id?: string
          notes?: string | null
          procedure_id?: string | null
          travel_speed: number
          voltage: number
          weld_id?: string | null
          within_limits?: boolean | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          current_amp?: number
          heat_input?: number
          id?: string
          notes?: string | null
          procedure_id?: string | null
          travel_speed?: number
          voltage?: number
          weld_id?: string | null
          within_limits?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "heat_inputs_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "heat_inputs_weld_id_fkey"
            columns: ["weld_id"]
            isOneToOne: false
            referencedRelation: "welds"
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
      instrument_calibrations: {
        Row: {
          calibrated_on: string
          certificate_path: string | null
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          instrument_id: string
          next_due: string | null
          notes: string | null
          performed_by: string | null
        }
        Insert: {
          calibrated_on: string
          certificate_path?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          instrument_id: string
          next_due?: string | null
          notes?: string | null
          performed_by?: string | null
        }
        Update: {
          calibrated_on?: string
          certificate_path?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          instrument_id?: string
          next_due?: string | null
          notes?: string | null
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instrument_calibrations_instrument_id_fkey"
            columns: ["instrument_id"]
            isOneToOne: false
            referencedRelation: "instruments"
            referencedColumns: ["id"]
          },
        ]
      }
      instrument_events: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          company_id: string
          created_at: string
          id: string
          instrument_id: string
          kind: string
          payload: Json | null
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string | null
          company_id: string
          created_at?: string
          id?: string
          instrument_id: string
          kind: string
          payload?: Json | null
        }
        Update: {
          actor_id?: string | null
          actor_name?: string | null
          company_id?: string
          created_at?: string
          id?: string
          instrument_id?: string
          kind?: string
          payload?: Json | null
        }
        Relationships: []
      }
      instruments: {
        Row: {
          asset_id: string
          assigned_project_id: string | null
          assigned_user_id: string | null
          calibration_due: string | null
          category: string
          company_id: string
          created_at: string
          id: string
          manufacturer: string | null
          model: string | null
          name: string
          notes: string | null
          qr_token: string
          serial_number: string | null
          status: Database["public"]["Enums"]["instrument_status"]
          updated_at: string
        }
        Insert: {
          asset_id: string
          assigned_project_id?: string | null
          assigned_user_id?: string | null
          calibration_due?: string | null
          category?: string
          company_id: string
          created_at?: string
          id?: string
          manufacturer?: string | null
          model?: string | null
          name: string
          notes?: string | null
          qr_token?: string
          serial_number?: string | null
          status?: Database["public"]["Enums"]["instrument_status"]
          updated_at?: string
        }
        Update: {
          asset_id?: string
          assigned_project_id?: string | null
          assigned_user_id?: string | null
          calibration_due?: string | null
          category?: string
          company_id?: string
          created_at?: string
          id?: string
          manufacturer?: string | null
          model?: string | null
          name?: string
          notes?: string | null
          qr_token?: string
          serial_number?: string | null
          status?: Database["public"]["Enums"]["instrument_status"]
          updated_at?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          accepted_at: string | null
          company_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          invited_by_name: string | null
          role: Database["public"]["Enums"]["app_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          invited_by_name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          token?: string
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          invited_by_name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          token?: string
        }
        Relationships: []
      }
      ncr_attachments: {
        Row: {
          company_id: string
          created_at: string
          filename: string
          id: string
          mime_type: string | null
          ncr_id: string
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          filename: string
          id?: string
          mime_type?: string | null
          ncr_id: string
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string | null
          ncr_id?: string
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      ncr_events: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          comment: string | null
          company_id: string
          created_at: string
          id: string
          kind: string
          ncr_id: string
          payload: Json | null
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string | null
          comment?: string | null
          company_id: string
          created_at?: string
          id?: string
          kind: string
          ncr_id: string
          payload?: Json | null
        }
        Update: {
          actor_id?: string | null
          actor_name?: string | null
          comment?: string | null
          company_id?: string
          created_at?: string
          id?: string
          kind?: string
          ncr_id?: string
          payload?: Json | null
        }
        Relationships: []
      }
      ncrs: {
        Row: {
          assigned_to: string | null
          assigned_to_name: string | null
          closed_at: string | null
          closed_by: string | null
          company_id: string
          corrective_action: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          inspection_id: string | null
          ncr_no: string
          preventive_action: string | null
          project_id: string | null
          raised_by: string | null
          raised_by_name: string | null
          root_cause: string | null
          severity: Database["public"]["Enums"]["severity_level"] | null
          status: Database["public"]["Enums"]["ncr_status"]
          title: string
          updated_at: string
          weld_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          assigned_to_name?: string | null
          closed_at?: string | null
          closed_by?: string | null
          company_id: string
          corrective_action?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          inspection_id?: string | null
          ncr_no: string
          preventive_action?: string | null
          project_id?: string | null
          raised_by?: string | null
          raised_by_name?: string | null
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          status?: Database["public"]["Enums"]["ncr_status"]
          title: string
          updated_at?: string
          weld_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          assigned_to_name?: string | null
          closed_at?: string | null
          closed_by?: string | null
          company_id?: string
          corrective_action?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          inspection_id?: string | null
          ncr_no?: string
          preventive_action?: string | null
          project_id?: string | null
          raised_by?: string | null
          raised_by_name?: string | null
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          status?: Database["public"]["Enums"]["ncr_status"]
          title?: string
          updated_at?: string
          weld_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          company_id: string
          created_at: string
          id: string
          kind: string
          link: string | null
          read_at: string | null
          severity: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          company_id: string
          created_at?: string
          id?: string
          kind: string
          link?: string | null
          read_at?: string | null
          severity?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          company_id?: string
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read_at?: string | null
          severity?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      procedure_approvals: {
        Row: {
          action: Database["public"]["Enums"]["approval_action"]
          actor_id: string
          actor_name: string | null
          actor_role: string | null
          comment: string | null
          company_id: string
          id: string
          procedure_id: string
          signed_at: string
        }
        Insert: {
          action: Database["public"]["Enums"]["approval_action"]
          actor_id: string
          actor_name?: string | null
          actor_role?: string | null
          comment?: string | null
          company_id: string
          id?: string
          procedure_id: string
          signed_at?: string
        }
        Update: {
          action?: Database["public"]["Enums"]["approval_action"]
          actor_id?: string
          actor_name?: string | null
          actor_role?: string | null
          comment?: string | null
          company_id?: string
          id?: string
          procedure_id?: string
          signed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procedure_approvals_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      procedure_attachments: {
        Row: {
          company_id: string
          created_at: string
          filename: string
          id: string
          mime_type: string | null
          procedure_id: string
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          filename: string
          id?: string
          mime_type?: string | null
          procedure_id: string
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string | null
          procedure_id?: string
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "procedure_attachments_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      procedure_revisions: {
        Row: {
          change_summary: string | null
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          procedure_id: string
          revision: string
          snapshot: Json
        }
        Insert: {
          change_summary?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          procedure_id: string
          revision: string
          snapshot: Json
        }
        Update: {
          change_summary?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          procedure_id?: string
          revision?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "procedure_revisions_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      procedures: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          automation: string | null
          back_gouging: string | null
          base_material: string | null
          cleaning_method: string | null
          code: string
          company_id: string
          created_at: string
          current_max: number | null
          current_min: number | null
          deleted_at: string | null
          deleted_by: string | null
          document_no: string | null
          electrode_type: string | null
          filler_material: string | null
          groove_type: string | null
          heat_input_max: number | null
          heat_input_min: number | null
          id: string
          interpass_max_c: number | null
          interpass_temp: string | null
          joint_notes: string | null
          joint_type: string | null
          notes: string | null
          pass_type: string | null
          peening: string | null
          pipe_or_plate: string | null
          position: string | null
          position_qualified: string | null
          pqr_no: string | null
          preheat_method: string | null
          preheat_min_c: number | null
          preheat_temp: string | null
          procedure_type: string | null
          process: string
          pwht: string | null
          qr_token: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          revision: string
          shielding_gas: string | null
          standard: string
          status: Database["public"]["Enums"]["procedure_status"]
          submitted_by: string | null
          submitted_for_review_at: string | null
          technique_notes: string | null
          technique_string_weave: string | null
          thermal_notes: string | null
          thickness_range: string | null
          travel_speed_max: number | null
          travel_speed_min: number | null
          updated_at: string
          voltage_max: number | null
          voltage_min: number | null
          welding_progression: string | null
          wps_date: string | null
          wps_no: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          automation?: string | null
          back_gouging?: string | null
          base_material?: string | null
          cleaning_method?: string | null
          code: string
          company_id: string
          created_at?: string
          current_max?: number | null
          current_min?: number | null
          deleted_at?: string | null
          deleted_by?: string | null
          document_no?: string | null
          electrode_type?: string | null
          filler_material?: string | null
          groove_type?: string | null
          heat_input_max?: number | null
          heat_input_min?: number | null
          id?: string
          interpass_max_c?: number | null
          interpass_temp?: string | null
          joint_notes?: string | null
          joint_type?: string | null
          notes?: string | null
          pass_type?: string | null
          peening?: string | null
          pipe_or_plate?: string | null
          position?: string | null
          position_qualified?: string | null
          pqr_no?: string | null
          preheat_method?: string | null
          preheat_min_c?: number | null
          preheat_temp?: string | null
          procedure_type?: string | null
          process: string
          pwht?: string | null
          qr_token?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision?: string
          shielding_gas?: string | null
          standard: string
          status?: Database["public"]["Enums"]["procedure_status"]
          submitted_by?: string | null
          submitted_for_review_at?: string | null
          technique_notes?: string | null
          technique_string_weave?: string | null
          thermal_notes?: string | null
          thickness_range?: string | null
          travel_speed_max?: number | null
          travel_speed_min?: number | null
          updated_at?: string
          voltage_max?: number | null
          voltage_min?: number | null
          welding_progression?: string | null
          wps_date?: string | null
          wps_no?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          automation?: string | null
          back_gouging?: string | null
          base_material?: string | null
          cleaning_method?: string | null
          code?: string
          company_id?: string
          created_at?: string
          current_max?: number | null
          current_min?: number | null
          deleted_at?: string | null
          deleted_by?: string | null
          document_no?: string | null
          electrode_type?: string | null
          filler_material?: string | null
          groove_type?: string | null
          heat_input_max?: number | null
          heat_input_min?: number | null
          id?: string
          interpass_max_c?: number | null
          interpass_temp?: string | null
          joint_notes?: string | null
          joint_type?: string | null
          notes?: string | null
          pass_type?: string | null
          peening?: string | null
          pipe_or_plate?: string | null
          position?: string | null
          position_qualified?: string | null
          pqr_no?: string | null
          preheat_method?: string | null
          preheat_min_c?: number | null
          preheat_temp?: string | null
          procedure_type?: string | null
          process?: string
          pwht?: string | null
          qr_token?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision?: string
          shielding_gas?: string | null
          standard?: string
          status?: Database["public"]["Enums"]["procedure_status"]
          submitted_by?: string | null
          submitted_for_review_at?: string | null
          technique_notes?: string | null
          technique_string_weave?: string | null
          thermal_notes?: string | null
          thickness_range?: string | null
          travel_speed_max?: number | null
          travel_speed_min?: number | null
          updated_at?: string
          voltage_max?: number | null
          voltage_min?: number | null
          welding_progression?: string | null
          wps_date?: string | null
          wps_no?: string | null
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
          description: string | null
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
          description?: string | null
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
          description?: string | null
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
      qualification_attachments: {
        Row: {
          company_id: string
          created_at: string
          filename: string
          id: string
          mime_type: string | null
          qualification_id: string
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          filename: string
          id?: string
          mime_type?: string | null
          qualification_id: string
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string | null
          qualification_id?: string
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      qualification_continuity: {
        Row: {
          activity_date: string
          company_id: string
          created_at: string
          created_by: string | null
          evidence_weld_id: string | null
          id: string
          notes: string | null
          process: string | null
          project_id: string | null
          qualification_id: string
        }
        Insert: {
          activity_date: string
          company_id: string
          created_at?: string
          created_by?: string | null
          evidence_weld_id?: string | null
          id?: string
          notes?: string | null
          process?: string | null
          project_id?: string | null
          qualification_id: string
        }
        Update: {
          activity_date?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          evidence_weld_id?: string | null
          id?: string
          notes?: string | null
          process?: string | null
          project_id?: string | null
          qualification_id?: string
        }
        Relationships: []
      }
      qualification_signatures: {
        Row: {
          actor_id: string | null
          company_id: string
          id: string
          name: string
          qualification_id: string
          role: string
          signature_data_url: string | null
          signed_at: string
        }
        Insert: {
          actor_id?: string | null
          company_id: string
          id?: string
          name: string
          qualification_id: string
          role: string
          signature_data_url?: string | null
          signed_at?: string
        }
        Update: {
          actor_id?: string | null
          company_id?: string
          id?: string
          name?: string
          qualification_id?: string
          role?: string
          signature_data_url?: string | null
          signed_at?: string
        }
        Relationships: []
      }
      qualification_tests: {
        Row: {
          category: string
          company_id: string
          created_at: string
          id: string
          inspector_name: string | null
          notes: string | null
          qualification_id: string
          report_number: string | null
          result: string | null
          test_date: string | null
          test_type: string
          updated_at: string
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string
          id?: string
          inspector_name?: string | null
          notes?: string | null
          qualification_id: string
          report_number?: string | null
          result?: string | null
          test_date?: string | null
          test_type: string
          updated_at?: string
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          id?: string
          inspector_name?: string | null
          notes?: string | null
          qualification_id?: string
          report_number?: string | null
          result?: string | null
          test_date?: string | null
          test_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      qualification_variables: {
        Row: {
          code_reference: string | null
          company_id: string
          created_at: string
          id: string
          qualification_id: string
          qualified_for: string | null
          qualified_with: string | null
          sort_order: number
          updated_at: string
          variable_key: string
          variable_label: string
        }
        Insert: {
          code_reference?: string | null
          company_id: string
          created_at?: string
          id?: string
          qualification_id: string
          qualified_for?: string | null
          qualified_with?: string | null
          sort_order?: number
          updated_at?: string
          variable_key: string
          variable_label: string
        }
        Update: {
          code_reference?: string | null
          company_id?: string
          created_at?: string
          id?: string
          qualification_id?: string
          qualified_for?: string | null
          qualified_with?: string | null
          sort_order?: number
          updated_at?: string
          variable_key?: string
          variable_label?: string
        }
        Relationships: []
      }
      qualifications: {
        Row: {
          code_family: string | null
          company_id: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          doc_number: string | null
          employee_id: string
          expiry_date: string
          id: string
          last_continuity_date: string | null
          position_qualified: string | null
          pqr_number: string | null
          process: string
          process_type: string | null
          project_id: string | null
          qr_token: string
          qualification_date: string | null
          rejection_reason: string | null
          remarks: string | null
          result: string | null
          retest_of_id: string | null
          revision: string
          stamp_number: string | null
          standard: string
          status: Database["public"]["Enums"]["qualification_status"]
          test_coupon_type: string | null
          test_diameter_mm: number | null
          test_thickness_mm: number | null
          updated_at: string
          welder_name: string
          welder_photo_url: string | null
          welder_test_number: string | null
          wpq_number: string | null
          wps_number: string | null
        }
        Insert: {
          code_family?: string | null
          company_id: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          doc_number?: string | null
          employee_id: string
          expiry_date: string
          id?: string
          last_continuity_date?: string | null
          position_qualified?: string | null
          pqr_number?: string | null
          process: string
          process_type?: string | null
          project_id?: string | null
          qr_token?: string
          qualification_date?: string | null
          rejection_reason?: string | null
          remarks?: string | null
          result?: string | null
          retest_of_id?: string | null
          revision?: string
          stamp_number?: string | null
          standard: string
          status?: Database["public"]["Enums"]["qualification_status"]
          test_coupon_type?: string | null
          test_diameter_mm?: number | null
          test_thickness_mm?: number | null
          updated_at?: string
          welder_name: string
          welder_photo_url?: string | null
          welder_test_number?: string | null
          wpq_number?: string | null
          wps_number?: string | null
        }
        Update: {
          code_family?: string | null
          company_id?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          doc_number?: string | null
          employee_id?: string
          expiry_date?: string
          id?: string
          last_continuity_date?: string | null
          position_qualified?: string | null
          pqr_number?: string | null
          process?: string
          process_type?: string | null
          project_id?: string | null
          qr_token?: string
          qualification_date?: string | null
          rejection_reason?: string | null
          remarks?: string | null
          result?: string | null
          retest_of_id?: string | null
          revision?: string
          stamp_number?: string | null
          standard?: string
          status?: Database["public"]["Enums"]["qualification_status"]
          test_coupon_type?: string | null
          test_diameter_mm?: number | null
          test_thickness_mm?: number | null
          updated_at?: string
          welder_name?: string
          welder_photo_url?: string | null
          welder_test_number?: string | null
          wpq_number?: string | null
          wps_number?: string | null
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
      reminder_log: {
        Row: {
          company_id: string
          id: string
          kind: string
          ref_id: string
          sent_at: string
          window_days: number
        }
        Insert: {
          company_id: string
          id?: string
          kind: string
          ref_id: string
          sent_at?: string
          window_days: number
        }
        Update: {
          company_id?: string
          id?: string
          kind?: string
          ref_id?: string
          sent_at?: string
          window_days?: number
        }
        Relationships: []
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
      weld_attachments: {
        Row: {
          company_id: string
          created_at: string
          filename: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
          weld_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          filename: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
          weld_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
          weld_id?: string
        }
        Relationships: []
      }
      weld_events: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          company_id: string
          created_at: string
          id: string
          kind: string
          payload: Json | null
          weld_id: string
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string | null
          company_id: string
          created_at?: string
          id?: string
          kind: string
          payload?: Json | null
          weld_id: string
        }
        Update: {
          actor_id?: string | null
          actor_name?: string | null
          company_id?: string
          created_at?: string
          id?: string
          kind?: string
          payload?: Json | null
          weld_id?: string
        }
        Relationships: []
      }
      welds: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          base_material: string | null
          blocked_reason: string | null
          company_id: string
          created_at: string
          drawing_ref: string | null
          filler_metal: string | null
          heat_input: string | null
          heat_number: string | null
          id: string
          inspection_status: string | null
          joint_no: string | null
          joint_type: string | null
          line_no: string | null
          procedure_id: string | null
          project_id: string | null
          qr_token: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          released_at: string | null
          released_by: string | null
          spool_no: string | null
          status: Database["public"]["Enums"]["weld_status"]
          submitted_for_validation_at: string | null
          updated_at: string
          weld_date: string
          weld_no: string
          welder_name: string | null
          workflow_status: Database["public"]["Enums"]["weld_workflow_status"]
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          base_material?: string | null
          blocked_reason?: string | null
          company_id: string
          created_at?: string
          drawing_ref?: string | null
          filler_metal?: string | null
          heat_input?: string | null
          heat_number?: string | null
          id?: string
          inspection_status?: string | null
          joint_no?: string | null
          joint_type?: string | null
          line_no?: string | null
          procedure_id?: string | null
          project_id?: string | null
          qr_token?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          released_at?: string | null
          released_by?: string | null
          spool_no?: string | null
          status?: Database["public"]["Enums"]["weld_status"]
          submitted_for_validation_at?: string | null
          updated_at?: string
          weld_date?: string
          weld_no: string
          welder_name?: string | null
          workflow_status?: Database["public"]["Enums"]["weld_workflow_status"]
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          base_material?: string | null
          blocked_reason?: string | null
          company_id?: string
          created_at?: string
          drawing_ref?: string | null
          filler_metal?: string | null
          heat_input?: string | null
          heat_number?: string | null
          id?: string
          inspection_status?: string | null
          joint_no?: string | null
          joint_type?: string | null
          line_no?: string | null
          procedure_id?: string | null
          project_id?: string | null
          qr_token?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          released_at?: string | null
          released_by?: string | null
          spool_no?: string | null
          status?: Database["public"]["Enums"]["weld_status"]
          submitted_for_validation_at?: string | null
          updated_at?: string
          weld_date?: string
          weld_no?: string
          welder_name?: string | null
          workflow_status?: Database["public"]["Enums"]["weld_workflow_status"]
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
      wps_base_metals: {
        Row: {
          company_id: string
          created_at: string
          diameter_max_mm: number | null
          diameter_min_mm: number | null
          groove_applicability: string | null
          group_no: string | null
          id: string
          material_spec: string | null
          notes: string | null
          p_no: string | null
          pass_thickness_limit_mm: number | null
          procedure_id: string
          sort_order: number
          thickness_max_mm: number | null
          thickness_min_mm: number | null
          to_group_no: string | null
          to_p_no: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          diameter_max_mm?: number | null
          diameter_min_mm?: number | null
          groove_applicability?: string | null
          group_no?: string | null
          id?: string
          material_spec?: string | null
          notes?: string | null
          p_no?: string | null
          pass_thickness_limit_mm?: number | null
          procedure_id: string
          sort_order?: number
          thickness_max_mm?: number | null
          thickness_min_mm?: number | null
          to_group_no?: string | null
          to_p_no?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          diameter_max_mm?: number | null
          diameter_min_mm?: number | null
          groove_applicability?: string | null
          group_no?: string | null
          id?: string
          material_spec?: string | null
          notes?: string | null
          p_no?: string | null
          pass_thickness_limit_mm?: number | null
          procedure_id?: string
          sort_order?: number
          thickness_max_mm?: number | null
          thickness_min_mm?: number | null
          to_group_no?: string | null
          to_p_no?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wps_base_metals_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      wps_electrical_characteristics: {
        Row: {
          amperage_max: number | null
          amperage_min: number | null
          company_id: string
          created_at: string
          electrode_diameter_mm: number | null
          filler_class: string | null
          heat_input_max: number | null
          heat_input_min: number | null
          id: string
          notes: string | null
          polarity: string | null
          procedure_id: string
          process: string | null
          sort_order: number
          travel_speed_max: number | null
          travel_speed_min: number | null
          updated_at: string
          voltage_max: number | null
          voltage_min: number | null
          weld_layer: string | null
        }
        Insert: {
          amperage_max?: number | null
          amperage_min?: number | null
          company_id: string
          created_at?: string
          electrode_diameter_mm?: number | null
          filler_class?: string | null
          heat_input_max?: number | null
          heat_input_min?: number | null
          id?: string
          notes?: string | null
          polarity?: string | null
          procedure_id: string
          process?: string | null
          sort_order?: number
          travel_speed_max?: number | null
          travel_speed_min?: number | null
          updated_at?: string
          voltage_max?: number | null
          voltage_min?: number | null
          weld_layer?: string | null
        }
        Update: {
          amperage_max?: number | null
          amperage_min?: number | null
          company_id?: string
          created_at?: string
          electrode_diameter_mm?: number | null
          filler_class?: string | null
          heat_input_max?: number | null
          heat_input_min?: number | null
          id?: string
          notes?: string | null
          polarity?: string | null
          procedure_id?: string
          process?: string | null
          sort_order?: number
          travel_speed_max?: number | null
          travel_speed_min?: number | null
          updated_at?: string
          voltage_max?: number | null
          voltage_min?: number | null
          weld_layer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wps_electrical_characteristics_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      wps_filler_metals: {
        Row: {
          a_no: string | null
          aws_classification: string | null
          company_id: string
          consumable_insert: string | null
          created_at: string
          electrode_brand: string | null
          electrode_diameter_mm: number | null
          f_no: string | null
          filler_type: string | null
          flux_brand: string | null
          flux_wire_class: string | null
          id: string
          notes: string | null
          procedure_id: string
          process: string | null
          qualified_thickness_mm: number | null
          sfa_no: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          a_no?: string | null
          aws_classification?: string | null
          company_id: string
          consumable_insert?: string | null
          created_at?: string
          electrode_brand?: string | null
          electrode_diameter_mm?: number | null
          f_no?: string | null
          filler_type?: string | null
          flux_brand?: string | null
          flux_wire_class?: string | null
          id?: string
          notes?: string | null
          procedure_id: string
          process?: string | null
          qualified_thickness_mm?: number | null
          sfa_no?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          a_no?: string | null
          aws_classification?: string | null
          company_id?: string
          consumable_insert?: string | null
          created_at?: string
          electrode_brand?: string | null
          electrode_diameter_mm?: number | null
          f_no?: string | null
          filler_type?: string | null
          flux_brand?: string | null
          flux_wire_class?: string | null
          id?: string
          notes?: string | null
          procedure_id?: string
          process?: string | null
          qualified_thickness_mm?: number | null
          sfa_no?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wps_filler_metals_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      wps_joint_configurations: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          groove_type: string | null
          id: string
          joint_type: string | null
          label: string | null
          notes: string | null
          pipe_or_plate: string | null
          position_qualified: string | null
          procedure_id: string
          sketch_path: string | null
          sort_order: number
          updated_at: string
          welding_progression: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          groove_type?: string | null
          id?: string
          joint_type?: string | null
          label?: string | null
          notes?: string | null
          pipe_or_plate?: string | null
          position_qualified?: string | null
          procedure_id: string
          sketch_path?: string | null
          sort_order?: number
          updated_at?: string
          welding_progression?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          groove_type?: string | null
          id?: string
          joint_type?: string | null
          label?: string | null
          notes?: string | null
          pipe_or_plate?: string | null
          position_qualified?: string | null
          procedure_id?: string
          sketch_path?: string | null
          sort_order?: number
          updated_at?: string
          welding_progression?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wps_joint_configurations_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      wps_signatures: {
        Row: {
          actor_id: string | null
          company_id: string
          id: string
          name: string
          procedure_id: string
          role: string
          signature_data_url: string | null
          signed_at: string
        }
        Insert: {
          actor_id?: string | null
          company_id: string
          id?: string
          name: string
          procedure_id: string
          role: string
          signature_data_url?: string | null
          signed_at?: string
        }
        Update: {
          actor_id?: string | null
          company_id?: string
          id?: string
          name?: string
          procedure_id?: string
          role?: string
          signature_data_url?: string | null
          signed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wps_signatures_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: { Args: { _token: string }; Returns: string }
      current_company_id: { Args: never; Returns: string }
      get_company_branding_by_domain: {
        Args: { _host: string }
        Returns: {
          id: string
          logo_url: string
          name: string
          report_footer: string
        }[]
      }
      get_instrument_by_qr: {
        Args: { _token: string }
        Returns: {
          asset_id: string
          calibration_due: string
          category: string
          company_logo_url: string
          company_name: string
          manufacturer: string
          model: string
          name: string
          serial_number: string
          status: string
        }[]
      }
      get_invitation: {
        Args: { _token: string }
        Returns: {
          accepted_at: string
          company_id: string
          company_name: string
          email: string
          expires_at: string
          invited_by_name: string
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      get_qualification_by_qr: {
        Args: { _token: string }
        Returns: {
          code_family: string
          company_logo_url: string
          company_name: string
          employee_id: string
          expiry_date: string
          id: string
          position_qualified: string
          process: string
          qualification_date: string
          standard: string
          status: string
          welder_name: string
          wpq_number: string
        }[]
      }
      get_wps_by_qr: {
        Args: { _token: string }
        Returns: {
          code: string
          company_logo_url: string
          company_name: string
          document_no: string
          groove_type: string
          id: string
          position_qualified: string
          pqr_no: string
          process: string
          revision: string
          standard: string
          status: string
          wps_date: string
          wps_no: string
        }[]
      }
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
      is_internal_company: { Args: { _company_id: string }; Returns: boolean }
      restore_procedure: { Args: { _id: string }; Returns: undefined }
      restore_qualification: { Args: { _id: string }; Returns: undefined }
      soft_delete_procedure: { Args: { _id: string }; Returns: undefined }
      soft_delete_qualification: { Args: { _id: string }; Returns: undefined }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "qa_qc_manager"
        | "welding_engineer"
        | "inspector"
        | "welder"
        | "client_viewer"
      approval_action:
        | "submitted"
        | "reviewed"
        | "approved"
        | "rejected"
        | "revoked"
      equipment_status:
        | "Operational"
        | "Maintenance"
        | "Calibration Due"
        | "Out of Service"
      instrument_status: "Active" | "Calibration Due" | "Out of Service"
      ncr_status:
        | "Draft"
        | "Open"
        | "Root Cause"
        | "CA Pending"
        | "In Review"
        | "Closed"
        | "Rejected"
      procedure_status:
        | "Draft"
        | "Review"
        | "Approved"
        | "Archived"
        | "Rejected"
      project_status:
        | "Planning"
        | "Active"
        | "On Hold"
        | "Completed"
        | "Cancelled"
      qualification_status: "Active" | "Expiring Soon" | "Expired" | "Suspended"
      severity_level: "Low" | "Medium" | "High" | "Critical"
      weld_status: "Accepted" | "Rejected" | "Repair" | "Pending"
      weld_workflow_status:
        | "Draft"
        | "Pending Validation"
        | "Awaiting Inspection"
        | "NCR Open"
        | "Ready for Release"
        | "Approved"
        | "Released"
        | "Rejected"
        | "Blocked"
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
      approval_action: [
        "submitted",
        "reviewed",
        "approved",
        "rejected",
        "revoked",
      ],
      equipment_status: [
        "Operational",
        "Maintenance",
        "Calibration Due",
        "Out of Service",
      ],
      instrument_status: ["Active", "Calibration Due", "Out of Service"],
      ncr_status: [
        "Draft",
        "Open",
        "Root Cause",
        "CA Pending",
        "In Review",
        "Closed",
        "Rejected",
      ],
      procedure_status: ["Draft", "Review", "Approved", "Archived", "Rejected"],
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
      weld_workflow_status: [
        "Draft",
        "Pending Validation",
        "Awaiting Inspection",
        "NCR Open",
        "Ready for Release",
        "Approved",
        "Released",
        "Rejected",
        "Blocked",
      ],
    },
  },
} as const
