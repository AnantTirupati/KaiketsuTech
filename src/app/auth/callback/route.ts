import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const cookiesToSetLater: Array<{ name: string; value: string; options: any }> = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                // Set cookies for current request's server operations
                cookieStore.set(name, value, options)
                // Accumulate to write into the final redirect Response
                cookiesToSetLater.push({ name, value, options })
              })
            } catch {
              // Ignore cookie setting errors inside server handlers
            }
          },
        },
      }
    )
    
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      const queryRole = searchParams.get('role')
      
      // Check user role in public.profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()
      
      let role = profile?.role || 'client'
      
      // Only allow upgrading client -> intern during registration, never demote admin or intern
      if (role === 'client' && queryRole === 'intern') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'intern' })
          .eq('id', data.user.id)
        
        if (!updateError) {
          role = 'intern'
        }
      }

      const next = searchParams.get('next')
      const redirectUrl = next ? `${origin}${next}` : `${origin}/dashboard/${role}`

      // Create the redirect response object
      const redirectResponse = NextResponse.redirect(redirectUrl)

      // Attach the accumulated session cookies to the redirect response headers
      cookiesToSetLater.forEach(({ name, value, options }) => {
        redirectResponse.cookies.set(name, value, options)
      })

      return redirectResponse
    }
  }

  // Fallback if auth fails
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
