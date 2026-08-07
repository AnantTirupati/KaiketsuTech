import Link from "next/link";
import type { Metadata } from "next";
import MagneticButton from "@/components/marketing/MagneticButton";
import KineticText from "@/components/marketing/KineticText";
import Marquee from "@/components/marketing/Marquee";
import Reveal from "@/components/marketing/Reveal";
import ResolveSceneClient from "@/components/marketing/ResolveSceneClient";
import { marketingProjects } from "@/lib/marketing-projects";

export const metadata: Metadata = {
  title: "KaiketsuTech — a crew of student builders, open for hire",
  description:
    "KaiketsuTech (解決) means 'solution.' A crew of student developers shipping real client work in web, mobile, and AI — and recruiting the next builders as we grow.",
};

const capabilities = [
  "Web Development",
  "Mobile Apps",
  "AI / ML",
  "Security Research",
  "Cloud & Infra",
  "Freelance Ops",
];

const approach = [
  {
    n: "01",
    title: "We build it real",
    desc: "Every project on this site is either live at a real URL or a working prototype with an honest status label. Nothing here is a mockup.",
  },
  {
    n: "02",
    title: "We break it on purpose",
    desc: "Before anything ships, we try to defeat our own assumptions — the way AirGated's own threat model got tested with live impersonation attempts.",
  },
  {
    n: "03",
    title: "We say what's not done",
    desc: "Prototype means prototype. We label status honestly instead of dressing up in-progress work as finished product.",
  },
];

export default function Home() {
  const featured = marketingProjects.slice(0, 3);

  return (
    <>
      <section className="grid grid-cols-1 gap-10 px-[6vw] pb-[10vh] pt-[12vh] lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-4">
        <div>
          <Reveal className="flex items-center gap-2.5 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-marketing-accent" />
            A student crew, open for hire and open for talent
          </Reveal>
          <KineticText
            as="h1"
            delay={0.05}
            className="mt-6 max-w-[16ch] text-balance font-marketing-sans text-[clamp(40px,7.5vw,96px)] font-bold leading-[0.98]"
            text="Kaiketsu means solution. That's the job."
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-marketing-muted">
              We&rsquo;re a crew of student developers shipping real client work — web, mobile, AI,
              and security research — while we build out the next generation of the team.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-4">
            <MagneticButton href="/contact">Start a project</MagneticButton>
            <MagneticButton href="/showcase" variant="outline">
              See the work
            </MagneticButton>
          </Reveal>
        </div>

        {/* Resolves from scattered to clean form the moment the terminal intro
            finishes — the visual echo of "kaiketsu = resolve." Fixed height box
            so the canvas never causes layout shift; hidden below sm since a
            WebGL scene isn't worth the battery on small screens crammed next
            to hero text. */}
        <div className="hidden h-[340px] w-full sm:block lg:h-[440px]">
          <ResolveSceneClient />
        </div>
      </section>

      <Marquee items={capabilities} />

      <section className="border-b border-marketing-border px-[6vw] py-[10vh]">
        <Reveal className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="mb-3 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-accent">
              Work
            </div>
            <h2 className="max-w-[16ch] font-marketing-sans text-[clamp(28px,4vw,44px)] font-bold text-marketing-fg">
              Real sites, real clients, one prototype worth bragging about.
            </h2>
          </div>
          <Link
            href="/showcase"
            className="hidden shrink-0 font-marketing-mono text-sm text-marketing-muted-dim hover:text-marketing-accent sm:block"
          >
            All work →
          </Link>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <Link href="/showcase" className="group block h-full">
                <div className="flex h-full flex-col justify-between gap-6 border border-marketing-border bg-marketing-bg-raised p-7 transition-colors group-hover:border-marketing-accent">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
                        {p.category}
                      </span>
                      <span
                        className={`font-marketing-mono text-xs uppercase tracking-[0.1em] ${
                          p.status === "Live" ? "text-marketing-accent" : "text-marketing-muted-dim"
                        }`}
                      >
                        {p.status === "Live" ? "● live" : "○ prototype"}
                      </span>
                    </div>
                    <h3 className="font-marketing-sans text-2xl font-bold leading-tight text-marketing-fg">
                      {p.name}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-marketing-muted">{p.oneLiner}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-marketing-border px-2.5 py-1 font-marketing-mono text-xs text-marketing-muted-dim"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="font-marketing-mono text-xs uppercase tracking-[0.1em] text-marketing-muted-dim transition-colors group-hover:text-marketing-accent">
                    See all work →
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-b border-marketing-border px-[6vw] py-[10vh]">
        <Reveal className="mb-12">
          <div className="mb-3 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-accent">
            How we work
          </div>
          <h2 className="max-w-[20ch] font-marketing-sans text-[clamp(28px,4vw,44px)] font-bold text-marketing-fg">
            Three rules, no exceptions.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {approach.map((step, i) => (
            <Reveal
              key={step.n}
              delay={i * 0.08}
              className="border-t border-marketing-border-strong pt-5"
            >
              <div className="mb-3 font-marketing-mono text-sm text-marketing-accent">{step.n}</div>
              <h3 className="mb-2 font-marketing-sans text-lg font-bold text-marketing-fg">{step.title}</h3>
              <p className="text-[15px] leading-relaxed text-marketing-muted">{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-[6vw] py-[10vh]">
        <Reveal>
          <h2 className="max-w-[18ch] text-balance font-marketing-sans text-[clamp(28px,5vw,56px)] font-bold leading-tight text-marketing-fg">
            Have work that needs shipping, or want to be the one shipping it?
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <MagneticButton href="/contact">Start a project</MagneticButton>
            <MagneticButton href="/careers" variant="outline">
              Join the crew
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
