import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Reveal from '@/components/marketing/Reveal'
import MagneticButton from '@/components/marketing/MagneticButton'
import { marketingProjects } from '@/lib/marketing-projects'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return marketingProjects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = marketingProjects.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: project.name,
    description: project.oneLiner,
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const project = marketingProjects.find((p) => p.slug === slug)
  if (!project) notFound()

  return (
    <article className="px-[6vw] pb-[10vh] pt-[12vh]">
      <Link
        href="/showcase"
        className="font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim hover:text-marketing-accent"
      >
        ← All work
      </Link>

      <div className="mt-6 border border-marketing-border bg-marketing-bg-raised p-8 sm:p-10">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-accent">
            {project.category}
          </span>
          <span
            className={`font-marketing-mono text-xs uppercase tracking-[0.1em] ${
              project.status === 'Live' ? 'text-marketing-accent' : 'text-marketing-muted-dim'
            }`}
          >
            {project.status === 'Live' ? '● live' : '○ prototype — not yet production'}
          </span>
          <span className="font-marketing-mono text-xs text-marketing-muted-dim">{project.year}</span>
        </div>
        <h1 className="mt-4 max-w-[20ch] font-marketing-sans text-[clamp(36px,6vw,64px)] font-bold leading-[1.02] text-marketing-fg">
          {project.name}
        </h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-marketing-muted">{project.oneLiner}</p>
      </div>

      <Reveal delay={0.1} className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-4 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
            What it does
          </h2>
          <p className="text-[17px] leading-relaxed text-marketing-fg/90">{project.description}</p>

          <h2 className="mb-4 mt-10 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
            Highlights
          </h2>
          <ul className="flex flex-col gap-3">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-[15px] leading-relaxed text-marketing-muted">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-marketing-accent" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="mb-3 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
              Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-marketing-border px-3 py-1 font-marketing-mono text-xs text-marketing-muted-dim"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          {project.url && (
            <div>
              <h2 className="mb-3 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
                Live
              </h2>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-marketing-mono text-sm text-marketing-accent hover:underline"
              >
                {project.url.replace(/^https?:\/\//, '')} ↗
              </a>
            </div>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-20 border-t border-marketing-border pt-10">
        <p className="mb-6 text-marketing-muted">Want something built like this?</p>
        <MagneticButton href="/contact">Start a project</MagneticButton>
      </Reveal>
    </article>
  )
}
