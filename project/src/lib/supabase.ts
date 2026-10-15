import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AppEntry {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  icon_url: string | null;
  platform: string;
  category: string | null;
  version: string | null;
  file_size: string | null;
  app_url: string | null;
  is_embeddable: boolean;
  download_count: number;
  release_date: string | null;
  created_at: string;
}
