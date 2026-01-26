import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set. Using fallback client.')
}

// Singleton pattern to prevent multiple instances during hot reloading
const globalForSupabase = globalThis as unknown as {
    supabase: ReturnType<typeof createSupabaseClient> | undefined
}

// Only create client if we have valid credentials
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? (globalForSupabase.supabase ?? createSupabaseClient(supabaseUrl, supabaseAnonKey))
    : null as any

if (process.env.NODE_ENV !== 'production' && supabase) {
    globalForSupabase.supabase = supabase
}

// Named export for client creation
export function createClient() {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and Anon Key must be provided')
    }
    return supabase
}
