import type { Metadata } from "next";
import { KtPageHead } from "@/components/marketing/kt/KtPageHead";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtRevealLink } from "@/components/marketing/kt/KtRevealLink";
import { KtCtaSection } from "@/components/marketing/kt/KtCtaSection";
import { KtCell } from "@/components/marketing/kt/KtCell";
import { marketingProjects } from "@/lib/marketing-projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Real sites, real clients — the work KaiketsuTech has actually shipped.",
};

const engagementTypes = [
  {
    title: "Build from zero",
    desc: "Nothing exists yet. We scope it, build it, ship it, and hand you the keys.",
  },
  {
    title: "Rescue and extend",
    desc: "Something exists and it is holding you back. We read it honestly, then fix or replace it.",
  },
  {
    title: "Audit",
    desc: "A fixed-scope review — security, performance or architecture — with a written report your team can act on.",
  },
];

export default function ShowcasePage() {
  return (
    <>
      <KtPageHead
        eyebrow="Work"
        imageSrc="/images/banners/showcase_banner.jpg"
        title={
          <>
            Things we
            <br />
            have shipped.
          </>
        }
        lede="Every project here is either live at a real URL or a working prototype with an honest status label. Nothing on this page is a mockup."
      />

      <section className="kt-section kt-s--light">
        <div className="kt-wrap">
          <div className="kt-work-grid">
            {marketingProjects.map((project, i) => (
              <KtRevealLink
                key={project.slug}
                index={i}
                className="kt-work-card"
                href={`/showcase/${project.slug}`}
              >
                <div className="kt-work-thumb">
                  {project.image ? (
                    <img src={project.image} alt="" className="kt-work-thumb-img" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="kt-u-halftone" aria-hidden="true" />
                  )}
                  <div className="kt-work-cap">
                    <span
                      className="kt-t-mono"
                      style={{
                        display: "inline-block",
                        marginBottom: 10,
                        color: project.status === "Live" ? "var(--ink)" : "var(--ink-mute)",
                      }}
                    >
                      {project.status === "Live" ? "● live" : "○ prototype"}
                    </span>
                    <h3 className="kt-t-h3">{project.name}</h3>
                    <div className="kt-work-meta">
                      <span className="kt-t-mono">{project.category}</span>
                      <span className="kt-t-mono">{project.year}</span>
                      <span className="kt-t-mono">{project.stack[0]}</span>
                    </div>
                  </div>
                </div>
              </KtRevealLink>
            ))}
          </div>
        </div>
      </section>

      <section className="kt-section">
        <div className="kt-wrap">
          <div className="kt-sec-head" style={{ marginBottom: 0 }}>
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                Engagement types
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2" style={{ maxWidth: "18ch" }}>
                Most of it falls into one of three shapes.
              </KtReveal>
            </div>
            <KtRevealLink index={2} className="kt-link-arrow" href="/services">
              What we offer
            </KtRevealLink>
          </div>
        </div>
        <div className="kt-wrap" style={{ marginTop: "clamp(32px,4vw,56px)" }}>
          <div className="kt-grid kt-grid-3">
            {engagementTypes.map((e, i) => (
              <KtReveal as="article" key={e.title} index={i}>
                <KtCell theme="dark">
                  <p className="kt-t-mono">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="kt-t-h3">{e.title}</h3>
                  <p className="kt-t-small">{e.desc}</p>
                </KtCell>
              </KtReveal>
            ))}
          </div>
        </div>
      </section>

      <KtCtaSection
        title="Want the long version of any of these?"
        body="We can walk you through the repo, the decisions, and what we would do differently now."
        primary={{ href: "/contact", label: "Start a project" }}
        secondary={{ href: "/portfolio", label: "See the full portfolio" }}
        variant="light"
      />
    </>
  );
}
