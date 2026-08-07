import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/marketing/Reveal'
import KineticText from '@/components/marketing/KineticText'

export const metadata: Metadata = {
  title: 'Careers | KaiketsuTech',
  description: 'Join KaiketsuTech and build production-grade enterprise software. Apply for frontend, backend, or full-stack developer intern roles.',
}

export default async function CareersPage() {
  const supabase = await createClient()

  const { data: openRoles } = await supabase
    .from('job_postings')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  return (
    <>
      <section className="px-[6vw] pb-[8vh] pt-[12vh]">
        <Reveal>
          <div className="mb-3 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-accent">
            Careers
          </div>
          <KineticText
            as="h1"
            className="max-w-[16ch] font-marketing-sans text-[clamp(36px,6vw,64px)] font-bold leading-[1.02]"
            text="Join the crew."
          />
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-marketing-muted">
            We&rsquo;re small on purpose and growing deliberately. We care about what you&rsquo;ve
            shipped, not what your resume says you know. Roles below are a starting point — if none
            fit but you can build, reach out anyway.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-marketing-border px-[6vw] py-[8vh]">
        {openRoles && openRoles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {openRoles.map((role, i) => (
              <Reveal
                key={role.id}
                delay={i * 0.06}
                className="flex flex-col gap-4 border border-marketing-border bg-marketing-bg-raised p-7 transition-colors hover:border-marketing-accent"
              >
                <div className="font-marketing-mono text-xs uppercase tracking-wider text-marketing-accent">
                  {role.track}
                </div>
                <div className="font-marketing-sans text-lg font-bold text-marketing-fg">{role.title}</div>
                <p className="flex-1 text-[15px] leading-relaxed text-marketing-muted">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  {role.requirements?.map((req: string) => (
                    <span
                      key={req}
                      className="rounded-full border border-marketing-border px-2.5 py-1 font-marketing-mono text-xs text-marketing-muted-dim"
                    >
                      {req}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/apply?role=${role.id}`}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-marketing-accent px-5 py-2.5 text-sm font-semibold text-marketing-accent-ink transition-colors hover:bg-marketing-fg"
                >
                  Apply for role →
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="border border-dashed border-marketing-border p-12 text-center">
            <p className="font-marketing-mono text-sm text-marketing-muted-dim">
              There are no open roles at this moment. Check back later!
            </p>
          </Reveal>
        )}
      </section>

      <section className="border-t border-marketing-border px-[6vw] py-[10vh]">
        <Reveal className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="border border-marketing-border bg-marketing-bg-raised p-8">
            <h2 className="mb-3 font-marketing-sans text-lg font-bold text-marketing-fg">
              Our engineering philosophy
            </h2>
            <p className="text-[15px] leading-relaxed text-marketing-muted">
              We don&rsquo;t write boilerplate. Every crew member gets real architectural ownership —
              shipping modular code and automated tests, from day one.
            </p>
          </div>
          <div className="border border-marketing-border bg-marketing-bg-raised p-8">
            <h2 className="mb-3 font-marketing-sans text-lg font-bold text-marketing-fg">
              General applications
            </h2>
            <p className="mb-4 text-[15px] leading-relaxed text-marketing-muted">
              Don&rsquo;t see a role that fits but want to build with us anyway? Send your resume and
              portfolio directly.
            </p>
            <a
              href="mailto:careers@kaiketsutech.online"
              className="font-marketing-mono text-sm text-marketing-accent hover:underline"
            >
              careers@kaiketsutech.online
            </a>
          </div>
        </Reveal>
      </section>
    </>
  )
}
