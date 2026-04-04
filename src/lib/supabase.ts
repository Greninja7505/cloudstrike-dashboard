import { createClient } from "@supabase/supabase-js";

// TODO: Replace with real Supabase credentials when Lovable Cloud is connected
const supabaseUrl = "https://placeholder.supabase.co";
const supabaseAnonKey = "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
