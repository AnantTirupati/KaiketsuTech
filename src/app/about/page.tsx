import type { Metadata } from "next";
import Link from "next/link";
import { KtPageHead } from "@/components/marketing/kt/KtPageHead";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtCtaSection } from "@/components/marketing/kt/KtCtaSection";
import { KtCell } from "@/components/marketing/kt/KtCell";
import { KtLinkButton } from "@/components/marketing/kt/KtButton";
import { clientProjects, productProjects } from "@/lib/marketing-projects";
import { founders } from "@/lib/team";

export const metadata: Metadata = {
  title: "About",
  description: "KaiketsuTech is a student-run software company, founded by Anant Tirupati and Aakshant Kumar, that builds websites, products and AI systems for clients.",
};

const commitments = [
  {
    title: "Senior review, always",
    desc: "Every deliverable is reviewed by an engineer who has shipped production code, in addition to its author.",
  },
  {
    title: "Bad news early",
    desc: "If a scope, deadline or approach is not working, you hear about it that week, not at handover.",
  },
  {
    title: "No lock-in",
    desc: "You receive the repository, deployment access and documentation written for whoever maintains it next.",
  },
  {
    title: "Honest scoping",
    desc: "If a project is a poor fit, or we do not have the capacity to do it properly, we will say so before work begins.",
  },
];

const stats = [
  { n: String(clientProjects.length), label: "Client projects" },
  { n: String(productProjects.length), label: "Own products" },
  { n: "2026", label: "Founded" },
  { n: "100%", label: "Code ownership, yours" },
];

export default function AboutPage() {
  return (
    <>
      <KtPageHead
        eyebrow="About"
        imageSrc="/images/banners/about_banner.jpg"
        title={
          <>
            Kaiketsu means
            <br />
            solution.
          </>
        }
        lede={
          <>
            KaiketsuTech began when friends who were regularly asked to build school websites, event registration
            pages and booking systems decided to do that work together as a company. Kaiketsu is the Japanese word for
            &ldquo;solution,&rdquo; which is what we aim to deliver on every project.
          </>
        }
      />

      <section className="kt-section kt-s--light">
        <div className="kt-wrap">
          <KtReveal as="p" className="kt-t-mono kt-eyebrow">
            How it started
          </KtReveal>
          <div className="kt-grid kt-grid-2" style={{ marginTop: 12 }}>
            <KtReveal as="article" index={0}>
              <KtCell theme="light">
                <h2 className="kt-t-h3">How we&rsquo;re structured</h2>
                <p className="kt-t-body" style={{ marginTop: 12 }}>
                  We do two things. We build websites and systems for businesses and institutions, and we train
                  student developers who can already ship, growing the team as the work grows.
                </p>
              </KtCell>
            </KtReveal>
            <KtReveal as="article" index={1}>
              <KtCell theme="light">
                <h2 className="kt-t-h3">What funds what</h2>
                <p className="kt-t-body" style={{ marginTop: 12 }}>
                  Client work funds our own products and research. Revenue from delivering client projects lets us
                  build products such as NutriSafe and Narad, publish engineering research, and bring on more student
                  developers as interns.
                </p>
              </KtCell>
            </KtReveal>
          </div>
        </div>
      </section>

      <section className="kt-section">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                How we operate
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2">
                Four commitments.
              </KtReveal>
            </div>
          </div>
          <div className="kt-grid kt-grid-2">
            {commitments.map((c, i) => (
              <KtReveal as="article" key={c.title} index={i}>
                <KtCell theme="dark">
                  <h3 className="kt-t-h3">{c.title}</h3>
                  <p className="kt-t-small">{c.desc}</p>
                </KtCell>
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

      <section className="kt-section kt-s--light">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                Leadership
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2">
                Founders.
              </KtReveal>
            </div>
            <KtReveal as="p" index={2} className="kt-t-body kt-lede">
              KaiketsuTech is led by its two founders, who also build. See their work on the{" "}
              <Link className="kt-link-arrow" href="/portfolio" style={{ display: "inline-flex" }}>
                portfolio page
              </Link>
              .
            </KtReveal>
          </div>
          <div className="kt-grid kt-grid-2">
            {founders.map((f, i) => (
              <KtReveal as="article" key={f.slug} index={i}>
                <KtCell theme="light">
                  <p className="kt-t-mono">{f.role}</p>
                  <h3 className="kt-t-h3">{f.name}</h3>
                  <p className="kt-t-small">{f.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: "auto", paddingTop: 12 }}>
                    {f.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kt-link-arrow"
                        style={{ display: "inline-flex" }}
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </KtCell>
              </KtReveal>
            ))}
          </div>
          <KtReveal as="div" index={3} className="kt-cta-row" style={{ marginTop: 32 }}>
            <KtLinkButton href="/cohorts" label="Meet the interns" theme="dark" kind="secondary" />
            <Link className="kt-link-arrow" href="/careers">
              Open roles
            </Link>
          </KtReveal>
        </div>
      </section>

      <KtCtaSection
        variant="dark"
        title="Work with us"
        body="Tell us what you want to build and we will reply within two working days."
        primary={{ href: "/contact", label: "Start a project" }}
        secondary={{ href: "/portfolio", label: "View portfolio" }}
      />
    </>
  );
}
