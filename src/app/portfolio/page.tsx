import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import PortfolioClient from './PortfolioClient'

export const metadata: Metadata = {
  title: 'Portfolio | KaiketsuTech',
  description: 'Precision engineering for digital leaders. We build resilient, scalable architectures that drive measurable business impact.',
}

async function fetchShowcaseProjects() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      description,
      status,
      showcase_image_url,
      showcase_tags,
      created_at
    `)
    .eq('is_showcase', true)
    .order('created_at', { ascending: false })

  return projects || []
}

export default async function PortfolioPage() {
  const dbProjects = await fetchShowcaseProjects()
  return <PortfolioClient dbProjects={dbProjects} />
}
