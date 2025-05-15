import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rjjeakakhknlfrxxevbg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqamVha2FraGtubGZyeHhldmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NzkwNDgsImV4cCI6MjA2MDQ1NTA0OH0.ja1K56kztZlwNu-chyO4JH4KrkUocIppVxbEG_wE_Kk";

export const supabase = createClient(supabaseUrl, supabaseKey);