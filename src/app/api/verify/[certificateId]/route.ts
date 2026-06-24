import { createClient } from '@supabase/supabase-js'
import { NextResponse, NextRequest } from 'next/server'
import type { VerificationResult } from '@/types/intern.types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params

    if (!certificateId || !certificateId.startsWith('KT-')) {
      return NextResponse.json({ error: 'Invalid certificate ID format' }, { status: 400 })
    }

    // Use anon key for public access (RLS handles visibility)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch certificate with intern + profile data
    const { data: cert, error: certErr } = await supabase
      .from('certificates')
      .select(`
        *,
        interns (
          id,
          intern_id,
          department,
          start_date,
          end_date,
          status,
          bio,
          skills,
          github_url,
          linkedin_url,
          portfolio_url,
          profiles (
            full_name,
            avatar_url
          )
        )
      `)
      .eq('certificate_id', certificateId)
      .maybeSingle()

    if (certErr) throw certErr

    if (!cert) {
      const result: VerificationResult = {
        valid: false,
        status: 'not_found',
        certificate: null,
        intern: null,
        contributions: [],
      }
      return NextResponse.json(result)
    }

    // Check expiry
    const isExpired = cert.valid_until && new Date(cert.valid_until) < new Date()
    const isRevoked = cert.status === 'revoked'

    // Fetch project contributions for this intern
    const internData = cert.interns as unknown as {
      id: string
      intern_id: string
      department: string
      start_date: string
      end_date: string | null
      status: string
      bio: string | null
      skills: string[] | null
      github_url: string | null
      linkedin_url: string | null
      portfolio_url: string | null
      profiles: {
        full_name: string | null
        avatar_url: string | null
      } | null
    }

    let contributions: VerificationResult['contributions'] = []
    if (internData) {
      const { data: contribs } = await supabase
        .from('project_contributors')
        .select(`
          role,
          contribution_summary,
          projects (title)
        `)
        .eq('intern_id', internData.id)

      contributions = (contribs || []).map((c: Record<string, unknown>) => {
        const project = c.projects as { title: string } | null
        return {
          project_title: project?.title || 'Unknown Project',
          role: c.role as string,
          contribution_summary: c.contribution_summary as string | null,
        }
      })
    }

    const result: VerificationResult = {
      valid: !isRevoked && !isExpired,
      status: isRevoked ? 'revoked' : isExpired ? 'expired' : 'active',
      certificate: {
        certificate_id: cert.certificate_id,
        title: cert.title,
        description: cert.description,
        issued_at: cert.issued_at || cert.created_at || '',
        valid_until: cert.valid_until,
        qr_code_url: cert.qr_code_url,
        revoked_at: cert.revoked_at,
        revoked_reason: cert.revoked_reason,
      },
      intern: internData ? {
        intern_id: internData.intern_id,
        name: internData.profiles?.full_name || null,
        department: internData.department,
        bio: internData.bio,
        skills: internData.skills,
        avatar_url: internData.profiles?.avatar_url || null,
        start_date: internData.start_date,
        end_date: internData.end_date,
        github_url: internData.github_url,
        linkedin_url: internData.linkedin_url,
        portfolio_url: internData.portfolio_url,
      } : null,
      contributions,
    }

    // Log verification (fire-and-forget)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    supabase.from('verification_logs').insert({
      certificate_id: cert.id,
      ip_address: ip,
      user_agent: userAgent,
    }).then(() => {})

    return NextResponse.json(result)
  } catch (err: unknown) {
    console.error('Verify certificate error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
