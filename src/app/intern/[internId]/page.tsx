import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import InternProfileClient from './InternProfileClient'

interface Props {
  params: Promise<{ internId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { internId } = await params
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const { data: intern } = await supabase
    .from('interns')
    .select('intern_id, department, profiles (full_name)')
    .eq('intern_id', internId)
    .maybeSingle()

  const profile = intern?.profiles as unknown as { full_name: string | null } | null
  const name = profile?.full_name || internId

  return {
    title: `${name} — KaiketsuTech Intern`,
    description: `View the profile and contributions of ${name}, a ${intern?.department || ''} intern at KaiketsuTech.`,
  }
}

async function fetchInternData(internId: string) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // Fetch intern with profile
  const { data: intern } = await supabase
    .from('interns')
    .select(`
      *,
      profiles (
        full_name,
        avatar_url,
        rating
      )
    `)
    .eq('intern_id', internId)
    .is('deleted_at', null)
    .maybeSingle()

  if (!intern) return null

  // Fetch project contributions
  const { data: contributions } = await supabase
    .from('project_contributors')
    .select(`
      role,
      contribution_summary,
      start_date,
      end_date,
      projects (
        id,
        title,
        description,
        status,
        showcase_tags
      )
    `)
    .eq('intern_id', intern.id)

  const formattedContributions = (contributions || []).map((c: any) => {
    const proj = Array.isArray(c.projects) ? c.projects[0] : c.projects
    return {
      role: c.role,
      contribution_summary: c.contribution_summary,
      start_date: c.start_date,
      end_date: c.end_date,
      projects: proj ? {
        id: proj.id,
        title: proj.title,
        description: proj.description,
        status: proj.status,
        showcase_tags: proj.showcase_tags
      } : null
    }
  })

  // Fetch certificates
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .eq('intern_id', intern.id)
    .eq('status', 'active')
    .order('issued_at', { ascending: false })

  return { intern, contributions: formattedContributions, certificates: certificates || [] }
}

export default async function InternProfilePage({ params }: Props) {
  const { internId } = await params

  if (!internId?.startsWith('KT-INT-')) {
    notFound()
  }

  const data = await fetchInternData(internId)
  if (!data) notFound()

  return <InternProfileClient data={data} />
}
