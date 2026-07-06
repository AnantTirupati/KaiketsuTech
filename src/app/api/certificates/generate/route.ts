import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateCertificateId, generateQRCodeDataUri } from '@/lib/certificate-utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { internId, title, description, validUntil } = body

    if (!internId || !title) {
      return NextResponse.json({ error: 'internId and title are required' }, { status: 400 })
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

    // Verify intern exists
    const { data: intern } = await supabase.from('interns').select('id, intern_id, status').eq('id', internId).single()
    if (!intern) return NextResponse.json({ error: 'Intern not found' }, { status: 404 })

    // Generate unique certificate ID (retry if collision)
    let certId = generateCertificateId()
    let retries = 0
    while (retries < 5) {
      const { data: existing } = await supabase
        .from('certificates')
        .select('id')
        .eq('certificate_id', certId)
        .maybeSingle()
      if (!existing) break
      certId = generateCertificateId()
      retries++
    }

    // Generate QR code (using dynamic request origin to avoid localhost issues on other devices)
    const requestUrl = new URL(request.url)
    const siteUrl = requestUrl.origin
    const qrCodeUrl = await generateQRCodeDataUri(certId, siteUrl)

    // Insert certificate
    const { data: certificate, error: certErr } = await supabase.from('certificates').insert({
      intern_id: internId,
      certificate_id: certId,
      title,
      description: description || null,
      valid_until: validUntil || null,
      qr_code_url: qrCodeUrl,
      status: 'active',
    }).select().single()

    if (certErr) throw certErr

    // Log audit
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'certificate.generate',
      target_type: 'certificate',
      target_id: certificate.id,
      details: { certificate_id: certId, intern_id: intern.intern_id, title },
    })

    return NextResponse.json({ success: true, certificate })
  } catch (err: unknown) {
    console.error('Generate certificate error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
