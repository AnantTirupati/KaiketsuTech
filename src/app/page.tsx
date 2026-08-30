import type { Metadata } from "next";
import Link from "next/link";
import { KtHeroTopbar } from "@/components/marketing/kt/KtHeroTopbar";
import { HeadlineParticles } from "@/components/marketing/kt/KtParticles";
import { KtActionRow, KtLinkButton } from "@/components/marketing/kt/KtButton";
import { KtMarquee } from "@/components/marketing/kt/KtMarquee";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtRevealLink } from "@/components/marketing/kt/KtRevealLink";
import { KtCell } from "@/components/marketing/kt/KtCell";
import { marketingProjects } from "@/lib/marketing-projects";

export const metadata: Metadata = {
  title: { absolute: "KaiketsuTech — Kaiketsu means solution. That's the job." },
  description:
    "A crew of student developers shipping real client work — web, mobile, AI and security research — while we build out the next generation of the team.",
};

const capabilities = [
  "Web platforms",
  "Mobile apps",
  "AI systems",
  "Security research",
  "Design systems",
  "API architecture",
  "Deployment & ops",
];

const services = [
  {
    idx: "01",
    title: "Web platforms",
    desc: "Product sites, dashboards and internal tools. Typed end to end, tested where it counts, deployed on infrastructure you can read.",
    stack: ["React", "TypeScript", "Node", "Postgres"],
  },
  {
    idx: "02",
    title: "Mobile",
    desc: "Cross-platform apps that make it through both review queues, with offline behaviour and release tooling handled before launch.",
    stack: ["React Native", "Expo", "Swift"],
  },
  {
    idx: "03",
    title: "AI systems",
    desc: "Retrieval, agents and model integration built against real evaluation sets — so you can tell whether it actually got better.",
    stack: ["Python", "PyTorch", "RAG", "Evals"],
  },
  {
    idx: "04",
    title: "Security research",
    desc: "Threat modelling, application audits and coordinated disclosure, written up so your engineers can act on it without a translator.",
    stack: ["Threat model", "Audit", "Disclosure"],
  },
];

const steps = [
  {
    n: "Step 01",
    title: "Scope",
    desc: "A working session, a written brief, and a fixed price. If the shape of the thing changes, we re-price before we build, not after.",
  },
  {
    n: "Step 02",
    title: "Build",
    desc: "Weekly demos against a live environment. You have repo access from day one — there is no reveal at the end.",
  },
  {
    n: "Step 03",
    title: "Ship",
    desc: "Deployment, monitoring and a runbook. We stay on for two weeks past launch at no extra cost, because launches break things.",
  },
  {
    n: "Step 04",
    title: "Hand over",
    desc: "Documentation written for the next engineer, not for us. Ongoing support is a separate, optional agreement.",
  },
];

// Real, verifiable numbers only (see marketing-projects.ts: "no fabricated
// metrics"). test-project's own stats block ships marked
// "<!-- REPLACE with your real numbers before launch. -->" — headcount and
// turnaround-time claims aren't backed by data this app can attest to, so
// this swaps in the four figures that are: shipped-project count (from the
// same data source as the work grid below), the number of service lines the
// site actually offers, and the reply-time commitment already published on
// /contact.
const stats = [
  { n: String(marketingProjects.length), label: "Projects shipped" },
  { n: "4", label: "Service disciplines" },
  { n: "2d", label: "Median reply time" },
  { n: "100%", label: "Code ownership, yours" },
];

const featured = marketingProjects.slice(0, 4);

