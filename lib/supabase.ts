import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      throw new Error('Supabase environment variables are not configured')
    }

    supabaseInstance = createClient(url, key)
  }
  return supabaseInstance
}

// Keep backward compat export — but this should only be called client-side
export const supabase = typeof window !== 'undefined' ? getSupabase() : null as any
