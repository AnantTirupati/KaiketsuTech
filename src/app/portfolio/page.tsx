import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { KtPageHead } from "@/components/marketing/kt/KtPageHead";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtCell } from "@/components/marketing/kt/KtCell";
import { KtCtaSection } from "@/components/marketing/kt/KtCtaSection";
import { ProjectGrid } from "@/components/marketing/ProjectGrid";
import {
  KIND_BLURB,
  KIND_LABEL,
  clientProjects,
  productProjects,
  sampleProjects,
  type MarketingProject,
  type ProjectKind,
} from "@/lib/marketing-projects";
import { founders } from "@/lib/team";
import { researchPapers } from "@/lib/research";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "KaiketsuTech's complete portfolio: our founders, published research, products, client work and sample websites, with live links.",
};

type ShowcaseProject = {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  showcase_image_url: string | null;
  showcase_tags: string[] | null;
};

async function fetchShowcaseProjects(): Promise<ShowcaseProject[]> {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data } = await supabase
      .from("projects")
      .select("id, title, description, status, showcase_image_url, showcase_tags, created_at")
      .eq("is_showcase", true)
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

const groups: [ProjectKind, MarketingProject[]][] = [
  ["product", productProjects],
  ["client", clientProjects],
  ["sample", sampleProjects],
];

export default async function PortfolioPage() {
  const engagements = await fetchShowcaseProjects();
  let band = 0;
  const nextBand = () => (band++ % 2 === 0 ? "kt-section kt-s--light" : "kt-section");

  return (
    <>
      <KtPageHead
        eyebrow="Portfolio"
        imageSrc="/images/banners/portfolio_banner.jpg"
        title={
          <>
            Everything we have
            <br />
            designed and built.
          </>
        }
        lede="The people behind KaiketsuTech, our published research, the products we run ourselves, the sites we deliver for clients and the samples we build to show what is possible. All of it is deployed and linked."
      />

      {/* Founders */}
      <section className={nextBand()}>
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                Leadership
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2">
                The people behind KaiketsuTech.
              </KtReveal>
            </div>
          </div>
          <div className="kt-grid kt-grid-3">
            {founders.map((f, i) => (
              <KtReveal as="article" key={f.slug} index={i}>
                <KtCell theme="light">
                  <p className="kt-t-mono">
                    {f.role} · {f.focus}
                  </p>
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
        </div>
      </section>

      {/* Research */}
      <section className={nextBand()} id="research">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                Research
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2" style={{ maxWidth: "22ch" }}>
                Engineering papers behind our products.
              </KtReveal>
            </div>
            <KtReveal as="p" index={2} className="kt-t-body kt-lede">
              Co-founder Aakshant Kumar is the sole author of both papers. The Nova preprint is published on Zenodo; the
              AirGated manuscript is shown here as a preview ahead of publication.
            </KtReveal>
          </div>
          <div className="kt-grid kt-grid-2">
            {researchPapers.map((paper, i) => (
              <KtReveal as="article" key={paper.slug} index={i}>
                <KtCell theme="dark">
                  <p className="kt-t-mono">
                    {paper.status === "Published" ? "● Published" : "○ Preview, not yet published"} · {paper.meta}
                  </p>
                  <h3 className="kt-t-h3">{paper.title}</h3>
                  <p className="kt-t-small" style={{ color: "var(--ink-mute)" }}>
                    {paper.authors}
                    {paper.doi ? ` · DOI ${paper.doi}` : ""}
                  </p>
                  <p className="kt-t-small">{paper.abstract}</p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {paper.findings.slice(0, 3).map((f) => (
                      <li key={f} className="kt-t-small" style={{ display: "flex", gap: 10 }}>
                        <span aria-hidden="true" style={{ marginTop: 8, height: 4, width: 4, flexShrink: 0, borderRadius: "50%", background: "var(--ink)" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 22, marginTop: "auto", paddingTop: 12 }}>
                    {paper.href && (
                      <a href={paper.href} target="_blank" rel="noopener noreferrer" className="kt-link-arrow" style={{ display: "inline-flex" }}>
                        Read the paper
                      </a>
                    )}
                    <Link href={`/showcase/${paper.project}`} className="kt-link-arrow" style={{ display: "inline-flex" }}>
                      About {paper.project === "nova" ? "Nova" : "AirGated"}
                    </Link>
                  </div>
                </KtCell>
              </KtReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Products, client work, samples */}
      {groups.map(([kind, projects]) => (
        <section key={kind} id={kind} className={nextBand()}>
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

      {/* Engagements marked public in the project system */}
      {engagements.length > 0 && (
        <section className={nextBand()}>
          <div className="kt-wrap">
            <div className="kt-sec-head">
              <div>
                <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                  Recent engagements
                </KtReveal>
                <KtReveal as="h2" index={1} className="kt-t-h2">
                  Newly published.
                </KtReveal>
              </div>
            </div>
            <div className="kt-grid kt-grid-3">
              {engagements.map((p, i) => (
                <KtReveal as="article" key={p.id} index={i}>
                  <KtCell theme="light">
                    <h3 className="kt-t-h3">{p.title}</h3>
                    {p.description && (
                      <p className="kt-t-small" style={{ marginTop: 8 }}>
                        {p.description}
                      </p>
                    )}
                    {p.showcase_tags && p.showcase_tags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto", paddingTop: 12 }}>
                        {p.showcase_tags.map((tag) => (
                          <span
                            key={tag}
                            className="kt-t-mono"
                            style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "4px 10px", fontSize: 11 }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </KtCell>
                </KtReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <KtCtaSection
        title="Want to see yours here next?"
        body="Tell us what you need and we will come back with a scope and a price."
        primary={{ href: "/contact", label: "Start a project" }}
        secondary={{ href: "/showcase", label: "Browse all work" }}
        variant={band % 2 === 0 ? "light" : "dark"}
      />
    </>
  );
}
