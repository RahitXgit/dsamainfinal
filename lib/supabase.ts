import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton pattern to prevent multiple instances during hot reloading
const globalForSupabase = globalThis as unknown as {
    supabase: ReturnType<typeof createSupabaseClient> | undefined
}

export const supabase = globalForSupabase.supabase ?? createSupabaseClient(supabaseUrl, supabaseAnonKey)

if (process.env.NODE_ENV !== 'production') {
    globalForSupabase.supabase = supabase
}

// Named export for client creation
export function createClient() {
    return supabase
}
