import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/marketing/Reveal'
import KineticText from '@/components/marketing/KineticText'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Web development, custom software, AI-driven solutions, and the MLOps/DevOps foundation to run them reliably.',
}

const capabilities = [
  {
    title: 'Web Development',
    description:
      'High-performance web applications built on modern frameworks — optimized for speed, and built to actually stay maintainable.',
    href: '/contact?subject=software',
  },
  {
    title: 'Custom Software & MVPs',
    description:
      'Full applications beyond a templated site — multi-role platforms, internal tools, and first versions built to validate an idea fast.',
    href: '/contact?subject=software',
  },
  {
    title: 'AI-Driven Solutions',
    description:
      'Assistants grounded in your own data, and custom model features bolted onto existing products — built on established APIs, not hype.',
    href: '/contact?subject=software',
  },
  {
    title: 'MLOps & Infrastructure',
    description:
      'Model registries, versioned pipelines, and drift monitoring for ML systems that need to keep working after the demo.',
    href: '/contact?subject=infrastructure',
  },
  {
    title: 'DevOps & Cloud',
    description:
      'CI/CD ownership, infrastructure-as-code, and cloud cost review — the operational discipline behind a system that doesn’t page you at 2am.',
    href: '/contact?subject=infrastructure',
  },
  {
    title: 'Technical Consulting',
    description:
      'Architecture review and technical due diligence for teams that need a second, independent set of eyes before they commit.',
    href: '/contact?subject=consulting',
  },
]

export default function Services() {
  return (
    <>
      <section className="px-[6vw] pb-[8vh] pt-[12vh]">
        <Reveal>
          <div className="mb-3 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-accent">
            Services
          </div>
          <KineticText
            as="h1"
            className="max-w-[18ch] font-marketing-sans text-[clamp(36px,6vw,64px)] font-bold leading-[1.02]"
            text="Precision engineered solutions."
          />
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-marketing-muted">
            From a five-page website to the MLOps foundation running a production model — scoped and
            built by the people who&rsquo;ll actually maintain it.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-marketing-border px-[6vw] py-[8vh]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap, i) => (
            <Reveal
              key={cap.title}
              delay={i * 0.05}
              className="flex flex-col justify-between gap-6 border border-marketing-border bg-marketing-bg-raised p-7 transition-colors hover:border-marketing-accent"
            >
              <div>
                <h3 className="mb-3 font-marketing-sans text-lg font-bold text-marketing-fg">{cap.title}</h3>
                <p className="text-[15px] leading-relaxed text-marketing-muted">{cap.description}</p>
              </div>
              <Link
                href={cap.href}
                className="font-marketing-mono text-xs uppercase tracking-[0.1em] text-marketing-muted-dim transition-colors hover:text-marketing-accent"
              >
                View details →
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-marketing-border px-[6vw] py-[10vh]">
        <Reveal>
          <h2 className="max-w-[18ch] font-marketing-sans text-[clamp(28px,4.5vw,48px)] font-bold text-marketing-fg">
            See what these actually cost.
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/pricing"
              className="rounded-full bg-marketing-accent px-7 py-3.5 text-sm font-semibold text-marketing-accent-ink transition-colors hover:bg-marketing-fg"
            >
              View pricing
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-marketing-border px-7 py-3.5 text-sm font-semibold text-marketing-fg transition-colors hover:border-marketing-accent"
            >
              Talk to us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
