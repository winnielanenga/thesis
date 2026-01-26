
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// NOTE: This client uses the Service Role Key, so it bypasses Row Level Security (RLS).
// It should ONLY be used in server-side contexts (API Routes, Server Components).
// Do NOT import this into Client Components.
export const supabase = createClient(supabaseUrl, supabaseKey)
