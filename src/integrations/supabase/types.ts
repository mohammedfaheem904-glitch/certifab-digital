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
      activity_events: {
        Row: {
          actor_id: string | null
          company_id: string
          created_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["collab_entity_type"]
          id: string
          kind: string
          payload: Json
          summary: string | null
        }
        Insert: {
          actor_id?: string | null
          company_id: string
          created_at?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["collab_entity_type"]
          id?: string
          kind: string
          payload?: Json
          summary?: string | null
        }
        Update: {
          actor_id?: string | null
          company_id?: string
          created_at?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["collab_entity_type"]
          id?: string
          kind?: string
          payload?: Json
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
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
      capa_actions: {
        Row: {
          action_type: Database["public"]["Enums"]["capa_type"]
          company_id: string
          completed_at: string | null
          completion_evidence: string | null
          created_at: string
          description: string
          effectiveness_notes: string | null
          effectiveness_verified_at: string | null
          effectiveness_verified_by: string | null
          id: string
          ncr_id: string
          owner: string | null
          owner_name: string | null
          status: Database["public"]["Enums"]["capa_status"]
          target_date: string | null
          updated_at: string
        }
        Insert: {
          action_type?: Database["public"]["Enums"]["capa_type"]
          company_id: string
          completed_at?: string | null
          completion_evidence?: string | null
          created_at?: string
          description: string
          effectiveness_notes?: string | null
          effectiveness_verified_at?: string | null
          effectiveness_verified_by?: string | null
          id?: string
          ncr_id: string
          owner?: string | null
          owner_name?: string | null
          status?: Database["public"]["Enums"]["capa_status"]
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["capa_type"]
          company_id?: string
          completed_at?: string | null
          completion_evidence?: string | null
          created_at?: string
          description?: string
          effectiveness_notes?: string | null
          effectiveness_verified_at?: string | null
          effectiveness_verified_by?: string | null
          id?: string
          ncr_id?: string
          owner?: string | null
          owner_name?: string | null
          status?: Database["public"]["Enums"]["capa_status"]
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "capa_actions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capa_actions_ncr_id_fkey"
            columns: ["ncr_id"]
            isOneToOne: false
            referencedRelation: "ncrs"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_attachments: {
        Row: {
          comment_id: string
          company_id: string
          created_at: string
          file_name: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_bucket: string
          storage_path: string
        }
        Insert: {
          comment_id: string
          company_id: string
          created_at?: string
          file_name: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_bucket?: string
          storage_path: string
        }
        Update: {
          comment_id?: string
          company_id?: string
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_bucket?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_attachments_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_attachments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_reactions: {
        Row: {
          comment_id: string
          company_id: string
          created_at: string
          emoji: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          company_id: string
          created_at?: string
          emoji: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          company_id?: string
          created_at?: string
          emoji?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_reactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          body_md: string
          body_plain: string
          category: string | null
          company_id: string
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["collab_entity_type"]
          id: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          body_md: string
          body_plain: string
          category?: string | null
          company_id: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["collab_entity_type"]
          id?: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          body_md?: string
          body_plain?: string
          category?: string | null
          company_id?: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["collab_entity_type"]
          id?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
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
      defect_catalog: {
        Row: {
          category: Database["public"]["Enums"]["defect_category"]
          code: string
          code_references: string | null
          company_id: string | null
          created_at: string
          default_severity: Database["public"]["Enums"]["severity_level"]
          description: string | null
          id: string
          is_active: boolean
          name: string
          repair_guidance: string | null
          typical_causes: string | null
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["defect_category"]
          code: string
          code_references?: string | null
          company_id?: string | null
          created_at?: string
          default_severity?: Database["public"]["Enums"]["severity_level"]
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          repair_guidance?: string | null
          typical_causes?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["defect_category"]
          code?: string
          code_references?: string | null
          company_id?: string | null
          created_at?: string
          default_severity?: Database["public"]["Enums"]["severity_level"]
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          repair_guidance?: string | null
          typical_causes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "defect_catalog_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          asset_id: string
          calibration_due: string | null
          category: string
          company_id: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          manufacturer: string | null
          model: string
          name: string | null
          notes: string | null
          qr_token: string
          serial_number: string | null
          status: Database["public"]["Enums"]["equipment_status"]
          updated_at: string
        }
        Insert: {
          asset_id: string
          calibration_due?: string | null
          category?: string
          company_id: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          manufacturer?: string | null
          model: string
          name?: string | null
          notes?: string | null
          qr_token?: string
          serial_number?: string | null
          status?: Database["public"]["Enums"]["equipment_status"]
          updated_at?: string
        }
        Update: {
          asset_id?: string
          calibration_due?: string | null
          category?: string
          company_id?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          manufacturer?: string | null
          model?: string
          name?: string | null
          notes?: string | null
          qr_token?: string
          serial_number?: string | null
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
      equipment_calibrations: {
        Row: {
          calibrated_on: string
          certificate_path: string | null
          company_id: string
          created_at: string
          created_by: string | null
          equipment_id: string
          id: string
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
          equipment_id: string
          id?: string
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
          equipment_id?: string
          id?: string
          next_due?: string | null
          notes?: string | null
          performed_by?: string | null
        }
        Relationships: []
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
      inspection_checklist_items: {
        Row: {
          attachment_path: string | null
          code_reference: string | null
          comment: string | null
          company_id: string
          created_at: string
          field_type: string
          id: string
          inspection_id: string
          label: string
          required: boolean
          result: string | null
          section: string | null
          sort_order: number
          template_field_id: string | null
          tolerance_max: number | null
          tolerance_min: number | null
          unit: string | null
          updated_at: string
          value_bool: boolean | null
          value_number: number | null
          value_text: string | null
        }
        Insert: {
          attachment_path?: string | null
          code_reference?: string | null
          comment?: string | null
          company_id: string
          created_at?: string
          field_type?: string
          id?: string
          inspection_id: string
          label: string
          required?: boolean
          result?: string | null
          section?: string | null
          sort_order?: number
          template_field_id?: string | null
          tolerance_max?: number | null
          tolerance_min?: number | null
          unit?: string | null
          updated_at?: string
          value_bool?: boolean | null
          value_number?: number | null
          value_text?: string | null
        }
        Update: {
          attachment_path?: string | null
          code_reference?: string | null
          comment?: string | null
          company_id?: string
          created_at?: string
          field_type?: string
          id?: string
          inspection_id?: string
          label?: string
          required?: boolean
          result?: string | null
          section?: string | null
          sort_order?: number
          template_field_id?: string | null
          tolerance_max?: number | null
          tolerance_min?: number | null
          unit?: string | null
          updated_at?: string
          value_bool?: boolean | null
          value_number?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_checklist_items_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_checklist_items_template_field_id_fkey"
            columns: ["template_field_id"]
            isOneToOne: false
            referencedRelation: "inspection_template_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_defects: {
        Row: {
          catalog_id: string | null
          category: Database["public"]["Enums"]["defect_category"]
          code_reference: string | null
          company_id: string
          created_at: string
          defect_type: string
          detected_at: string
          detected_by: string | null
          disposition: Database["public"]["Enums"]["defect_disposition"] | null
          id: string
          inspection_id: string
          location: string | null
          measurement: string | null
          notes: string | null
          photo_url: string | null
          repair_recommendation: string | null
          severity: Database["public"]["Enums"]["severity_level"]
          updated_at: string
          weld_id: string | null
        }
        Insert: {
          catalog_id?: string | null
          category?: Database["public"]["Enums"]["defect_category"]
          code_reference?: string | null
          company_id: string
          created_at?: string
          defect_type: string
          detected_at?: string
          detected_by?: string | null
          disposition?: Database["public"]["Enums"]["defect_disposition"] | null
          id?: string
          inspection_id: string
          location?: string | null
          measurement?: string | null
          notes?: string | null
          photo_url?: string | null
          repair_recommendation?: string | null
          severity?: Database["public"]["Enums"]["severity_level"]
          updated_at?: string
          weld_id?: string | null
        }
        Update: {
          catalog_id?: string | null
          category?: Database["public"]["Enums"]["defect_category"]
          code_reference?: string | null
          company_id?: string
          created_at?: string
          defect_type?: string
          detected_at?: string
          detected_by?: string | null
          disposition?: Database["public"]["Enums"]["defect_disposition"] | null
          id?: string
          inspection_id?: string
          location?: string | null
          measurement?: string | null
          notes?: string | null
          photo_url?: string | null
          repair_recommendation?: string | null
          severity?: Database["public"]["Enums"]["severity_level"]
          updated_at?: string
          weld_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_defects_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "defect_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_defects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_defects_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_defects_weld_id_fkey"
            columns: ["weld_id"]
            isOneToOne: false
            referencedRelation: "welds"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_events: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          comment: string | null
          company_id: string
          created_at: string
          id: string
          inspection_id: string
          kind: string
          payload: Json | null
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string | null
          comment?: string | null
          company_id: string
          created_at?: string
          id?: string
          inspection_id: string
          kind: string
          payload?: Json | null
        }
        Update: {
          actor_id?: string | null
          actor_name?: string | null
          comment?: string | null
          company_id?: string
          created_at?: string
          id?: string
          inspection_id?: string
          kind?: string
          payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_events_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_package_members: {
        Row: {
          added_at: string
          company_id: string
          id: string
          inspection_id: string
          package_id: string
        }
        Insert: {
          added_at?: string
          company_id: string
          id?: string
          inspection_id: string
          package_id: string
        }
        Update: {
          added_at?: string
          company_id?: string
          id?: string
          inspection_id?: string
          package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_package_members_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_package_members_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "inspection_work_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_plan_items: {
        Row: {
          company_id: string
          created_at: string
          generated_inspection_id: string | null
          id: string
          inspection_type: string
          joint_no: string | null
          line_no: string | null
          plan_id: string
          planned_date: string | null
          priority: string
          spool_no: string | null
          status: string
          weld_id: string | null
          welder_name: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          generated_inspection_id?: string | null
          id?: string
          inspection_type: string
          joint_no?: string | null
          line_no?: string | null
          plan_id: string
          planned_date?: string | null
          priority?: string
          spool_no?: string | null
          status?: string
          weld_id?: string | null
          welder_name?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          generated_inspection_id?: string | null
          id?: string
          inspection_type?: string
          joint_no?: string | null
          line_no?: string | null
          plan_id?: string
          planned_date?: string | null
          priority?: string
          spool_no?: string | null
          status?: string
          weld_id?: string | null
          welder_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_plan_items_generated_inspection_id_fkey"
            columns: ["generated_inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_plan_items_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "inspection_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_plans: {
        Row: {
          area: string | null
          assigned_to: string | null
          assigned_to_name: string | null
          code: string | null
          company_id: string
          created_at: string
          created_by: string | null
          default_inspection_type: string | null
          description: string | null
          discipline: string | null
          due_date: string | null
          id: string
          line_no: string | null
          name: string
          planned_date: string | null
          priority: string
          project_id: string | null
          recurrence: string | null
          spool_no: string | null
          status: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          area?: string | null
          assigned_to?: string | null
          assigned_to_name?: string | null
          code?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          default_inspection_type?: string | null
          description?: string | null
          discipline?: string | null
          due_date?: string | null
          id?: string
          line_no?: string | null
          name: string
          planned_date?: string | null
          priority?: string
          project_id?: string | null
          recurrence?: string | null
          spool_no?: string | null
          status?: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          area?: string | null
          assigned_to?: string | null
          assigned_to_name?: string | null
          code?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          default_inspection_type?: string | null
          description?: string | null
          discipline?: string | null
          due_date?: string | null
          id?: string
          line_no?: string | null
          name?: string
          planned_date?: string | null
          priority?: string
          project_id?: string | null
          recurrence?: string | null
          spool_no?: string | null
          status?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inspection_template_fields: {
        Row: {
          code_reference: string | null
          company_id: string
          created_at: string
          field_type: string
          helper_text: string | null
          id: string
          label: string
          options: Json | null
          required: boolean
          section: string | null
          sort_order: number
          template_id: string
          tolerance_max: number | null
          tolerance_min: number | null
          unit: string | null
        }
        Insert: {
          code_reference?: string | null
          company_id: string
          created_at?: string
          field_type?: string
          helper_text?: string | null
          id?: string
          label: string
          options?: Json | null
          required?: boolean
          section?: string | null
          sort_order?: number
          template_id: string
          tolerance_max?: number | null
          tolerance_min?: number | null
          unit?: string | null
        }
        Update: {
          code_reference?: string | null
          company_id?: string
          created_at?: string
          field_type?: string
          helper_text?: string | null
          id?: string
          label?: string
          options?: Json | null
          required?: boolean
          section?: string | null
          sort_order?: number
          template_id?: string
          tolerance_max?: number | null
          tolerance_min?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_template_fields_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "inspection_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_templates: {
        Row: {
          active: boolean
          code_reference: string | null
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          discipline: string | null
          id: string
          inspection_type: string
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          code_reference?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discipline?: string | null
          id?: string
          inspection_type: string
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          code_reference?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discipline?: string | null
          id?: string
          inspection_type?: string
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      inspection_work_packages: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          package_no: string
          package_type: string
          project_id: string | null
          status: string
          target_date: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          package_no: string
          package_type?: string
          project_id?: string | null
          status?: string
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          package_no?: string
          package_type?: string
          project_id?: string | null
          status?: string
          target_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inspections: {
        Row: {
          area: string | null
          assigned_at: string | null
          assigned_to: string | null
          assigned_to_name: string | null
          client_requirement_ref: string | null
          closed_at: string | null
          closed_by: string | null
          company_id: string
          completed_at: string | null
          created_at: string
          defect_type: string | null
          deleted_at: string | null
          deleted_by: string | null
          discipline: string | null
          due_date: string | null
          id: string
          inspected_at: string
          inspection_no: string | null
          inspection_type: string
          inspector_name: string | null
          joint_no: string | null
          line_no: string | null
          ncr_code: string | null
          parent_inspection_id: string | null
          plan_item_id: string | null
          priority: string | null
          project_id: string | null
          requested_at: string | null
          requested_by: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          scheduled_for: string | null
          severity: Database["public"]["Enums"]["severity_level"] | null
          spool_no: string | null
          started_at: string | null
          status: string
          template_id: string | null
          updated_at: string
          weld_id: string | null
          welder_id: string | null
          welder_name: string | null
          workflow_status: Database["public"]["Enums"]["inspection_workflow_status"]
          wps_id: string | null
        }
        Insert: {
          area?: string | null
          assigned_at?: string | null
          assigned_to?: string | null
          assigned_to_name?: string | null
          client_requirement_ref?: string | null
          closed_at?: string | null
          closed_by?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string
          defect_type?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          discipline?: string | null
          due_date?: string | null
          id?: string
          inspected_at?: string
          inspection_no?: string | null
          inspection_type: string
          inspector_name?: string | null
          joint_no?: string | null
          line_no?: string | null
          ncr_code?: string | null
          parent_inspection_id?: string | null
          plan_item_id?: string | null
          priority?: string | null
          project_id?: string | null
          requested_at?: string | null
          requested_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scheduled_for?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          spool_no?: string | null
          started_at?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
          weld_id?: string | null
          welder_id?: string | null
          welder_name?: string | null
          workflow_status?: Database["public"]["Enums"]["inspection_workflow_status"]
          wps_id?: string | null
        }
        Update: {
          area?: string | null
          assigned_at?: string | null
          assigned_to?: string | null
          assigned_to_name?: string | null
          client_requirement_ref?: string | null
          closed_at?: string | null
          closed_by?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string
          defect_type?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          discipline?: string | null
          due_date?: string | null
          id?: string
          inspected_at?: string
          inspection_no?: string | null
          inspection_type?: string
          inspector_name?: string | null
          joint_no?: string | null
          line_no?: string | null
          ncr_code?: string | null
          parent_inspection_id?: string | null
          plan_item_id?: string | null
          priority?: string | null
          project_id?: string | null
          requested_at?: string | null
          requested_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scheduled_for?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          spool_no?: string | null
          started_at?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
          weld_id?: string | null
          welder_id?: string | null
          welder_name?: string | null
          workflow_status?: Database["public"]["Enums"]["inspection_workflow_status"]
          wps_id?: string | null
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
            foreignKeyName: "inspections_parent_inspection_id_fkey"
            columns: ["parent_inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_plan_item_id_fkey"
            columns: ["plan_item_id"]
            isOneToOne: false
            referencedRelation: "inspection_plan_items"
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
            foreignKeyName: "inspections_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "inspection_templates"
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
          deleted_at: string | null
          deleted_by: string | null
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
          deleted_at?: string | null
          deleted_by?: string | null
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
          deleted_at?: string | null
          deleted_by?: string | null
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
      mechanical_tests: {
        Row: {
          attachment_path: string | null
          company_id: string
          coupon_id: string | null
          created_at: string
          created_by: string | null
          dimensions: Json | null
          id: string
          laboratory: string | null
          minimum_requirement: string | null
          pqr_id: string | null
          remarks: string | null
          report_number: string | null
          result: Database["public"]["Enums"]["test_result"]
          results: Json | null
          specimen_id: string | null
          test_date: string | null
          test_type: Database["public"]["Enums"]["mechanical_test_type"]
          updated_at: string
        }
        Insert: {
          attachment_path?: string | null
          company_id: string
          coupon_id?: string | null
          created_at?: string
          created_by?: string | null
          dimensions?: Json | null
          id?: string
          laboratory?: string | null
          minimum_requirement?: string | null
          pqr_id?: string | null
          remarks?: string | null
          report_number?: string | null
          result?: Database["public"]["Enums"]["test_result"]
          results?: Json | null
          specimen_id?: string | null
          test_date?: string | null
          test_type: Database["public"]["Enums"]["mechanical_test_type"]
          updated_at?: string
        }
        Update: {
          attachment_path?: string | null
          company_id?: string
          coupon_id?: string | null
          created_at?: string
          created_by?: string | null
          dimensions?: Json | null
          id?: string
          laboratory?: string | null
          minimum_requirement?: string | null
          pqr_id?: string | null
          remarks?: string | null
          report_number?: string | null
          result?: Database["public"]["Enums"]["test_result"]
          results?: Json | null
          specimen_id?: string | null
          test_date?: string | null
          test_type?: Database["public"]["Enums"]["mechanical_test_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mechanical_tests_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "test_coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mechanical_tests_pqr_id_fkey"
            columns: ["pqr_id"]
            isOneToOne: false
            referencedRelation: "pqrs"
            referencedColumns: ["id"]
          },
        ]
      }
      mentions: {
        Row: {
          comment_id: string
          company_id: string
          created_at: string
          id: string
          mentioned_role: Database["public"]["Enums"]["app_role"] | null
          mentioned_user_id: string | null
        }
        Insert: {
          comment_id: string
          company_id: string
          created_at?: string
          id?: string
          mentioned_role?: Database["public"]["Enums"]["app_role"] | null
          mentioned_user_id?: string | null
        }
        Update: {
          comment_id?: string
          company_id?: string
          created_at?: string
          id?: string
          mentioned_role?: Database["public"]["Enums"]["app_role"] | null
          mentioned_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
      ncr_defect_links: {
        Row: {
          company_id: string
          created_at: string
          defect_id: string
          ncr_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          defect_id: string
          ncr_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          defect_id?: string
          ncr_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ncr_defect_links_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncr_defect_links_defect_id_fkey"
            columns: ["defect_id"]
            isOneToOne: false
            referencedRelation: "inspection_defects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncr_defect_links_ncr_id_fkey"
            columns: ["ncr_id"]
            isOneToOne: false
            referencedRelation: "ncrs"
            referencedColumns: ["id"]
          },
        ]
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
          accepted_as_is_reason: string | null
          assigned_to: string | null
          assigned_to_name: string | null
          closed_at: string | null
          closed_by: string | null
          closure_approved_at: string | null
          closure_approved_by: string | null
          company_id: string
          containment_action: string | null
          corrective_action: string | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          due_date: string | null
          effectiveness_result: string | null
          effectiveness_review_at: string | null
          effectiveness_review_by: string | null
          id: string
          inspection_id: string | null
          ncr_no: string
          preventive_action: string | null
          project_id: string | null
          raised_by: string | null
          raised_by_name: string | null
          responsible_person: string | null
          root_cause: string | null
          severity: Database["public"]["Enums"]["severity_level"] | null
          spool_id: string | null
          status: Database["public"]["Enums"]["ncr_status"]
          target_date: string | null
          title: string
          updated_at: string
          weld_id: string | null
        }
        Insert: {
          accepted_as_is_reason?: string | null
          assigned_to?: string | null
          assigned_to_name?: string | null
          closed_at?: string | null
          closed_by?: string | null
          closure_approved_at?: string | null
          closure_approved_by?: string | null
          company_id: string
          containment_action?: string | null
          corrective_action?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          effectiveness_result?: string | null
          effectiveness_review_at?: string | null
          effectiveness_review_by?: string | null
          id?: string
          inspection_id?: string | null
          ncr_no: string
          preventive_action?: string | null
          project_id?: string | null
          raised_by?: string | null
          raised_by_name?: string | null
          responsible_person?: string | null
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          spool_id?: string | null
          status?: Database["public"]["Enums"]["ncr_status"]
          target_date?: string | null
          title: string
          updated_at?: string
          weld_id?: string | null
        }
        Update: {
          accepted_as_is_reason?: string | null
          assigned_to?: string | null
          assigned_to_name?: string | null
          closed_at?: string | null
          closed_by?: string | null
          closure_approved_at?: string | null
          closure_approved_by?: string | null
          company_id?: string
          containment_action?: string | null
          corrective_action?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          due_date?: string | null
          effectiveness_result?: string | null
          effectiveness_review_at?: string | null
          effectiveness_review_by?: string | null
          id?: string
          inspection_id?: string | null
          ncr_no?: string
          preventive_action?: string | null
          project_id?: string | null
          raised_by?: string | null
          raised_by_name?: string | null
          responsible_person?: string | null
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          spool_id?: string | null
          status?: Database["public"]["Enums"]["ncr_status"]
          target_date?: string | null
          title?: string
          updated_at?: string
          weld_id?: string | null
        }
        Relationships: []
      }
      ndt_tests: {
        Row: {
          acceptance_criteria: string | null
          attachment_path: string | null
          company_id: string
          coupon_id: string | null
          created_at: string
          created_by: string | null
          equipment_id: string | null
          findings: string | null
          id: string
          method: Database["public"]["Enums"]["ndt_method"]
          pqr_id: string | null
          remarks: string | null
          report_number: string | null
          result: Database["public"]["Enums"]["test_result"]
          technician_id: string | null
          technician_name: string | null
          test_date: string | null
          updated_at: string
        }
        Insert: {
          acceptance_criteria?: string | null
          attachment_path?: string | null
          company_id: string
          coupon_id?: string | null
          created_at?: string
          created_by?: string | null
          equipment_id?: string | null
          findings?: string | null
          id?: string
          method: Database["public"]["Enums"]["ndt_method"]
          pqr_id?: string | null
          remarks?: string | null
          report_number?: string | null
          result?: Database["public"]["Enums"]["test_result"]
          technician_id?: string | null
          technician_name?: string | null
          test_date?: string | null
          updated_at?: string
        }
        Update: {
          acceptance_criteria?: string | null
          attachment_path?: string | null
          company_id?: string
          coupon_id?: string | null
          created_at?: string
          created_by?: string | null
          equipment_id?: string | null
          findings?: string | null
          id?: string
          method?: Database["public"]["Enums"]["ndt_method"]
          pqr_id?: string | null
          remarks?: string | null
          report_number?: string | null
          result?: Database["public"]["Enums"]["test_result"]
          technician_id?: string | null
          technician_name?: string | null
          test_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ndt_tests_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "test_coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ndt_tests_pqr_id_fkey"
            columns: ["pqr_id"]
            isOneToOne: false
            referencedRelation: "pqrs"
            referencedColumns: ["id"]
          },
        ]
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
      pqr_findings: {
        Row: {
          affected_variable: string | null
          code_reference: string | null
          company_id: string
          created_at: string
          id: string
          message: string | null
          pqr_id: string
          remediation: string | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["finding_severity"]
          title: string
        }
        Insert: {
          affected_variable?: string | null
          code_reference?: string | null
          company_id: string
          created_at?: string
          id?: string
          message?: string | null
          pqr_id: string
          remediation?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["finding_severity"]
          title: string
        }
        Update: {
          affected_variable?: string | null
          code_reference?: string | null
          company_id?: string
          created_at?: string
          id?: string
          message?: string | null
          pqr_id?: string
          remediation?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["finding_severity"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "pqr_findings_pqr_id_fkey"
            columns: ["pqr_id"]
            isOneToOne: false
            referencedRelation: "pqrs"
            referencedColumns: ["id"]
          },
        ]
      }
      pqrs: {
        Row: {
          code_family: string
          company_id: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          evaluation_snapshot: Json | null
          evaluator_id: string | null
          evaluator_name: string | null
          expiry_date: string | null
          id: string
          overall_result: Database["public"]["Enums"]["test_result"]
          pqr_no: string
          pwps_id: string | null
          qr_token: string
          qualification_date: string | null
          qualified_ranges: Json
          remarks: string | null
          resulting_wps_id: string | null
          revision: string
          standard: string | null
          status: Database["public"]["Enums"]["pqr_status"]
          test_date: string | null
          updated_at: string
        }
        Insert: {
          code_family?: string
          company_id: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          evaluation_snapshot?: Json | null
          evaluator_id?: string | null
          evaluator_name?: string | null
          expiry_date?: string | null
          id?: string
          overall_result?: Database["public"]["Enums"]["test_result"]
          pqr_no: string
          pwps_id?: string | null
          qr_token?: string
          qualification_date?: string | null
          qualified_ranges?: Json
          remarks?: string | null
          resulting_wps_id?: string | null
          revision?: string
          standard?: string | null
          status?: Database["public"]["Enums"]["pqr_status"]
          test_date?: string | null
          updated_at?: string
        }
        Update: {
          code_family?: string
          company_id?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          evaluation_snapshot?: Json | null
          evaluator_id?: string | null
          evaluator_name?: string | null
          expiry_date?: string | null
          id?: string
          overall_result?: Database["public"]["Enums"]["test_result"]
          pqr_no?: string
          pwps_id?: string | null
          qr_token?: string
          qualification_date?: string | null
          qualified_ranges?: Json
          remarks?: string | null
          resulting_wps_id?: string | null
          revision?: string
          standard?: string | null
          status?: Database["public"]["Enums"]["pqr_status"]
          test_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pqrs_pwps_id_fkey"
            columns: ["pwps_id"]
            isOneToOne: false
            referencedRelation: "pwps"
            referencedColumns: ["id"]
          },
        ]
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
      procedure_links: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          metadata: Json | null
          relationship: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          relationship: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          metadata?: Json | null
          relationship?: string
          source_id?: string
          source_type?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
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
          linked_pwps_ids: string[]
          notes: string | null
          pass_type: string | null
          peening: string | null
          pipe_or_plate: string | null
          position: string | null
          position_qualified: string | null
          pqr_id: string | null
          pqr_no: string | null
          preheat_method: string | null
          preheat_min_c: number | null
          preheat_temp: string | null
          procedure_type: string | null
          process: string
          pwht: string | null
          pwps_id: string | null
          qr_token: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          revision: string
          shielding_gas: string | null
          standard: string
          status: Database["public"]["Enums"]["procedure_status"]
          submitted_by: string | null
          submitted_for_review_at: string | null
          supporting_pqr_ids: string[]
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
          linked_pwps_ids?: string[]
          notes?: string | null
          pass_type?: string | null
          peening?: string | null
          pipe_or_plate?: string | null
          position?: string | null
          position_qualified?: string | null
          pqr_id?: string | null
          pqr_no?: string | null
          preheat_method?: string | null
          preheat_min_c?: number | null
          preheat_temp?: string | null
          procedure_type?: string | null
          process: string
          pwht?: string | null
          pwps_id?: string | null
          qr_token?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision?: string
          shielding_gas?: string | null
          standard: string
          status?: Database["public"]["Enums"]["procedure_status"]
          submitted_by?: string | null
          submitted_for_review_at?: string | null
          supporting_pqr_ids?: string[]
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
          linked_pwps_ids?: string[]
          notes?: string | null
          pass_type?: string | null
          peening?: string | null
          pipe_or_plate?: string | null
          position?: string | null
          position_qualified?: string | null
          pqr_id?: string | null
          pqr_no?: string | null
          preheat_method?: string | null
          preheat_min_c?: number | null
          preheat_temp?: string | null
          procedure_type?: string | null
          process?: string
          pwht?: string | null
          pwps_id?: string | null
          qr_token?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision?: string
          shielding_gas?: string | null
          standard?: string
          status?: Database["public"]["Enums"]["procedure_status"]
          submitted_by?: string | null
          submitted_for_review_at?: string | null
          supporting_pqr_ids?: string[]
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
          {
            foreignKeyName: "procedures_pqr_id_fkey"
            columns: ["pqr_id"]
            isOneToOne: false
            referencedRelation: "pqrs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedures_pwps_id_fkey"
            columns: ["pwps_id"]
            isOneToOne: false
            referencedRelation: "pwps"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"]
          approved_at: string | null
          approved_by: string | null
          avatar_url: string | null
          company_id: string | null
          created_at: string
          display_name: string | null
          id: string
          job_title: string | null
          language: string
          pending_role: Database["public"]["Enums"]["app_role"] | null
          phone: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          theme_preference: string
          updated_at: string
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          job_title?: string | null
          language?: string
          pending_role?: Database["public"]["Enums"]["app_role"] | null
          phone?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          theme_preference?: string
          updated_at?: string
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          job_title?: string | null
          language?: string
          pending_role?: Database["public"]["Enums"]["app_role"] | null
          phone?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          theme_preference?: string
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
      project_events: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          company_id: string
          created_at: string
          id: string
          kind: string
          payload: Json | null
          project_id: string
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string | null
          company_id: string
          created_at?: string
          id?: string
          kind: string
          payload?: Json | null
          project_id: string
        }
        Update: {
          actor_id?: string | null
          actor_name?: string | null
          company_id?: string
          created_at?: string
          id?: string
          kind?: string
          payload?: Json | null
          project_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          client: string | null
          closed_at: string | null
          closed_by: string | null
          code: string
          company_id: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          end_date: string | null
          held_at: string | null
          hold_reason: string | null
          id: string
          location: string | null
          name: string
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          resumed_at: string | null
          start_date: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["project_status"]
          submitted_at: string | null
          updated_at: string
          workflow_status: Database["public"]["Enums"]["project_workflow_status"]
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client?: string | null
          closed_at?: string | null
          closed_by?: string | null
          code: string
          company_id: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          end_date?: string | null
          held_at?: string | null
          hold_reason?: string | null
          id?: string
          location?: string | null
          name: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          resumed_at?: string | null
          start_date?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          submitted_at?: string | null
          updated_at?: string
          workflow_status?: Database["public"]["Enums"]["project_workflow_status"]
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client?: string | null
          closed_at?: string | null
          closed_by?: string | null
          code?: string
          company_id?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          end_date?: string | null
          held_at?: string | null
          hold_reason?: string | null
          id?: string
          location?: string | null
          name?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          resumed_at?: string | null
          start_date?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          submitted_at?: string | null
          updated_at?: string
          workflow_status?: Database["public"]["Enums"]["project_workflow_status"]
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
      pwps: {
        Row: {
          a_no: string | null
          backing: string | null
          base_material: string | null
          code_family: string
          company_id: string
          converted_at: string | null
          converted_to_procedure_id: string | null
          created_at: string
          created_by: string | null
          current_max: number | null
          current_min: number | null
          deleted_at: string | null
          deleted_by: string | null
          diameter_max_mm: number | null
          diameter_min_mm: number | null
          f_no: string | null
          filler_classification: string | null
          filler_diameter_mm: string | null
          filler_material: string | null
          groove_type: string | null
          group_number: string | null
          heat_input_max: number | null
          heat_input_min: number | null
          id: string
          interpass_max_c: number | null
          joint_type: string | null
          notes: string | null
          p_number: string | null
          polarity: string | null
          position: string | null
          preheat_min_c: number | null
          process: string | null
          project_id: string | null
          pwht: string | null
          pwps_no: string
          qualified_at: string | null
          rejected_at: string | null
          revision: string
          shielding_gas: string | null
          standard: string | null
          status: Database["public"]["Enums"]["pwps_status"]
          submitted_at: string | null
          supporting_pqr_ids: string[]
          technique_notes: string | null
          thickness_max_mm: number | null
          thickness_min_mm: number | null
          title: string | null
          travel_speed_max: number | null
          travel_speed_min: number | null
          updated_at: string
          voltage_max: number | null
          voltage_min: number | null
        }
        Insert: {
          a_no?: string | null
          backing?: string | null
          base_material?: string | null
          code_family?: string
          company_id: string
          converted_at?: string | null
          converted_to_procedure_id?: string | null
          created_at?: string
          created_by?: string | null
          current_max?: number | null
          current_min?: number | null
          deleted_at?: string | null
          deleted_by?: string | null
          diameter_max_mm?: number | null
          diameter_min_mm?: number | null
          f_no?: string | null
          filler_classification?: string | null
          filler_diameter_mm?: string | null
          filler_material?: string | null
          groove_type?: string | null
          group_number?: string | null
          heat_input_max?: number | null
          heat_input_min?: number | null
          id?: string
          interpass_max_c?: number | null
          joint_type?: string | null
          notes?: string | null
          p_number?: string | null
          polarity?: string | null
          position?: string | null
          preheat_min_c?: number | null
          process?: string | null
          project_id?: string | null
          pwht?: string | null
          pwps_no: string
          qualified_at?: string | null
          rejected_at?: string | null
          revision?: string
          shielding_gas?: string | null
          standard?: string | null
          status?: Database["public"]["Enums"]["pwps_status"]
          submitted_at?: string | null
          supporting_pqr_ids?: string[]
          technique_notes?: string | null
          thickness_max_mm?: number | null
          thickness_min_mm?: number | null
          title?: string | null
          travel_speed_max?: number | null
          travel_speed_min?: number | null
          updated_at?: string
          voltage_max?: number | null
          voltage_min?: number | null
        }
        Update: {
          a_no?: string | null
          backing?: string | null
          base_material?: string | null
          code_family?: string
          company_id?: string
          converted_at?: string | null
          converted_to_procedure_id?: string | null
          created_at?: string
          created_by?: string | null
          current_max?: number | null
          current_min?: number | null
          deleted_at?: string | null
          deleted_by?: string | null
          diameter_max_mm?: number | null
          diameter_min_mm?: number | null
          f_no?: string | null
          filler_classification?: string | null
          filler_diameter_mm?: string | null
          filler_material?: string | null
          groove_type?: string | null
          group_number?: string | null
          heat_input_max?: number | null
          heat_input_min?: number | null
          id?: string
          interpass_max_c?: number | null
          joint_type?: string | null
          notes?: string | null
          p_number?: string | null
          polarity?: string | null
          position?: string | null
          preheat_min_c?: number | null
          process?: string | null
          project_id?: string | null
          pwht?: string | null
          pwps_no?: string
          qualified_at?: string | null
          rejected_at?: string | null
          revision?: string
          shielding_gas?: string | null
          standard?: string | null
          status?: Database["public"]["Enums"]["pwps_status"]
          submitted_at?: string | null
          supporting_pqr_ids?: string[]
          technique_notes?: string | null
          thickness_max_mm?: number | null
          thickness_min_mm?: number | null
          title?: string | null
          travel_speed_max?: number | null
          travel_speed_min?: number | null
          updated_at?: string
          voltage_max?: number | null
          voltage_min?: number | null
        }
        Relationships: []
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
          pqr_id: string | null
          qualification_id: string | null
          role: string
          signature_data_url: string | null
          signed_at: string
        }
        Insert: {
          actor_id?: string | null
          company_id: string
          id?: string
          name: string
          pqr_id?: string | null
          qualification_id?: string | null
          role: string
          signature_data_url?: string | null
          signed_at?: string
        }
        Update: {
          actor_id?: string | null
          company_id?: string
          id?: string
          name?: string
          pqr_id?: string | null
          qualification_id?: string | null
          role?: string
          signature_data_url?: string | null
          signed_at?: string
        }
        Relationships: []
      }
      qualification_tests: {
        Row: {
          acceptance_criteria: string | null
          category: string
          company_id: string
          created_at: string
          findings: string | null
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
          acceptance_criteria?: string | null
          category: string
          company_id: string
          created_at?: string
          findings?: string | null
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
          acceptance_criteria?: string | null
          category?: string
          company_id?: string
          created_at?: string
          findings?: string | null
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
      rca_analyses: {
        Row: {
          company_id: string
          conclusion: string | null
          contributing_causes: Json
          created_at: string
          evidence: string | null
          id: string
          method: Database["public"]["Enums"]["rca_method"]
          ncr_id: string
          performed_at: string
          performed_by: string | null
          performed_by_name: string | null
          primary_cause:
            | Database["public"]["Enums"]["rca_cause_category"]
            | null
          primary_cause_detail: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          conclusion?: string | null
          contributing_causes?: Json
          created_at?: string
          evidence?: string | null
          id?: string
          method?: Database["public"]["Enums"]["rca_method"]
          ncr_id: string
          performed_at?: string
          performed_by?: string | null
          performed_by_name?: string | null
          primary_cause?:
            | Database["public"]["Enums"]["rca_cause_category"]
            | null
          primary_cause_detail?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          conclusion?: string | null
          contributing_causes?: Json
          created_at?: string
          evidence?: string | null
          id?: string
          method?: Database["public"]["Enums"]["rca_method"]
          ncr_id?: string
          performed_at?: string
          performed_by?: string | null
          performed_by_name?: string | null
          primary_cause?:
            | Database["public"]["Enums"]["rca_cause_category"]
            | null
          primary_cause_detail?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rca_analyses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rca_analyses_ncr_id_fkey"
            columns: ["ncr_id"]
            isOneToOne: false
            referencedRelation: "ncrs"
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
      rework_jobs: {
        Row: {
          company_id: string
          completed_at: string | null
          created_at: string
          id: string
          ncr_id: string
          notes: string | null
          planned_start: string | null
          reinspection_id: string | null
          repair_method: string | null
          rework_wps_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["rework_status"]
          updated_at: string
          weld_id: string | null
          welder_id: string | null
          welder_name: string | null
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          ncr_id: string
          notes?: string | null
          planned_start?: string | null
          reinspection_id?: string | null
          repair_method?: string | null
          rework_wps_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["rework_status"]
          updated_at?: string
          weld_id?: string | null
          welder_id?: string | null
          welder_name?: string | null
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          ncr_id?: string
          notes?: string | null
          planned_start?: string | null
          reinspection_id?: string | null
          repair_method?: string | null
          rework_wps_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["rework_status"]
          updated_at?: string
          weld_id?: string | null
          welder_id?: string | null
          welder_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rework_jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rework_jobs_ncr_id_fkey"
            columns: ["ncr_id"]
            isOneToOne: false
            referencedRelation: "ncrs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rework_jobs_reinspection_id_fkey"
            columns: ["reinspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rework_jobs_rework_wps_id_fkey"
            columns: ["rework_wps_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rework_jobs_weld_id_fkey"
            columns: ["weld_id"]
            isOneToOne: false
            referencedRelation: "welds"
            referencedColumns: ["id"]
          },
        ]
      }
      test_coupons: {
        Row: {
          backing: string | null
          company_id: string
          coupon_no: string
          created_at: string
          created_by: string | null
          diameter_mm: number | null
          filler_classification: string | null
          filler_metal: string | null
          group_number: string | null
          heat_number: string | null
          id: string
          joint_type: string | null
          material_spec: string | null
          notes: string | null
          p_number: string | null
          position: string | null
          pqr_id: string | null
          process: string | null
          project_id: string | null
          pwps_id: string | null
          test_date: string | null
          thickness_mm: number | null
          updated_at: string
          welder_name: string | null
          welder_qualification_id: string | null
        }
        Insert: {
          backing?: string | null
          company_id: string
          coupon_no: string
          created_at?: string
          created_by?: string | null
          diameter_mm?: number | null
          filler_classification?: string | null
          filler_metal?: string | null
          group_number?: string | null
          heat_number?: string | null
          id?: string
          joint_type?: string | null
          material_spec?: string | null
          notes?: string | null
          p_number?: string | null
          position?: string | null
          pqr_id?: string | null
          process?: string | null
          project_id?: string | null
          pwps_id?: string | null
          test_date?: string | null
          thickness_mm?: number | null
          updated_at?: string
          welder_name?: string | null
          welder_qualification_id?: string | null
        }
        Update: {
          backing?: string | null
          company_id?: string
          coupon_no?: string
          created_at?: string
          created_by?: string | null
          diameter_mm?: number | null
          filler_classification?: string | null
          filler_metal?: string | null
          group_number?: string | null
          heat_number?: string | null
          id?: string
          joint_type?: string | null
          material_spec?: string | null
          notes?: string | null
          p_number?: string | null
          position?: string | null
          pqr_id?: string | null
          process?: string | null
          project_id?: string | null
          pwps_id?: string | null
          test_date?: string | null
          thickness_mm?: number | null
          updated_at?: string
          welder_name?: string | null
          welder_qualification_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_coupons_pqr_id_fkey"
            columns: ["pqr_id"]
            isOneToOne: false
            referencedRelation: "pqrs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_coupons_pwps_id_fkey"
            columns: ["pwps_id"]
            isOneToOne: false
            referencedRelation: "pwps"
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
      watchers: {
        Row: {
          auto_added: boolean
          company_id: string
          created_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["collab_entity_type"]
          id: string
          user_id: string
        }
        Insert: {
          auto_added?: boolean
          company_id: string
          created_at?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["collab_entity_type"]
          id?: string
          user_id: string
        }
        Update: {
          auto_added?: boolean
          company_id?: string
          created_at?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["collab_entity_type"]
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchers_company_id_fkey"
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
      welding_execution_records: {
        Row: {
          amperage: number | null
          company_id: string
          coupon_id: string
          created_at: string
          filler_classification: string | null
          filler_diameter_mm: number | null
          gas_flow: number | null
          gas_type: string | null
          heat_input: number | null
          id: string
          interpass_temp_c: number | null
          pass_number: number | null
          pass_type: string | null
          polarity: string | null
          preheat_temp_c: number | null
          process: string | null
          recorded_at: string
          recorded_by: string | null
          sequence_notes: string | null
          travel_speed: number | null
          updated_at: string
          voltage: number | null
        }
        Insert: {
          amperage?: number | null
          company_id: string
          coupon_id: string
          created_at?: string
          filler_classification?: string | null
          filler_diameter_mm?: number | null
          gas_flow?: number | null
          gas_type?: string | null
          heat_input?: number | null
          id?: string
          interpass_temp_c?: number | null
          pass_number?: number | null
          pass_type?: string | null
          polarity?: string | null
          preheat_temp_c?: number | null
          process?: string | null
          recorded_at?: string
          recorded_by?: string | null
          sequence_notes?: string | null
          travel_speed?: number | null
          updated_at?: string
          voltage?: number | null
        }
        Update: {
          amperage?: number | null
          company_id?: string
          coupon_id?: string
          created_at?: string
          filler_classification?: string | null
          filler_diameter_mm?: number | null
          gas_flow?: number | null
          gas_type?: string | null
          heat_input?: number | null
          id?: string
          interpass_temp_c?: number | null
          pass_number?: number | null
          pass_type?: string | null
          polarity?: string | null
          preheat_temp_c?: number | null
          process?: string | null
          recorded_at?: string
          recorded_by?: string | null
          sequence_notes?: string | null
          travel_speed?: number | null
          updated_at?: string
          voltage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "welding_execution_records_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "test_coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      welds: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          base_material: string | null
          blocked_reason: string | null
          company_id: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
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
          deleted_at?: string | null
          deleted_by?: string | null
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
          deleted_at?: string | null
          deleted_by?: string | null
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
      wps_notes: {
        Row: {
          body: string
          category: string
          company_id: string
          created_at: string
          id: string
          procedure_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          body: string
          category?: string
          company_id: string
          created_at?: string
          id?: string
          procedure_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string
          company_id?: string
          created_at?: string
          id?: string
          procedure_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      wps_positions: {
        Row: {
          company_id: string
          created_at: string
          id: string
          notes: string | null
          position: string
          procedure_id: string
          progression: string | null
          qualified_range: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          notes?: string | null
          position: string
          procedure_id: string
          progression?: string | null
          qualified_range?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          position?: string
          procedure_id?: string
          progression?: string | null
          qualified_range?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      wps_preheat_entries: {
        Row: {
          applicability: string | null
          company_id: string
          created_at: string
          id: string
          interpass_max_c: number | null
          maintenance: string | null
          notes: string | null
          preheat_max_c: number | null
          preheat_method: string | null
          preheat_min_c: number | null
          procedure_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          applicability?: string | null
          company_id: string
          created_at?: string
          id?: string
          interpass_max_c?: number | null
          maintenance?: string | null
          notes?: string | null
          preheat_max_c?: number | null
          preheat_method?: string | null
          preheat_min_c?: number | null
          procedure_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          applicability?: string | null
          company_id?: string
          created_at?: string
          id?: string
          interpass_max_c?: number | null
          maintenance?: string | null
          notes?: string | null
          preheat_max_c?: number | null
          preheat_method?: string | null
          preheat_min_c?: number | null
          procedure_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      wps_pwht: {
        Row: {
          applicability: string | null
          atmosphere: string | null
          company_id: string
          cooling_rate: string | null
          created_at: string
          heating_rate: string | null
          hold_time_min: number | null
          id: string
          notes: string | null
          procedure_id: string
          sort_order: number
          temperature_c: number | null
          updated_at: string
        }
        Insert: {
          applicability?: string | null
          atmosphere?: string | null
          company_id: string
          cooling_rate?: string | null
          created_at?: string
          heating_rate?: string | null
          hold_time_min?: number | null
          id?: string
          notes?: string | null
          procedure_id: string
          sort_order?: number
          temperature_c?: number | null
          updated_at?: string
        }
        Update: {
          applicability?: string | null
          atmosphere?: string | null
          company_id?: string
          cooling_rate?: string | null
          created_at?: string
          heating_rate?: string | null
          hold_time_min?: number | null
          id?: string
          notes?: string | null
          procedure_id?: string
          sort_order?: number
          temperature_c?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      wps_shielding_gases: {
        Row: {
          company_id: string
          composition: string | null
          created_at: string
          flow_rate_lpm: number | null
          gas_type: string | null
          id: string
          notes: string | null
          procedure_id: string
          process: string | null
          purge_flow_lpm: number | null
          purge_gas: string | null
          sort_order: number
          trailing_gas: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          composition?: string | null
          created_at?: string
          flow_rate_lpm?: number | null
          gas_type?: string | null
          id?: string
          notes?: string | null
          procedure_id: string
          process?: string | null
          purge_flow_lpm?: number | null
          purge_gas?: string | null
          sort_order?: number
          trailing_gas?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          composition?: string | null
          created_at?: string
          flow_rate_lpm?: number | null
          gas_type?: string | null
          id?: string
          notes?: string | null
          procedure_id?: string
          process?: string | null
          purge_flow_lpm?: number | null
          purge_gas?: string | null
          sort_order?: number
          trailing_gas?: string | null
          updated_at?: string
        }
        Relationships: []
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
      wps_techniques: {
        Row: {
          automation: string | null
          back_gouging: string | null
          cleaning_method: string | null
          company_id: string
          created_at: string
          electrode_mode: string | null
          id: string
          multi_or_single_pass: string | null
          notes: string | null
          oscillation: string | null
          pass_type: string | null
          peening: string | null
          procedure_id: string
          process: string | null
          sort_order: number
          string_or_weave: string | null
          updated_at: string
        }
        Insert: {
          automation?: string | null
          back_gouging?: string | null
          cleaning_method?: string | null
          company_id: string
          created_at?: string
          electrode_mode?: string | null
          id?: string
          multi_or_single_pass?: string | null
          notes?: string | null
          oscillation?: string | null
          pass_type?: string | null
          peening?: string | null
          procedure_id: string
          process?: string | null
          sort_order?: number
          string_or_weave?: string | null
          updated_at?: string
        }
        Update: {
          automation?: string | null
          back_gouging?: string | null
          cleaning_method?: string | null
          company_id?: string
          created_at?: string
          electrode_mode?: string | null
          id?: string
          multi_or_single_pass?: string | null
          notes?: string | null
          oscillation?: string | null
          pass_type?: string | null
          peening?: string | null
          procedure_id?: string
          process?: string | null
          sort_order?: number
          string_or_weave?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      wps_variables: {
        Row: {
          actual_range: string | null
          category: Database["public"]["Enums"]["wps_variable_category"]
          code_reference: string | null
          company_id: string
          created_at: string
          group_name: string
          id: string
          notes: string | null
          procedure_id: string
          process_ref: string | null
          qualified_value: string | null
          sort_order: number
          transferable: boolean | null
          updated_at: string
          variable_key: string | null
          variable_label: string
        }
        Insert: {
          actual_range?: string | null
          category?: Database["public"]["Enums"]["wps_variable_category"]
          code_reference?: string | null
          company_id: string
          created_at?: string
          group_name: string
          id?: string
          notes?: string | null
          procedure_id: string
          process_ref?: string | null
          qualified_value?: string | null
          sort_order?: number
          transferable?: boolean | null
          updated_at?: string
          variable_key?: string | null
          variable_label: string
        }
        Update: {
          actual_range?: string | null
          category?: Database["public"]["Enums"]["wps_variable_category"]
          code_reference?: string | null
          company_id?: string
          created_at?: string
          group_name?: string
          id?: string
          notes?: string | null
          procedure_id?: string
          process_ref?: string | null
          qualified_value?: string | null
          sort_order?: number
          transferable?: boolean | null
          updated_at?: string
          variable_key?: string | null
          variable_label?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: { Args: { _token: string }; Returns: string }
      approve_user: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      can_read_entity: {
        Args: {
          _entity_id: string
          _entity_type: Database["public"]["Enums"]["collab_entity_type"]
        }
        Returns: boolean
      }
      can_subscribe_realtime_topic: {
        Args: { _topic: string }
        Returns: boolean
      }
      complete_rework_and_reinspect: {
        Args: { _notes?: string; _rework_id: string }
        Returns: string
      }
      current_company_id: { Args: never; Returns: string }
      entity_link: {
        Args: {
          _entity_id: string
          _entity_type: Database["public"]["Enums"]["collab_entity_type"]
        }
        Returns: string
      }
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
      mark_notifications_read: { Args: { _ids: string[] }; Returns: undefined }
      open_ncr_from_defect: {
        Args: {
          _defect_ids: string[]
          _inspection_id: string
          _severity?: Database["public"]["Enums"]["severity_level"]
          _title: string
        }
        Returns: string
      }
      post_comment: {
        Args: {
          _attachments: Json
          _body_md: string
          _body_plain: string
          _category: string
          _entity_id: string
          _entity_type: Database["public"]["Enums"]["collab_entity_type"]
          _mention_roles: Database["public"]["Enums"]["app_role"][]
          _mention_user_ids: string[]
          _parent_id: string
        }
        Returns: string
      }
      reject_user: {
        Args: { _reason: string; _user_id: string }
        Returns: undefined
      }
      restore_equipment: { Args: { _id: string }; Returns: undefined }
      restore_inspection: { Args: { _id: string }; Returns: undefined }
      restore_instrument: { Args: { _id: string }; Returns: undefined }
      restore_ncr: { Args: { _id: string }; Returns: undefined }
      restore_pqr: { Args: { _id: string }; Returns: undefined }
      restore_procedure: { Args: { _id: string }; Returns: undefined }
      restore_project: { Args: { _id: string }; Returns: undefined }
      restore_pwps: { Args: { _id: string }; Returns: undefined }
      restore_qualification: { Args: { _id: string }; Returns: undefined }
      restore_weld: { Args: { _id: string }; Returns: undefined }
      soft_delete_equipment: { Args: { _id: string }; Returns: undefined }
      soft_delete_inspection: { Args: { _id: string }; Returns: undefined }
      soft_delete_instrument: { Args: { _id: string }; Returns: undefined }
      soft_delete_ncr: { Args: { _id: string }; Returns: undefined }
      soft_delete_pqr: { Args: { _id: string }; Returns: undefined }
      soft_delete_procedure: { Args: { _id: string }; Returns: undefined }
      soft_delete_project: { Args: { _id: string }; Returns: undefined }
      soft_delete_pwps: { Args: { _id: string }; Returns: undefined }
      soft_delete_qualification: { Args: { _id: string }; Returns: undefined }
      soft_delete_weld: { Args: { _id: string }; Returns: undefined }
      start_rework: {
        Args: {
          _method: string
          _ncr_id: string
          _welder_name: string
          _wps_id: string
        }
        Returns: string
      }
      toggle_reaction: {
        Args: { _comment_id: string; _emoji: string }
        Returns: boolean
      }
      toggle_watch: {
        Args: {
          _entity_id: string
          _entity_type: Database["public"]["Enums"]["collab_entity_type"]
        }
        Returns: boolean
      }
      transition_ncr: {
        Args: {
          _comment?: string
          _id: string
          _reason?: string
          _to: Database["public"]["Enums"]["ncr_status"]
        }
        Returns: undefined
      }
      transition_project: {
        Args: {
          _comment?: string
          _id: string
          _reason?: string
          _to: Database["public"]["Enums"]["project_workflow_status"]
        }
        Returns: undefined
      }
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
      approval_status: "pending" | "approved" | "rejected"
      capa_status:
        | "Proposed"
        | "Approved"
        | "In Progress"
        | "Completed"
        | "Verified"
        | "Cancelled"
      capa_type: "Corrective" | "Preventive" | "Containment"
      collab_entity_type:
        | "ncr"
        | "weld"
        | "procedure"
        | "pwps"
        | "pqr"
        | "qualification"
        | "inspection"
        | "project"
        | "capa"
        | "rework_job"
        | "instrument"
        | "equipment"
      defect_category:
        | "Discontinuity"
        | "Geometric"
        | "Metallurgical"
        | "Surface"
        | "Dimensional"
        | "Other"
      defect_disposition:
        | "Accept"
        | "Repair"
        | "Reject"
        | "Use As-Is"
        | "Pending Engineering"
      equipment_status:
        | "Operational"
        | "Maintenance"
        | "Calibration Due"
        | "Out of Service"
      finding_severity: "info" | "warning" | "error" | "critical"
      inspection_workflow_status:
        | "Requested"
        | "Assigned"
        | "In Progress"
        | "Pending Review"
        | "Accepted"
        | "Rejected"
        | "NCR Raised"
        | "Re-Inspection Required"
        | "Closed"
      instrument_status: "Active" | "Calibration Due" | "Out of Service"
      mechanical_test_type:
        | "Tensile"
        | "Bend"
        | "Impact"
        | "Hardness"
        | "Macro Etch"
        | "Fracture"
      ncr_status:
        | "Draft"
        | "Open"
        | "Root Cause"
        | "CA Pending"
        | "In Review"
        | "Closed"
        | "Rejected"
        | "Under Investigation"
        | "Corrective Action Proposed"
        | "Awaiting Approval"
        | "Rework Required"
        | "Repaired"
        | "Re-Inspection Required"
        | "Accepted As-Is"
      ndt_method: "RT" | "UT" | "PT" | "MT" | "VT"
      pqr_status:
        | "Draft"
        | "In Testing"
        | "Under Review"
        | "Passed"
        | "Failed"
        | "Withdrawn"
        | "Expired"
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
      project_workflow_status:
        | "Draft"
        | "Planning"
        | "Approved"
        | "In Progress"
        | "On Hold"
        | "Closed"
        | "Rejected"
        | "Cancelled"
      pwps_status:
        | "Draft"
        | "Under Qualification"
        | "Testing"
        | "Pending Validation"
        | "Qualified"
        | "Rejected"
        | "Converted"
      qualification_status: "Active" | "Expiring Soon" | "Expired" | "Suspended"
      rca_cause_category:
        | "Human Error"
        | "Procedure Issue"
        | "Material Issue"
        | "Equipment Issue"
        | "Environmental Issue"
        | "Training Deficiency"
        | "Other"
      rca_method: "5 Why" | "Fishbone" | "Custom"
      rework_status:
        | "Planned"
        | "In Progress"
        | "Completed"
        | "Re-Inspected"
        | "Cancelled"
      severity_level: "Low" | "Medium" | "High" | "Critical"
      test_result: "Pending" | "Pass" | "Fail" | "N/A"
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
      wps_variable_category:
        | "essential"
        | "non_essential"
        | "supplementary_essential"
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
      approval_status: ["pending", "approved", "rejected"],
      capa_status: [
        "Proposed",
        "Approved",
        "In Progress",
        "Completed",
        "Verified",
        "Cancelled",
      ],
      capa_type: ["Corrective", "Preventive", "Containment"],
      collab_entity_type: [
        "ncr",
        "weld",
        "procedure",
        "pwps",
        "pqr",
        "qualification",
        "inspection",
        "project",
        "capa",
        "rework_job",
        "instrument",
        "equipment",
      ],
      defect_category: [
        "Discontinuity",
        "Geometric",
        "Metallurgical",
        "Surface",
        "Dimensional",
        "Other",
      ],
      defect_disposition: [
        "Accept",
        "Repair",
        "Reject",
        "Use As-Is",
        "Pending Engineering",
      ],
      equipment_status: [
        "Operational",
        "Maintenance",
        "Calibration Due",
        "Out of Service",
      ],
      finding_severity: ["info", "warning", "error", "critical"],
      inspection_workflow_status: [
        "Requested",
        "Assigned",
        "In Progress",
        "Pending Review",
        "Accepted",
        "Rejected",
        "NCR Raised",
        "Re-Inspection Required",
        "Closed",
      ],
      instrument_status: ["Active", "Calibration Due", "Out of Service"],
      mechanical_test_type: [
        "Tensile",
        "Bend",
        "Impact",
        "Hardness",
        "Macro Etch",
        "Fracture",
      ],
      ncr_status: [
        "Draft",
        "Open",
        "Root Cause",
        "CA Pending",
        "In Review",
        "Closed",
        "Rejected",
        "Under Investigation",
        "Corrective Action Proposed",
        "Awaiting Approval",
        "Rework Required",
        "Repaired",
        "Re-Inspection Required",
        "Accepted As-Is",
      ],
      ndt_method: ["RT", "UT", "PT", "MT", "VT"],
      pqr_status: [
        "Draft",
        "In Testing",
        "Under Review",
        "Passed",
        "Failed",
        "Withdrawn",
        "Expired",
      ],
      procedure_status: ["Draft", "Review", "Approved", "Archived", "Rejected"],
      project_status: [
        "Planning",
        "Active",
        "On Hold",
        "Completed",
        "Cancelled",
      ],
      project_workflow_status: [
        "Draft",
        "Planning",
        "Approved",
        "In Progress",
        "On Hold",
        "Closed",
        "Rejected",
        "Cancelled",
      ],
      pwps_status: [
        "Draft",
        "Under Qualification",
        "Testing",
        "Pending Validation",
        "Qualified",
        "Rejected",
        "Converted",
      ],
      qualification_status: ["Active", "Expiring Soon", "Expired", "Suspended"],
      rca_cause_category: [
        "Human Error",
        "Procedure Issue",
        "Material Issue",
        "Equipment Issue",
        "Environmental Issue",
        "Training Deficiency",
        "Other",
      ],
      rca_method: ["5 Why", "Fishbone", "Custom"],
      rework_status: [
        "Planned",
        "In Progress",
        "Completed",
        "Re-Inspected",
        "Cancelled",
      ],
      severity_level: ["Low", "Medium", "High", "Critical"],
      test_result: ["Pending", "Pass", "Fail", "N/A"],
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
      wps_variable_category: [
        "essential",
        "non_essential",
        "supplementary_essential",
      ],
    },
  },
} as const
