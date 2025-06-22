export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      course: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      docType: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      enrolment: {
        Row: {
          course: string
          createdBy: string | null
          enrolmentType: number
          user: string
        }
        Insert: {
          course: string
          createdBy?: string | null
          enrolmentType: number
          user: string
        }
        Update: {
          course?: string
          createdBy?: string | null
          enrolmentType?: number
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrolment_course_fkey"
            columns: ["course"]
            isOneToOne: false
            referencedRelation: "course"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrolment_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrolment_enrolmentType_fkey"
            columns: ["enrolmentType"]
            isOneToOne: false
            referencedRelation: "enrolmentType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrolment_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      enrolmentType: {
        Row: {
          created_at: string
          description: string
          id: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
        }
        Relationships: []
      }
      item: {
        Row: {
          course: string
          created_at: string
          description: string | null
          id: string
          link: string | null
          parent: string | null
          title: string
          type: number
          visible: boolean
        }
        Insert: {
          course: string
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          parent?: string | null
          title: string
          type: number
          visible?: boolean
        }
        Update: {
          course?: string
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          parent?: string | null
          title?: string
          type?: number
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "item_course_fkey"
            columns: ["course"]
            isOneToOne: false
            referencedRelation: "course"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_parent_fkey"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "docType"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          email: string
          id: string
          userRole: number
        }
        Insert: {
          email: string
          id?: string
          userRole: number
        }
        Update: {
          email?: string
          id?: string
          userRole?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_userRole_fkey"
            columns: ["userRole"]
            isOneToOne: false
            referencedRelation: "userRole"
            referencedColumns: ["id"]
          },
        ]
      }
      userRole: {
        Row: {
          created_at: string
          description: string
          id: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      change_user_password: {
        Args: { current_plain_password: string; new_plain_password: string }
        Returns: Json
      }
      delete_course_by_id_if_no_enrolments: {
        Args: { course_id: string }
        Returns: undefined
      }
      delete_course_if_no_enrolments: {
        Args: { course_id: string }
        Returns: undefined
      }
      delete_enrolments_for_user: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      is_item_and_parents_visible: {
        Args: { item_id: string }
        Returns: boolean
      }
      is_teacher: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_enrolled_in_course: {
        Args: { course_id: string }
        Returns: boolean
      }
      is_user_lecturer_in_course: {
        Args: { course_id: string }
        Returns: boolean
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
