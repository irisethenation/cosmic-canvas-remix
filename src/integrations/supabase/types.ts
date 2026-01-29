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
      agreements: {
        Row: {
          content_markdown: string
          created_at: string
          id: string
          is_active: boolean
          key: string
          title: string
          version: string
        }
        Insert: {
          content_markdown: string
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          title: string
          version?: string
        }
        Update: {
          content_markdown?: string
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          title?: string
          version?: string
        }
        Relationships: []
      }
      calls: {
        Row: {
          case_id: string | null
          consent_confirmed: boolean
          created_at: string
          direction: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          phone_number: string | null
          provider: string
          recording_url: string | null
          started_at: string
          status: string
          transcript: string | null
          updated_at: string
          user_id: string | null
          vapi_call_id: string | null
        }
        Insert: {
          case_id?: string | null
          consent_confirmed?: boolean
          created_at?: string
          direction?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          phone_number?: string | null
          provider?: string
          recording_url?: string | null
          started_at?: string
          status?: string
          transcript?: string | null
          updated_at?: string
          user_id?: string | null
          vapi_call_id?: string | null
        }
        Update: {
          case_id?: string | null
          consent_confirmed?: boolean
          created_at?: string
          direction?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          phone_number?: string | null
          provider?: string
          recording_url?: string | null
          started_at?: string
          status?: string
          transcript?: string | null
          updated_at?: string
          user_id?: string | null
          vapi_call_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "support_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_messages: {
        Row: {
          attachments: Json | null
          case_id: string | null
          content: string
          created_at: string
          id: string
          message_type: string | null
          metadata: Json | null
          sender: string
          telegram_message_id: number | null
        }
        Insert: {
          attachments?: Json | null
          case_id?: string | null
          content: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          sender: string
          telegram_message_id?: number | null
        }
        Update: {
          attachments?: Json | null
          case_id?: string | null
          content?: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          sender?: string
          telegram_message_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "case_messages_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "support_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          cover_url: string | null
          created_at: string
          description_md: string
          id: string
          is_published: boolean
          key: string | null
          slug: string
          tier_required: number
          title: string
          updated_at: string
          visibility: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description_md?: string
          id?: string
          is_published?: boolean
          key?: string | null
          slug: string
          tier_required?: number
          title: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description_md?: string
          id?: string
          is_published?: boolean
          key?: string | null
          slug?: string
          tier_required?: number
          title?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          last_position_seconds: number | null
          lesson_id: string
          percent_complete: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          last_position_seconds?: number | null
          lesson_id: string
          percent_complete?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          last_position_seconds?: number | null
          lesson_id?: string
          percent_complete?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content_md: string | null
          content_text: string | null
          content_type: string
          content_url: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          is_free: boolean
          is_published: boolean
          module_id: string
          order_index: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content_md?: string | null
          content_text?: string | null
          content_type?: string
          content_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_free?: boolean
          is_published?: boolean
          module_id: string
          order_index?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content_md?: string | null
          content_text?: string | null
          content_type?: string
          content_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_free?: boolean
          is_published?: boolean
          module_id?: string
          order_index?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          id: string
          is_published: boolean
          order_index: number
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          is_published?: boolean
          order_index?: number
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          is_published?: boolean
          order_index?: number
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notices: {
        Row: {
          audience: string
          body_markdown: string
          created_at: string
          id: string
          is_published: boolean
          publish_at: string | null
          title: string
        }
        Insert: {
          audience?: string
          body_markdown: string
          created_at?: string
          id?: string
          is_published?: boolean
          publish_at?: string | null
          title: string
        }
        Update: {
          audience?: string
          body_markdown?: string
          created_at?: string
          id?: string
          is_published?: boolean
          publish_at?: string | null
          title?: string
        }
        Relationships: []
      }
      paid_call_bookings: {
        Row: {
          calendly_event_uri: string | null
          calendly_invitee_uri: string | null
          call_session_id: string | null
          created_at: string
          id: string
          meeting_link: string | null
          notes: string | null
          payment_status: string
          product_id: string
          scheduled_end: string | null
          scheduled_start: string | null
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calendly_event_uri?: string | null
          calendly_invitee_uri?: string | null
          call_session_id?: string | null
          created_at?: string
          id?: string
          meeting_link?: string | null
          notes?: string | null
          payment_status?: string
          product_id: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calendly_event_uri?: string | null
          calendly_invitee_uri?: string | null
          call_session_id?: string | null
          created_at?: string
          id?: string
          meeting_link?: string | null
          notes?: string | null
          payment_status?: string
          product_id?: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paid_call_bookings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "paid_call_products"
            referencedColumns: ["id"]
          },
        ]
      }
      paid_call_products: {
        Row: {
          active: boolean
          calendly_event_type_url: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          entitlement: string
          id: string
          name: string
          price_gbp: number
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          calendly_event_type_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes: number
          entitlement?: string
          id?: string
          name: string
          price_gbp: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          calendly_event_type_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          entitlement?: string
          id?: string
          name?: string
          price_gbp?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          provider: string
          provider_customer_id: string | null
          provider_subscription_id: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          tier_key: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          provider?: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tier_key: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          provider?: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tier_key?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_cases: {
        Row: {
          case_type: string | null
          channel: string | null
          created_at: string
          current_agent: string | null
          id: string
          priority: string | null
          status: string | null
          summary: string | null
          telegram_chat_id: number
          telegram_user_id: number
          telegram_username: string | null
          updated_at: string
          user_id: string | null
          vapi_call_id: string | null
        }
        Insert: {
          case_type?: string | null
          channel?: string | null
          created_at?: string
          current_agent?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          summary?: string | null
          telegram_chat_id: number
          telegram_user_id: number
          telegram_username?: string | null
          updated_at?: string
          user_id?: string | null
          vapi_call_id?: string | null
        }
        Update: {
          case_type?: string | null
          channel?: string | null
          created_at?: string
          current_agent?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          summary?: string | null
          telegram_chat_id?: number
          telegram_user_id?: number
          telegram_username?: string | null
          updated_at?: string
          user_id?: string | null
          vapi_call_id?: string | null
        }
        Relationships: []
      }
      telemetry: {
        Row: {
          case_id: string | null
          created_at: string
          event_key: string
          id: string
          level: string
          payload: Json | null
          source: string
          user_id: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          event_key: string
          id?: string
          level?: string
          payload?: Json | null
          source: string
          user_id?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string
          event_key?: string
          id?: string
          level?: string
          payload?: Json | null
          source?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "support_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_agreements: {
        Row: {
          accepted_at: string
          agreement_id: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string
          agreement_id: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string
          agreement_id?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_agreements_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "agreements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
          user_tier: number
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          user_tier?: number
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          user_tier?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_active_subscription: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "VISITOR"
        | "STUDENT_KEY_MASTER"
        | "GRADUATE_LEARNED_MASTER_BUILDER"
        | "AMBASSADOR"
        | "ADMIN"
        | "SUPER_ADMIN"
      subscription_status:
        | "TRIALING"
        | "ACTIVE"
        | "PAST_DUE"
        | "CANCELED"
        | "INCOMPLETE"
      subscription_tier:
        | "TIER_1_KEY_MASTER"
        | "TIER_2_LEARNED_MASTER_BUILDER"
        | "TIER_3_PRIVATE_MENTORSHIP"
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
        "VISITOR",
        "STUDENT_KEY_MASTER",
        "GRADUATE_LEARNED_MASTER_BUILDER",
        "AMBASSADOR",
        "ADMIN",
        "SUPER_ADMIN",
      ],
      subscription_status: [
        "TRIALING",
        "ACTIVE",
        "PAST_DUE",
        "CANCELED",
        "INCOMPLETE",
      ],
      subscription_tier: [
        "TIER_1_KEY_MASTER",
        "TIER_2_LEARNED_MASTER_BUILDER",
        "TIER_3_PRIVATE_MENTORSHIP",
      ],
    },
  },
} as const
