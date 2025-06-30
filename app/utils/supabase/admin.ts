
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: This client is for admin-level operations and should only be used in server-side code.
// It requires the SUPABASE_SERVICE_ROLE_KEY environment variable to be set.
export const createAdminClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase URL or service role key.')
  }

  return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
  );
}
