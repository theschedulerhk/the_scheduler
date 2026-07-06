import { createClient } from '@supabase/supabase-js';

// Replace with your actual project keys from your Supabase dashboard settings
const SUPABASE_URL = "https://supabase.co";
const SUPABASE_ANON_KEY = "your-anon-public-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
