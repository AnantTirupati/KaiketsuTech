import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard routes role-based
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/signin'
      return NextResponse.redirect(url)
    }

    // Check user profile role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'client'
    const path = request.nextUrl.pathname

    if (path.startsWith('/dashboard/admin') && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = `/dashboard/${role}`
      return NextResponse.redirect(url)
    }
    if (path.startsWith('/dashboard/client') && role !== 'client') {
      const url = request.nextUrl.clone()
      url.pathname = `/dashboard/${role}`
      return NextResponse.redirect(url)
    }
    if (path.startsWith('/dashboard/intern') && role !== 'intern') {
      const url = request.nextUrl.clone()
      url.pathname = `/dashboard/${role}`
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
