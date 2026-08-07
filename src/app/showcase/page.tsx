import type { Metadata } from 'next'
import Reveal from '@/components/marketing/Reveal'
import KineticText from '@/components/marketing/KineticText'
import { marketingProjects } from '@/lib/marketing-projects'

export const metadata: Metadata = {
  title: 'Work | KaiketsuTech',
  description: 'Real sites, real clients — the work KaiketsuTech has actually shipped.',
}

export default function ShowcasePage() {
  return (
    <>
      <section className="px-[6vw] pb-[8vh] pt-[12vh]">
        <Reveal>
          <div className="mb-3 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-accent">
            Work
          </div>
          <KineticText
            as="h1"
            className="max-w-[18ch] font-marketing-sans text-[clamp(36px,6vw,64px)] font-bold leading-[1.02]"
            text="Real sites, real clients, one prototype worth bragging about."
          />
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-marketing-muted">
            Every project here is either live at a real URL or a working prototype with an honest
            status label. Nothing on this page is a mockup.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-marketing-border px-[6vw] py-[8vh]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {marketingProjects.map((project, i) => (
            <Reveal
              key={project.slug}
              delay={i * 0.05}
              className="flex flex-col gap-5 border border-marketing-border bg-marketing-bg-raised p-7 transition-colors hover:border-marketing-accent"
            >
              <div className="flex items-center justify-between">
                <span className="font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
                  {project.category}
                </span>
                <span
                  className={`font-marketing-mono text-xs uppercase tracking-[0.1em] ${
                    project.status === 'Live' ? 'text-marketing-accent' : 'text-marketing-muted-dim'
                  }`}
                >
                  {project.status === 'Live' ? '● live' : '○ prototype'}
                </span>
              </div>

              <div>
                <h3 className="font-marketing-sans text-2xl font-bold leading-tight text-marketing-fg">
                  {project.name}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-marketing-muted">{project.oneLiner}</p>
              </div>

              <p className="text-sm leading-relaxed text-marketing-muted-dim">{project.description}</p>

              <ul className="flex flex-col gap-2">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-[13px] leading-relaxed text-marketing-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-marketing-accent" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-marketing-border px-2.5 py-1 font-marketing-mono text-xs text-marketing-muted-dim"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto font-marketing-mono text-xs uppercase tracking-[0.1em] text-marketing-muted-dim transition-colors hover:text-marketing-accent"
                >
                  {project.url.replace(/^https?:\/\//, '')} ↗
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
