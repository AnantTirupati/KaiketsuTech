import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Reveal from '@/components/marketing/Reveal'
import KineticText from '@/components/marketing/KineticText'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Client engagements tracked through KaiketsuTech — public case studies as they ship.',
}

type ShowcaseProject = {
  id: string
  title: string
  description: string | null
  status: string | null
  showcase_image_url: string | null
  showcase_tags: string[] | null
}

async function fetchShowcaseProjects(): Promise<ShowcaseProject[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data } = await supabase
    .from('projects')
    .select('id, title, description, status, showcase_image_url, showcase_tags, created_at')
    .eq('is_showcase', true)
    .order('created_at', { ascending: false })

  return data || []
}

export default async function PortfolioPage() {
  const projects = await fetchShowcaseProjects()

  return (
    <>
      <section className="px-[6vw] pb-[8vh] pt-[12vh]">
        <Reveal>
          <div className="mb-3 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-accent">
            Portfolio
          </div>
          <KineticText
            as="h1"
            className="max-w-[18ch] font-marketing-sans text-[clamp(36px,6vw,64px)] font-bold leading-[1.02]"
            text="Client engagements, tracked as they ship."
          />
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-marketing-muted">
            This page pulls directly from our internal project system — it fills in as client work
            gets marked ready for public display. For work that&rsquo;s live today, see{' '}
            <Link href="/showcase" className="text-marketing-accent hover:underline">
              our work
            </Link>
            .
          </p>
        </Reveal>
      </section>

      <section className="border-t border-marketing-border px-[6vw] py-[8vh]">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal
                key={p.id}
                delay={i * 0.05}
                className="flex flex-col gap-4 border border-marketing-border bg-marketing-bg-raised p-7"
              >
                <h3 className="font-marketing-sans text-xl font-bold text-marketing-fg">{p.title}</h3>
                {p.description && (
                  <p className="text-[15px] leading-relaxed text-marketing-muted">{p.description}</p>
                )}
                {p.showcase_tags && p.showcase_tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {p.showcase_tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-marketing-border px-2.5 py-1 font-marketing-mono text-xs text-marketing-muted-dim"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="border border-dashed border-marketing-border p-16 text-center">
            <div className="mb-3 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-accent">
              Coming soon
            </div>
            <p className="mx-auto max-w-[48ch] text-marketing-muted">
              Nothing published here yet — client engagements get added as they&rsquo;re marked
              ready for public display. Check{' '}
              <Link href="/showcase" className="text-marketing-accent hover:underline">
                our work
              </Link>{' '}
              for what&rsquo;s live right now.
            </p>
          </Reveal>
        )}
      </section>
    </>
  )
}
