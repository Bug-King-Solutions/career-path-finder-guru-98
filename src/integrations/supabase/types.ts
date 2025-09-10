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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string | null
          booking_type: string
          created_at: string
          id: string
          notes: string | null
          school_id: string | null
          status: string | null
          student_id: string | null
          updated_at: string
        }
        Insert: {
          booking_date?: string | null
          booking_type: string
          created_at?: string
          id?: string
          notes?: string | null
          school_id?: string | null
          status?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          booking_date?: string | null
          booking_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          school_id?: string | null
          status?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      bug_kings: {
        Row: {
          achievements: string[] | null
          bio: string | null
          created_at: string
          description: string
          featured: boolean
          id: string
          image_url: string | null
          name: string
          projects: string[] | null
          skills: string[]
          title: string
          updated_at: string
        }
        Insert: {
          achievements?: string[] | null
          bio?: string | null
          created_at?: string
          description: string
          featured?: boolean
          id?: string
          image_url?: string | null
          name: string
          projects?: string[] | null
          skills?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          achievements?: string[] | null
          bio?: string | null
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          name?: string
          projects?: string[] | null
          skills?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          project_type: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          project_type?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          project_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      school_evaluation_questions: {
        Row: {
          created_at: string
          id: string
          options: Json | null
          question_text: string
          question_type: string
          school_id: string
          section: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          options?: Json | null
          question_text: string
          question_type?: string
          school_id: string
          section?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          options?: Json | null
          question_text?: string
          question_type?: string
          school_id?: string
          section?: string
          updated_at?: string
        }
        Relationships: []
      }
      school_options: {
        Row: {
          created_at: string | null
          id: string
          location: string
          school_name: string
          school_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string
          school_name: string
          school_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string
          school_name?: string
          school_type?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          contact_email: string
          created_at: string
          id: string
          phone: string | null
          school_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          contact_email: string
          created_at?: string
          id?: string
          phone?: string | null
          school_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          contact_email?: string
          created_at?: string
          id?: string
          phone?: string | null
          school_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_custom_answers: {
        Row: {
          answer: string
          answered_at: string
          id: string
          question_id: string
          student_id: string
        }
        Insert: {
          answer: string
          answered_at?: string
          id?: string
          question_id: string
          student_id: string
        }
        Update: {
          answer?: string
          answered_at?: string
          id?: string
          question_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_custom_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "school_evaluation_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          course_field: string
          created_at: string
          id: string
          progress_percentage: number | null
          student_id: string
          universities_explored: string[] | null
          updated_at: string
        }
        Insert: {
          course_field: string
          created_at?: string
          id?: string
          progress_percentage?: number | null
          student_id: string
          universities_explored?: string[] | null
          updated_at?: string
        }
        Update: {
          course_field?: string
          created_at?: string
          id?: string
          progress_percentage?: number | null
          student_id?: string
          universities_explored?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_test_results: {
        Row: {
          completed_at: string
          id: string
          personality_type: string | null
          recommendations: string[] | null
          scores: Json | null
          student_id: string
          test_type: string
        }
        Insert: {
          completed_at?: string
          id?: string
          personality_type?: string | null
          recommendations?: string[] | null
          scores?: Json | null
          student_id: string
          test_type: string
        }
        Update: {
          completed_at?: string
          id?: string
          personality_type?: string | null
          recommendations?: string[] | null
          scores?: Json | null
          student_id?: string
          test_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_test_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          education_level: string | null
          email: string
          first_name: string
          id: string
          interests: string[] | null
          last_name: string
          personality_type: string | null
          school_id: string | null
          skills: string[] | null
          test_completed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          education_level?: string | null
          email: string
          first_name: string
          id?: string
          interests?: string[] | null
          last_name: string
          personality_type?: string | null
          school_id?: string | null
          skills?: string[] | null
          test_completed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          education_level?: string | null
          email?: string
          first_name?: string
          id?: string
          interests?: string[] | null
          last_name?: string
          personality_type?: string | null
          school_id?: string | null
          skills?: string[] | null
          test_completed?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_options"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      current_user_has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "student" | "school"
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
      app_role: ["admin", "moderator", "user", "student", "school"],
    },
  },
} as const
