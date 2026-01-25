
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === "development") {
        console.warn("⚠️  Missing Supabase Environment Variables! Check .env.local");
    }
    // throw new Error("Missing Supabase URL or Anon Key"); // Don't crash hard in Dev UI if possible, or handle gracefully
}

// Ensure we don't crash the client-side build if types are checked statically
export const supabase = createClient(supabaseUrl || "", supabaseKey || "");
