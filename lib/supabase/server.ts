// lib/supabase/server.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { parseCookies, setCookie, destroyCookie } from 'nookies'

export const createClient = (ctx?: any) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  const cookies = parseCookies(ctx)

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    cookies: {
      get(name) {
        return cookies[name]
      },
      set(name, value, options) {
        setCookie(ctx, name, value, options)
      },
      remove(name, options) {
        destroyCookie(ctx, name, options)
      },
    },
  })
}
