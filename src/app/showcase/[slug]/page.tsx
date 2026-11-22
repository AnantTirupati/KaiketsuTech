import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtRevealLink } from "@/components/marketing/kt/KtRevealLink";
import { KtCtaSection } from "@/components/marketing/kt/KtCtaSection";
import { KIND_LABEL, marketingProjects, statusLabel } from "@/lib/marketing-projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return marketingProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = marketingProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.oneLiner,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = marketingProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="kt-section" style={{ paddingTop: "clamp(96px,12vh,160px)" }}>
      <div className="kt-wrap">
        <KtRevealLink href="/showcase" className="kt-t-mono" style={{ color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12 }}>
          ← All work
        </KtRevealLink>

        <KtReveal
          as="div"
          index={1}
          style={{
            marginTop: 24,
            border: "1px solid var(--line)",
            background: "var(--sf-1)",
            padding: "clamp(28px,4vw,44px)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
            <span className="kt-t-mono" style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}>
              {KIND_LABEL[project.kind]} · {project.category}
            </span>
            <span
              className="kt-t-mono"
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: project.paused || project.status === "Prototype" ? "var(--ink-mute)" : "var(--ink)",
              }}
            >
              {statusLabel(project)}
            </span>
            <span className="kt-t-mono" style={{ color: "var(--ink-mute)" }}>
              {project.year}
            </span>
          </div>
          <h1 className="kt-t-h1" style={{ marginTop: 16, maxWidth: "20ch" }}>
            {project.name}
          </h1>
          <p className="kt-t-body" style={{ marginTop: 18, maxWidth: "60ch" }}>
            {project.oneLiner}
          </p>
        </KtReveal>

        {project.image && (
          <KtReveal as="div" index={2} style={{ marginTop: "clamp(24px,3vw,40px)" }}>
            <img
              src={project.image}
              alt={`${project.name} homepage`}
              style={{ width: "100%", height: "auto", border: "1px solid var(--line)", display: "block" }}
            />
          </KtReveal>
        )}

        <KtReveal
          as="div"
          index={3}
          className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]"
          style={{ marginTop: "clamp(40px,5vw,72px)", gap: "clamp(32px,4vw,64px)" }}
        >
          <div>
            <h2 className="kt-t-mono" style={{ textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-mute)", marginBottom: 16 }}>
              What it does
            </h2>
            <p className="kt-t-body">{project.description}</p>

            <h2
              className="kt-t-mono"
              style={{ textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-mute)", marginTop: 40, marginBottom: 16 }}
            >
              Highlights
            </h2>
            <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {project.highlights.map((h) => (
                <li key={h} style={{ display: "flex", alignItems: "flex-start", gap: 12 }} className="kt-t-small">
                  <span
                    aria-hidden="true"
                    style={{ marginTop: 8, height: 4, width: 4, flexShrink: 0, borderRadius: "50%", background: "var(--ink)" }}
                  />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <h2
                className="kt-t-mono"
                style={{ textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-mute)", marginBottom: 12 }}
              >
                Stack
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="kt-t-mono"
                    style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "4px 12px", fontSize: 12 }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {(project.url || project.links?.length) && (
              <div>
                <h2
                  className="kt-t-mono"
                  style={{ textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-mute)", marginBottom: 12 }}
                >
                  Links
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
                  {project.url && !project.paused && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="kt-link-arrow">
                      Visit {project.url.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  )}
                  {project.url && project.paused && (
                    <p className="kt-t-small" style={{ color: "var(--ink-mute)" }}>
                      The live site is temporarily offline.
                    </p>
                  )}
                  {project.links?.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="kt-link-arrow">
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {project.credits && project.credits.length > 0 && (
              <div>
                <h2
                  className="kt-t-mono"
                  style={{ textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-mute)", marginBottom: 12 }}
                >
                  Contributors
                </h2>
                <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {project.credits.map((c) => (
                    <li key={c.name} className="kt-t-small">
                      <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)" }}>
                        {c.name}
                      </a>
                      <span style={{ color: "var(--ink-mute)" }}> — {c.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </KtReveal>
      </div>

      <div style={{ marginTop: "clamp(64px,8vw,96px)" }}>
        <KtCtaSection
          title="Want something built like this?"
          primary={{ href: "/contact", label: "Start a project" }}
          secondary={{ href: "/showcase", label: "See more work" }}
        />
      </div>
    </article>
  );
}
