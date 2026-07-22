import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client (for API routes).
// Prefers the service-role key (bypasses RLS) when configured. The public contact
// form runs with the anon key against the "Allow anonymous insert" RLS policy, so we
// fall back to the anon key when no service-role key is present.
export function createServerClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
  return createClient(supabaseUrl, key)
}
