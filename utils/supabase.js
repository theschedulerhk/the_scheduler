import { createClient } from '@supabase/supabase-js';

// Replace with your actual project keys from your Supabase dashboard settings
const SUPABASE_URL = "https://dipefqpepuiemvcyvaya.supabase.co/";
const SUPABASE_ANON_KEY = "sb_publishable_wWCPZt3H78e9FbPyVQLWfA__c2LjvB6";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
