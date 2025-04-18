
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wpcstzjczfgbfwgzwktf.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwY3N0empjemZnYmZ3Z3p3a3RmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODQ0MzcxMywiZXhwIjoyMDE0MDE5NzEzfQ.Z7pg7RfW0WF_cNjqq1gpCuOD_mPGBwNHKHxmNfNXjjs";

// Create an extended client with admin privileges for special operations
export const extendedSupabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

