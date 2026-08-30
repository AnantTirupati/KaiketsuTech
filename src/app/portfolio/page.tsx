import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { KtPageHead } from "@/components/marketing/kt/KtPageHead";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtCell } from "@/components/marketing/kt/KtCell";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Client engagements tracked through KaiketsuTech — public case studies as they ship.",
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
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const { data } = await supabase
    .from("projects")
    .select("id, title, description, status, showcase_image_url, showcase_tags, created_at")
    .eq("is_showcase", true)
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function PortfolioPage() {
  const projects = await fetchShowcaseProjects();

  return (
    <>
      <KtPageHead
        eyebrow="Portfolio"
        imageSrc="/images/banners/portfolio_banner.jpg"
        title={
          <>
            Client engagements,
            <br />
            tracked as they ship.
          </>
        }
        lede={
          <>
            This page pulls directly from our internal project system — it fills in as client work gets marked
            ready for public display. For work that&rsquo;s live today, see{" "}
            <Link href="/showcase" className="kt-link-arrow" style={{ display: "inline-flex" }}>
              our work
            </Link>
            .
          </>
        }
      />

      <section className="kt-section kt-s--light">
        <div className="kt-wrap">
          {projects.length > 0 ? (
            <div className="kt-grid kt-grid-3">
              {projects.map((p, i) => (
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
          ) : (
            <KtReveal
              as="div"
              className="kt-step"
              style={{ textAlign: "center", justifyContent: "center", padding: "56px 24px" }}
            >
              <div>
                <p className="kt-t-mono kt-eyebrow" style={{ justifyContent: "center" }}>
                  Coming soon
                </p>
                <p className="kt-t-body" style={{ maxWidth: "48ch", margin: "12px auto 0" }}>
                  Nothing published here yet — client engagements get added as they&rsquo;re marked ready for public
                  display. Check{" "}
                  <Link href="/showcase" className="kt-link-arrow" style={{ display: "inline-flex" }}>
                    our work
                  </Link>{" "}
                  for what&rsquo;s live right now.
                </p>
              </div>
            </KtReveal>
          )}
        </div>
      </section>
    </>
  );
}
