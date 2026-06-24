import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { certificateId, reason } = body

    if (!certificateId || !reason) {
      return NextResponse.json({ error: 'certificateId and reason are required' }, { status: 400 })
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

    // Update certificate status
    const { data: certificate, error } = await supabase
      .from('certificates')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoked_reason: reason,
      })
      .eq('certificate_id', certificateId)
      .select()
      .single()

    if (error) throw error

    // Log audit
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'certificate.revoke',
      target_type: 'certificate',
      target_id: certificate.id,
      details: { certificate_id: certificateId, reason },
    })

    return NextResponse.json({ success: true, certificate })
  } catch (err: unknown) {
    console.error('Revoke certificate error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