export default function Home() {
  return (
    <>
      <div className="kt-stage">
        <div className="kt-plate">
          <video className="kt-plate-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <KtHeroTopbar />

        <main className="kt-hero">
          <h1 className="kt-headline">
            <span>
              <span className="kt-jp" lang="ja" tabIndex={0} title="Kaiketsu (解決) — solution">
                解決
                <span className="kt-jp-gloss" aria-hidden="true">
                  <i />
                  <b>Kaiketsu &middot; Solution</b>
                </span>
              </span>
              <span className="kt-sr-only">Kaiketsu — solution.</span>
            </span>
            <HeadlineParticles text={"That’s the job."} theme="dark" />
          </h1>
          <p className="kt-sub">
            We&rsquo;re a crew of student developers shipping real client work — web, mobile, AI, and security
            research — while we build out the next generation of the team.
          </p>
          <KtActionRow theme="dark" big primary={{ href: "/contact", label: "Start a project" }} secondary={{ href: "/showcase", label: "See the work" }} />
        </main>
      </div>

      <KtMarquee items={capabilities} label="Capabilities" />

      {/* Positioning */}
      <section className="kt-section">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                What we are
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h1" style={{ maxWidth: "16ch" }}>
                A small crew that ships, not a body shop that bills.
              </KtReveal>
            </div>
            <KtReveal as="p" index={2} className="kt-t-body kt-lede">
              We take a narrow number of projects at a time so the people who scoped your work are the people who
              write it. Every engagement ends with a repo you own, a deployment you control, and documentation
              written for whoever comes next.
            </KtReveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="kt-section kt-s--light" id="services">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                Services
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2">
                Four things, done properly.
              </KtReveal>
            </div>
            <KtRevealLink index={2} className="kt-link-arrow" href="/services">
              All services
            </KtRevealLink>
          </div>

          <div className="kt-grid kt-grid-4">
            {services.map((s, i) => (
              <KtReveal as="article" key={s.idx} index={i} className="kt-cell-slot">
                <KtCell theme="light">
                  <p className="kt-t-mono kt-idx">{s.idx}</p>
                  <h3 className="kt-t-h3">{s.title}</h3>
                  <p className="kt-t-small">{s.desc}</p>
                  <ul>
                    {s.stack.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </KtCell>
              </KtReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Selected work — real engagements from marketing-projects.ts */}
      <section className="kt-section" id="work">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                Selected work
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2">
                Recent builds.
              </KtReveal>
            </div>
            <KtRevealLink index={2} className="kt-link-arrow" href="/showcase">
              Full archive
            </KtRevealLink>
          </div>

          <div className="kt-work-grid">
            {featured.map((p, i) => (
              <KtRevealLink key={p.slug} index={i} className="kt-work-card" href={`/showcase/${p.slug}`}>
                <div className="kt-work-thumb">
                  {p.image ? (
                    <img src={p.image} alt="" className="kt-work-thumb-img" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="kt-u-halftone" aria-hidden="true" />
                  )}
                  <div className="kt-work-cap">
                    <h3 className="kt-t-h3">{p.name}</h3>
                    <div className="kt-work-meta">
                      <span className="kt-t-mono">{p.category}</span>
                      <span className="kt-t-mono">{p.year}</span>
                      <span className="kt-t-mono">{p.status}</span>
                    </div>
                  </div>
                </div>
              </KtRevealLink>
            ))}
          </div>
        </div>
      </section>

      {/* Process + stats */}
      <section className="kt-section kt-s--light" id="process">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                Process
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2">
                Four weeks to something running.
              </KtReveal>
            </div>
            <KtReveal as="p" index={2} className="kt-t-body kt-lede">
              No discovery phase that bills for a month and produces a slide deck. We scope in days, build in
              public, and hand over something you can deploy yourself.
            </KtReveal>
          </div>

          <div className="kt-steps">
            {steps.map((s, i) => (
              <KtReveal as="div" key={s.n} index={i} className="kt-step">
                <p className="kt-t-mono">{s.n}</p>
                <h3 className="kt-t-h3">{s.title}</h3>
                <p className="kt-t-small">{s.desc}</p>
              </KtReveal>
            ))}
          </div>
        </div>

        <div className="kt-wrap" style={{ marginTop: "clamp(48px,6vw,88px)" }}>
          <div className="kt-stats">
            {stats.map((s, i) => (
              <KtReveal as="div" key={s.label} index={i} className="kt-stat">
                <p className="kt-t-num">{s.n}</p>
                <p className="kt-t-mono">{s.label}</p>
              </KtReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Texture band — "why students" */}
      <section className="kt-section" style={{ overflow: "hidden", position: "relative" }}>
        <div
          className="kt-u-fade-b"
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.3 }}
        >
          <img src="/images/why_students_bg.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div className="kt-wrap" style={{ position: "relative", zIndex: 2 }}>
          <KtReveal as="p" className="kt-t-mono kt-eyebrow">
            Why students
          </KtReveal>
          <KtReveal as="h2" index={1} className="kt-t-h2" style={{ maxWidth: "20ch" }}>
            The people learning your stack this year are the ones who will still be curious about it next year.
          </KtReveal>
          <KtReveal as="p" index={2} className="kt-t-body" style={{ maxWidth: "52ch", marginTop: 22 }}>
            Every project we take on trains someone into it. That is the point of the studio, and it is why our
            rates look the way they do — you are getting senior review over hungry engineers, not juniors billed as
            seniors.
          </KtReveal>
          <KtReveal as="div" index={3} className="kt-cta-row" style={{ marginTop: 32 }}>
            <KtLinkButton href="/about" label="How the crew works" theme="dark" kind="secondary" />
            <Link className="kt-link-arrow" href="/careers">
              Join us
            </Link>
          </KtReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="kt-cta kt-s--light">
        <div className="kt-wrap">
          <div className="kt-cta-in">
            <KtReveal as="p" className="kt-t-mono kt-eyebrow" style={{ justifyContent: "center" }}>
              Start a project
            </KtReveal>
            <KtReveal as="h2" index={1} className="kt-t-h1">
              Tell us what you&rsquo;re building.
            </KtReveal>
            <KtReveal as="p" index={2} className="kt-t-body" style={{ marginTop: 18 }}>
              Send a paragraph. We&rsquo;ll come back within two working days with a scope and a number, or an
              honest reason we&rsquo;re not the right crew for it.
            </KtReveal>
            <KtReveal as="div" index={3}>
              <KtActionRow theme="light" primary={{ href: "/contact", label: "Start a project" }} secondary={{ href: "/pricing", label: "See pricing" }} />
            </KtReveal>
          </div>
        </div>
      </section>
    </>
  );
}
