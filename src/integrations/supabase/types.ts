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
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          body: string
          created_at: string
          ends_at: string | null
          id: string
          is_active: boolean | null
          starts_at: string | null
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string | null
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string | null
          title?: string
        }
        Relationships: []
      }
      bible_audio: {
        Row: {
          book_slug: string
          chapter_number: number
          created_at: string | null
          id: string
          r2_key: string
        }
        Insert: {
          book_slug: string
          chapter_number: number
          created_at?: string | null
          id?: string
          r2_key: string
        }
        Update: {
          book_slug?: string
          chapter_number?: number
          created_at?: string | null
          id?: string
          r2_key?: string
        }
        Relationships: []
      }
      bible_books: {
        Row: {
          book_name: string
          book_order: number
          book_slug: string
          cover_image: string | null
          id: string
          testament: string
        }
        Insert: {
          book_name: string
          book_order: number
          book_slug: string
          cover_image?: string | null
          id?: string
          testament: string
        }
        Update: {
          book_name?: string
          book_order?: number
          book_slug?: string
          cover_image?: string | null
          id?: string
          testament?: string
        }
        Relationships: []
      }
      bible_promises: {
        Row: {
          created_at: string | null
          day_of_year: number
          id: string
          kjv_verse: string
          scripture_ref: string
        }
        Insert: {
          created_at?: string | null
          day_of_year: number
          id?: string
          kjv_verse: string
          scripture_ref: string
        }
        Update: {
          created_at?: string | null
          day_of_year?: number
          id?: string
          kjv_verse?: string
          scripture_ref?: string
        }
        Relationships: []
      }
      bible_verses: {
        Row: {
          book_slug: string
          chapter: number
          created_at: string | null
          id: string
          text: string
          verse: number
        }
        Insert: {
          book_slug: string
          chapter: number
          created_at?: string | null
          id?: string
          text: string
          verse: number
        }
        Update: {
          book_slug?: string
          chapter?: number
          created_at?: string | null
          id?: string
          text?: string
          verse?: number
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          auto_reply_sent: boolean | null
          consent_publish: boolean | null
          contact_type: string
          created_at: string
          email: string
          forwarded: boolean | null
          id: string
          message: string
          name: string
        }
        Insert: {
          auto_reply_sent?: boolean | null
          consent_publish?: boolean | null
          contact_type: string
          created_at?: string
          email: string
          forwarded?: boolean | null
          id?: string
          message: string
          name: string
        }
        Update: {
          auto_reply_sent?: boolean | null
          consent_publish?: boolean | null
          contact_type?: string
          created_at?: string
          email?: string
          forwarded?: boolean | null
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      devotional_books: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      devotional_entries: {
        Row: {
          book_id: string
          content: string
          created_at: string | null
          day: number
          id: string
          month: number
          scripture_ref: string | null
          scripture_text: string | null
          title: string | null
        }
        Insert: {
          book_id: string
          content: string
          created_at?: string | null
          day: number
          id?: string
          month: number
          scripture_ref?: string | null
          scripture_text?: string | null
          title?: string | null
        }
        Update: {
          book_id?: string
          content?: string
          created_at?: string | null
          day?: number
          id?: string
          month?: number
          scripture_ref?: string | null
          scripture_text?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devotional_entries_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "devotional_books"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_qr_codes: {
        Row: {
          account_name: string | null
          account_number: string | null
          created_at: string | null
          display_order: number | null
          id: string
          instructions: string | null
          is_active: boolean | null
          method_group: string
          provider_name: string
          qr_image_url: string
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          method_group: string
          provider_name: string
          qr_image_url: string
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          method_group?: string
          provider_name?: string
          qr_image_url?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          ack_email_sent: boolean | null
          confirm_email_sent: boolean | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          method: string
          notes: string | null
          phone: string | null
          status: string
        }
        Insert: {
          ack_email_sent?: boolean | null
          confirm_email_sent?: boolean | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          method: string
          notes?: string | null
          phone?: string | null
          status?: string
        }
        Update: {
          ack_email_sent?: boolean | null
          confirm_email_sent?: boolean | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          method?: string
          notes?: string | null
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      egw_audio: {
        Row: {
          book_abbr: string
          chapter_number: number
          chapter_title: string | null
          created_at: string | null
          id: string
          r2_key: string
        }
        Insert: {
          book_abbr: string
          chapter_number: number
          chapter_title?: string | null
          created_at?: string | null
          id?: string
          r2_key: string
        }
        Update: {
          book_abbr?: string
          chapter_number?: number
          chapter_title?: string | null
          created_at?: string | null
          id?: string
          r2_key?: string
        }
        Relationships: []
      }
      egw_books: {
        Row: {
          book_abbr: string
          book_title: string
          cover_image: string | null
          created_at: string | null
          description: string | null
          has_audio: boolean | null
          id: string
          is_active: boolean | null
          sort_order: number | null
        }
        Insert: {
          book_abbr: string
          book_title: string
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          has_audio?: boolean | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
        }
        Update: {
          book_abbr?: string
          book_title?: string
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          has_audio?: boolean | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
        }
        Relationships: []
      }
      egw_chapters: {
        Row: {
          book_abbr: string
          chapter_number: number
          chapter_title: string | null
          content: string
          created_at: string | null
          id: string
          r2_key: string | null
        }
        Insert: {
          book_abbr: string
          chapter_number: number
          chapter_title?: string | null
          content: string
          created_at?: string | null
          id?: string
          r2_key?: string | null
        }
        Update: {
          book_abbr?: string
          chapter_number?: number
          chapter_title?: string | null
          content?: string
          created_at?: string | null
          id?: string
          r2_key?: string | null
        }
        Relationships: []
      }
      featured_home_content: {
        Row: {
          content: string
          id: string
          is_active: boolean | null
          section: string
          updated_at: string | null
        }
        Insert: {
          content: string
          id?: string
          is_active?: boolean | null
          section: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          id?: string
          is_active?: boolean | null
          section?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hymns: {
        Row: {
          created_at: string | null
          has_chorus: boolean
          hymn_number: number
          id: string
          lyrics: Json
          r2_key: string
          title: string
        }
        Insert: {
          created_at?: string | null
          has_chorus?: boolean
          hymn_number: number
          id?: string
          lyrics?: Json
          r2_key: string
          title: string
        }
        Update: {
          created_at?: string | null
          has_chorus?: boolean
          hymn_number?: number
          id?: string
          lyrics?: Json
          r2_key?: string
          title?: string
        }
        Relationships: []
      }
      promise_seeds: {
        Row: {
          id: string
          seed: number
          year: number
        }
        Insert: {
          id?: string
          seed: number
          year: number
        }
        Update: {
          id?: string
          seed?: number
          year?: number
        }
        Relationships: []
      }
      rate_limit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_hash: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_hash: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_hash?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          message: string
          name: string
          rating: number | null
          status: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          message: string
          name: string
          rating?: number | null
          status?: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string
          name?: string
          rating?: number | null
          status?: string
        }
        Relationships: []
      }
      scripture_songs: {
        Row: {
          created_at: string | null
          id: string
          lyrics: Json
          r2_key: string
          song_number: number
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lyrics?: Json
          r2_key: string
          song_number: number
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lyrics?: Json
          r2_key?: string
          song_number?: number
          title?: string
        }
        Relationships: []
      }
      testimonies: {
        Row: {
          consent_given: boolean | null
          created_at: string | null
          email: string | null
          id: string
          message: string
          name: string
          source: string | null
          status: string
        }
        Insert: {
          consent_given?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          message: string
          name: string
          source?: string | null
          status?: string
        }
        Update: {
          consent_given?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string
          name?: string
          source?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
    Enums: {},
  },
} as const
