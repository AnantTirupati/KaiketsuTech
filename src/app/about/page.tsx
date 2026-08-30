import type { Metadata } from "next";
import Link from "next/link";
import { KtPageHead } from "@/components/marketing/kt/KtPageHead";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtCtaSection } from "@/components/marketing/kt/KtCtaSection";
import { KtCell } from "@/components/marketing/kt/KtCell";
import { KtLinkButton } from "@/components/marketing/kt/KtButton";
import { marketingProjects } from "@/lib/marketing-projects";

export const metadata: Metadata = {
  title: "About",
  description: "KaiketsuTech is a crew of student developers who build real client work together.",
};

const commitments = [
  {
    title: "Senior review, always",
    desc: "Every deliverable gets reviewed by someone who has shipped production code before, not just by whoever wrote it.",
  },
  {
    title: "Bad news early",
    desc: "If a scope, deadline, or approach isn't working, you hear it the week it happens — not at the handover call.",
  },
  {
    title: "No lock-in",
    desc: "You get the repo, the deployment access, and documentation written for whoever comes after us. Nothing is held back for leverage.",
  },
  {
    title: "We turn work down",
    desc: "If we're not the right crew for it, or we don't have the capacity to do it properly, we'll say so instead of taking the money.",
  },
];

const stats = [
  { n: String(marketingProjects.length), label: "Projects shipped" },
  { n: "4", label: "Disciplines" },
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
            KaiketsuTech started as a handful of friends who kept getting asked to build things — school websites,
            event registration pages, booking systems — and realized we&rsquo;d rather do it as a crew than one-off
            freelance gigs. The name is literal: kaiketsu is the Japanese word for &ldquo;solution.&rdquo;
            That&rsquo;s the whole job description.
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
                  Two things happen under one roof. Client work — real sites and systems for real businesses and
                  institutions, built and shipped by the crew. And crew-building — we scout student developers who
                  can already ship, bring them in, and grow the team as the work grows.
                </p>
              </KtCell>
            </KtReveal>
            <KtReveal as="article" index={1}>
              <KtCell theme="light">
                <h2 className="kt-t-h3">What funds what</h2>
                <p className="kt-t-body" style={{ marginTop: 12 }}>
                  Client work isn&rsquo;t a side hustle to our own ideas — it&rsquo;s the funding model for them.
                  Revenue from shipping other people&rsquo;s products is what lets us spend time on research work,
                  and on bringing on more student developers as interns rather than treating the crew as fixed.
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

      <section className="kt-section kt-s--light" style={{ overflow: "hidden", position: "relative" }}>
        <div
          className="kt-u-fade-b"
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, zIndex: 0, color: "var(--ink)", opacity: 0.07 }}
        >
          <div className="kt-u-halftone" style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="kt-wrap" style={{ position: "relative", zIndex: 2 }}>
          <KtReveal as="p" className="kt-t-mono kt-eyebrow">
            The crew
          </KtReveal>
          <KtReveal as="h2" index={1} className="kt-t-h2" style={{ maxWidth: "22ch" }}>
            Team profiles are going up here as the crew signs off on photos and bios.
          </KtReveal>
          <KtReveal as="p" index={2} className="kt-t-body" style={{ maxWidth: "56ch", marginTop: 22 }}>
            This section is intentionally not filled with placeholder headshots. Check the{" "}
            <Link className="kt-link-arrow" href="/careers" style={{ display: "inline-flex" }}>
              careers page
            </Link>{" "}
            if you want to be one of the names that lands here.
          </KtReveal>
          <KtReveal as="div" index={3} className="kt-cta-row" style={{ marginTop: 32 }}>
            <KtLinkButton href="/careers" label="Open roles" theme="dark" kind="secondary" />
            <Link className="kt-link-arrow" href="/contact">
              Work with us
            </Link>
          </KtReveal>
        </div>
      </section>

      <KtCtaSection
        variant="dark"
        title="Still reading?"
        body="You now know more about how we're structured than most of our clients do. Come build something with us."
        primary={{ href: "/contact", label: "Start a project" }}
        secondary={{ href: "/showcase", label: "See the work" }}
      />
    </>
  );
}
