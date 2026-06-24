import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateInternId } from '@/lib/certificate-utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { profileId, department, startDate, bio, skills, github_url, linkedin_url, portfolio_url } = body

    if (!profileId || !department) {
      return NextResponse.json({ error: 'profileId and department are required' }, { status: 400 })
    }

    // Validate department
    const validDepartments = ['engineering', 'design', 'marketing', 'operations']
    if (!validDepartments.includes(department)) {
      return NextResponse.json({ error: 'Invalid department' }, { status: 400 })
    }

    // Authenticate & authorize
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Check if intern record already exists for this profile
    const { data: existing } = await supabase.from('interns').select('id').eq('profile_id', profileId).maybeSingle()
    if (existing) {
      return NextResponse.json({ error: 'Intern record already exists for this profile' }, { status: 409 })
    }

    // Generate intern ID based on current count
    const { count } = await supabase.from('interns').select('*', { count: 'exact', head: true })
    const internId = generateInternId((count || 0) + 1)

    // Insert intern record
    const { data: intern, error: internErr } = await supabase.from('interns').insert({
      profile_id: profileId,
      intern_id: internId,
      department,
      start_date: startDate || new Date().toISOString().split('T')[0],
      bio: bio || null,
      skills: skills || [],
      github_url: github_url || null,
      linkedin_url: linkedin_url || null,
      portfolio_url: portfolio_url || null,
    }).select().single()

    if (internErr) throw internErr

    // Log audit
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'intern.create',
      target_type: 'intern',
      target_id: intern.id,
      details: { intern_id: internId, department, profile_id: profileId },
    })

    return NextResponse.json({ success: true, intern })
  } catch (err: unknown) {
    console.error('Create intern error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
