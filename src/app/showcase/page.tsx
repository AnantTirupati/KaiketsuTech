import type { Metadata } from "next";
import { KtPageHead } from "@/components/marketing/kt/KtPageHead";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtRevealLink } from "@/components/marketing/kt/KtRevealLink";
import { KtCtaSection } from "@/components/marketing/kt/KtCtaSection";
import { KtCell } from "@/components/marketing/kt/KtCell";
import { ProjectGrid } from "@/components/marketing/ProjectGrid";
import {
  KIND_BLURB,
  KIND_LABEL,
  clientProjects,
  productProjects,
  sampleProjects,
  type ProjectKind,
  type MarketingProject,
} from "@/lib/marketing-projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Client projects, our own products and sample websites from KaiketsuTech, each with a live link.",
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

const groups: [ProjectKind, MarketingProject[]][] = [
  ["client", clientProjects],
  ["product", productProjects],
  ["sample", sampleProjects],
];

export default function ShowcasePage() {
  return (
    <>
      <KtPageHead
        eyebrow="Work"
        imageSrc="/images/banners/showcase_banner.jpg"
        title={
          <>
            Our work,
            <br />
            live on the web.
          </>
        }
        lede="Client projects delivered for real organisations, products we build and run ourselves, and sample websites that show what we can do for your industry. Each one links to its live site."
      />

      {groups.map(([kind, projects], gi) => (
        <section key={kind} id={kind} className={gi % 2 === 0 ? "kt-section kt-s--light" : "kt-section"}>
          <div className="kt-wrap">
            <div className="kt-sec-head">
              <div>
                <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                  {String(projects.length).padStart(2, "0")} projects
                </KtReveal>
                <KtReveal as="h2" index={1} className="kt-t-h2">
                  {KIND_LABEL[kind]}
                </KtReveal>
              </div>
              <KtReveal as="p" index={2} className="kt-t-body kt-lede">
                {KIND_BLURB[kind]}
              </KtReveal>
            </div>
            <ProjectGrid projects={projects} />
          </div>
        </section>
      ))}

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
        title="Want something like these for your business?"
        body="Tell us what you need and we will come back with a scope and a price."
        primary={{ href: "/contact", label: "Start a project" }}
        secondary={{ href: "/portfolio", label: "Company portfolio" }}
        variant="light"
      />
    </>
  );
}
