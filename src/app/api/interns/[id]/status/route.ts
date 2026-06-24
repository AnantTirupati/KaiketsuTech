import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, endDate } = body

    const validStatuses = ['active', 'completed', 'revoked', 'archived']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
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

    // Build update payload — never hard delete
    const updatePayload: Record<string, unknown> = { status }

    if (status === 'completed' || status === 'revoked') {
      updatePayload.end_date = endDate || new Date().toISOString().split('T')[0]
    }

    if (status === 'archived') {
      updatePayload.deleted_at = new Date().toISOString()
    }

    const { data: intern, error } = await supabase
      .from('interns')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Log audit
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: `intern.${status}`,
      target_type: 'intern',
      target_id: id,
      details: { new_status: status, end_date: updatePayload.end_date || null },
    })

    return NextResponse.json({ success: true, intern })
  } catch (err: unknown) {
    console.error('Update intern status error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
