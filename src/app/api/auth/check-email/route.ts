import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey || serviceRoleKey === 'placeholder-service-role-key') {
      console.error('Critical Error: SUPABASE_SERVICE_ROLE_KEY is not configured.')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Initialize admin client to bypass client RLS policies
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    )

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (error) {
      console.error('Database query error in check-email:', error)
      return NextResponse.json({ error: 'Database check failed' }, { status: 500 })
    }

    return NextResponse.json({ exists: !!profile })
  } catch (err) {
    console.error('check-email API route error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
