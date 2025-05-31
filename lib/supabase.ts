import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "user" | "admin";
        };
        Update: {
          email?: string;
          full_name?: string | null;
          role?: "user" | "admin";
        };
      };
      stamp_spots: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          location: string | null;
          image_url: string | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          location?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_by?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          location?: string | null;
          image_url?: string | null;
          is_active?: boolean;
        };
      };
      daily_qr_codes: {
        Row: {
          id: string;
          spot_id: string;
          qr_code: string;
          valid_date: string;
          created_at: string;
        };
        Insert: {
          spot_id: string;
          qr_code: string;
          valid_date: string;
        };
        Update: {
          qr_code?: string;
        };
      };
      user_stamps: {
        Row: {
          id: string;
          user_id: string;
          spot_id: string;
          qr_code_id: string;
          collected_at: string;
        };
        Insert: {
          user_id: string;
          spot_id: string;
          qr_code_id: string;
        };
      };
    };
  };
};
