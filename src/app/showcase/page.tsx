import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/marketing/Reveal'
import KineticText from '@/components/marketing/KineticText'
import { marketingProjects } from '@/lib/marketing-projects'

export const metadata: Metadata = {
  title: 'Work',
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {marketingProjects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.05}>
              <Link href={`/showcase/${project.slug}`} className="group block h-full">
                <div className="flex h-full flex-col justify-between gap-6 border border-marketing-border bg-marketing-bg-raised p-7 transition-colors group-hover:border-marketing-accent">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
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
                    <h3 className="font-marketing-sans text-2xl font-bold leading-tight text-marketing-fg">
                      {project.name}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-marketing-muted">{project.oneLiner}</p>
                  </div>
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
                  <div className="font-marketing-mono text-xs uppercase tracking-[0.1em] text-marketing-muted-dim transition-colors group-hover:text-marketing-accent">
                    View case study →
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
