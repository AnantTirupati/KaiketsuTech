import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { email, fullName, applicationId } = await request.json()

    if (!email || !fullName || !applicationId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // 1. Authenticate calling user using cookies context
    const cookieStore = await cookies()
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
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignore cookie setting errors inside server handlers
            }
          },
        },
      }
    )

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 3. Initialize Admin Supabase Client using Service Role Key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey || serviceRoleKey === 'placeholder-service-role-key') {
      return NextResponse.json({ 
        error: 'SUPABASE_SERVICE_ROLE_KEY is not configured or is a placeholder in .env.local. Please set the real secret key.' 
      }, { status: 500 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    )

    const { origin } = new URL(request.url)
    const redirectTo = `${origin}/auth/callback?next=/auth/update-password`
    
    const { data, error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email.trim(),
      {
        redirectTo,
        data: {
          role: 'intern',
          full_name: fullName
        }
      }
    )

    if (inviteErr) {
      console.error('Invite error:', inviteErr)
      return NextResponse.json({ error: `Invite failed: ${inviteErr.message}` }, { status: 500 })
    }

    // 5. Update intern application status to 'approved' in the database
    const { error: appErr } = await supabase
      .from('intern_applications')
      .update({ status: 'approved' })
      .eq('id', applicationId)

    if (appErr) {
      console.error('Update application status error:', appErr)
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (err: any) {
    console.error('Invite API catch error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
