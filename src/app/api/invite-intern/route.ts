import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { email: rawEmail, fullName: rawFullName, applicationId } = await request.json()

    if (!rawEmail || !rawFullName || !applicationId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const email = String(rawEmail).trim().toLowerCase()
    const fullName = String(rawFullName).trim()

    // 1. Input Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 })
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(applicationId)) {
      return NextResponse.json({ error: 'Invalid applicationId format' }, { status: 400 })
    }

    if (fullName.length < 2 || fullName.length > 100) {
      return NextResponse.json({ error: 'Invalid full name length' }, { status: 400 })
    }

    // 2. Authenticate calling user using cookies context
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

    // 3. Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 4. Initialize Admin Supabase Client using Service Role Key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey || serviceRoleKey === 'placeholder-service-role-key') {
      console.error('Critical Error: SUPABASE_SERVICE_ROLE_KEY is not configured or is a placeholder in .env.local.')
      return NextResponse.json({ error: 'Internal server error: service role key missing' }, { status: 500 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Helper: promote existing user to intern consistently across auth and profiles
    const promoteExistingUserToIntern = async (existingUser: { id: string; user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> }) => {
      // 1. Update auth.users metadata
      const { error: updateAuthErr } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
        user_metadata: {
          ...existingUser.user_metadata,
          role: 'intern',
          full_name: fullName || (existingUser.user_metadata?.full_name as string)
        }
      })
      if (updateAuthErr) {
        console.error('Error updating auth metadata for existing user:', updateAuthErr)
        throw new Error(`Failed to update auth metadata: ${updateAuthErr.message}`)
      }

      // 2. Update public.profiles table
      const { error: profileErr } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: existingUser.id,
          email,
          role: 'intern',
          full_name: fullName || (existingUser.user_metadata?.full_name as string) || ''
        })
      if (profileErr) {
        console.error('Error updating profiles table for existing user:', profileErr)
        throw new Error(`Failed to update profile role: ${profileErr.message}`)
      }

      // 3. Update application status to approved
      const { error: appErr } = await supabaseAdmin
        .from('intern_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId)

      if (appErr) {
        console.error('Update application status error:', appErr)
      }

      const provider =
        (existingUser.app_metadata?.provider as string) ||
        (Array.isArray(existingUser.app_metadata?.providers) ? (existingUser.app_metadata.providers[0] as string) : null) ||
        'email'

      const isGoogle = provider === 'google'

      return {
        success: true,
        alreadyRegistered: true,
        emailSent: false,
        provider,
        message: isGoogle
          ? `Candidate already has an account via Google OAuth. Their role has been upgraded to Intern. They can sign in directly with Google (no invite email was needed).`
          : `Candidate already has an existing account. Their role has been upgraded to Intern. They can sign in directly using their existing account credentials.`
      }
    }

    // Check if user already exists in auth.users
    let existingUser = null
    const { data: listData, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    })

    if (!listErr && listData?.users) {
      existingUser = listData.users.find(u => u.email?.toLowerCase() === email)
    }

    if (existingUser) {
      const result = await promoteExistingUserToIntern(existingUser)
      return NextResponse.json(result)
    }

    // User is new: dispatch official Supabase Auth invitation email
    const { origin } = new URL(request.url)
    const redirectTo = `${origin}/auth/callback?next=/auth/update-password`

    const { data: inviteData, error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
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

      const isEmailExists =
        inviteErr.code === 'email_exists' ||
        inviteErr.status === 422 ||
        (inviteErr.message && inviteErr.message.toLowerCase().includes('already'))

      if (isEmailExists) {
        const { data: retryList } = await supabaseAdmin.auth.admin.listUsers()
        const retryUser = retryList?.users?.find(u => u.email?.toLowerCase() === email)
        if (retryUser) {
          const result = await promoteExistingUserToIntern(retryUser)
          return NextResponse.json(result)
        }
      }

      // If invite failed, do NOT update application status to approved
      return NextResponse.json({
        success: false,
        emailSent: false,
        error: inviteErr.message || 'User invitation email failed to send'
      }, { status: inviteErr.status || 500 })
    }

    // Invitation email was successfully confirmed sent by Supabase
    const invitedUser = inviteData?.user
    if (invitedUser) {
      await supabaseAdmin.from('profiles').upsert({
        id: invitedUser.id,
        email,
        role: 'intern',
        full_name: fullName
      })
    }

    // Synchronize application status to 'approved'
    const { error: appErr } = await supabaseAdmin
      .from('intern_applications')
      .update({ status: 'approved' })
      .eq('id', applicationId)

    if (appErr) {
      console.error('Update application status error:', appErr)
    }

    return NextResponse.json({
      success: true,
      alreadyRegistered: false,
      emailSent: true,
      message: `Invitation email successfully dispatched to ${email}.`,
      user: invitedUser
    })
  } catch (err: unknown) {
    console.error('Invite API catch error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
