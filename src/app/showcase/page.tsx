import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import ShowcaseClient from './ShowcaseClient'

export const metadata: Metadata = {
  title: 'Project Showcase',
  description: 'Explore the projects built by KaiketsuTech — featuring contributor credits and real-world impact.',
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
      created_at,
      project_contributors (
        role,
        interns (
          intern_id,
          profiles (
            full_name,
            avatar_url
          )
        )
      )
    `)
    .eq('is_showcase', true)
    .order('created_at', { ascending: false })

  const formattedProjects = (projects || []).map((project: any) => {
    const formattedContributors = (project.project_contributors || []).map((c: any) => {
      const intern = Array.isArray(c.interns) ? c.interns[0] : c.interns
      const profile = intern ? (Array.isArray(intern.profiles) ? intern.profiles[0] : intern.profiles) : null

      return {
        role: c.role,
        interns: intern ? {
          intern_id: intern.intern_id,
          profiles: profile ? {
            full_name: profile.full_name,
            avatar_url: profile.avatar_url
          } : null
        } : null
      }
    })

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      status: project.status,
      showcase_image_url: project.showcase_image_url,
      showcase_tags: project.showcase_tags,
      created_at: project.created_at,
      project_contributors: formattedContributors
    }
  })

  return formattedProjects
}

export default async function ShowcasePage() {
  const projects = await fetchShowcaseProjects()
  return <ShowcaseClient projects={projects} />
}
