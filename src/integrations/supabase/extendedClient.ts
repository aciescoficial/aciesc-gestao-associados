
import { supabase } from "./client";
import { ExtendedDatabase } from "@/types/database";

// Extended supabase client with typed tables
export const extendedSupabase = supabase as unknown as ReturnType<typeof createExtendedClient<ExtendedDatabase>>;

// This is a type helper function, not meant to be called
function createExtendedClient<T>() {
  return supabase as any;
}
