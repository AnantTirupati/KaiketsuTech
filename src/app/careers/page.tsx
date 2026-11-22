import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { KtPageHead } from "@/components/marketing/kt/KtPageHead";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtCtaSection } from "@/components/marketing/kt/KtCtaSection";
import { KtCell } from "@/components/marketing/kt/KtCell";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join KaiketsuTech and build production-grade enterprise software. Apply for frontend, backend, or full-stack developer intern roles.",
};

const hiringSteps = [
  {
    title: "Send something",
    desc: "A repo, a project, a writeup. A CV alone tells us little.",
  },
  {
    title: "Paid trial task",
    desc: "A small, real, scoped piece of work. Paid, whether or not it leads anywhere.",
  },
  {
    title: "Conversation",
    desc: "Half an hour on what you built, what broke, and what you would change now.",
  },
];

export default async function CareersPage() {
  const supabase = await createClient();

  const { data: openRoles } = await supabase
    .from("job_postings")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return (
    <>
      <KtPageHead
        eyebrow="Careers"
        imageSrc="/images/banners/about_banner.jpg"
        title={
          <>
            Join the team.
          </>
        }
        lede="We are a small team and grow deliberately. We value what you have built over what your resume lists. If none of the roles below fit but you can build, get in touch anyway."
      />

      <section className="kt-section kt-s--light">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                Open roles
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2">
                Currently hiring.
              </KtReveal>
            </div>
            <KtReveal as="p" index={2} className="kt-t-body kt-lede">
              Applications stay open year-round even when a role is filled — we start the next intake before we
              need it.
            </KtReveal>
          </div>

          {openRoles && openRoles.length > 0 ? (
            <div className="kt-steps">
              {openRoles.map((role, i) => (
                <KtReveal as="div" key={role.id} index={i} className="kt-step">
                  <p className="kt-t-mono">{String(i + 1).padStart(2, "0")}</p>
                  <div>
                    <h3 className="kt-t-h3">{role.title}</h3>
                    <p className="kt-t-small" style={{ marginTop: 10 }}>
                      {role.description}
                    </p>
                    {role.requirements && role.requirements.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                        {role.requirements.map((req: string) => (
                          <span
                            key={req}
                            className="kt-t-mono"
                            style={{
                              border: "1px solid var(--line)",
                              borderRadius: 999,
                              padding: "4px 10px",
                              fontSize: 11,
                            }}
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="kt-t-mono">{role.track}</p>
                    <Link className="kt-link-arrow" style={{ marginTop: 14 }} href={`/apply?role=${role.id}`}>
                      Apply
                    </Link>
                  </div>
                </KtReveal>
              ))}
            </div>
          ) : (
            <KtReveal
              as="div"
              className="kt-step"
              style={{ textAlign: "center", justifyContent: "center", padding: "48px 24px" }}
            >
              <p className="kt-t-mono" style={{ color: "var(--ink-mute)" }}>
                There are no open roles at this moment. Check back later!
              </p>
            </KtReveal>
          )}
        </div>
      </section>

      <section className="kt-section">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                How hiring works
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2">
                Three steps, about a week.
              </KtReveal>
            </div>
            <KtReveal as="p" index={2} className="kt-t-body kt-lede">
              No whiteboard algorithms. You will be doing the actual job in step two.
            </KtReveal>
          </div>
          <div className="kt-grid kt-grid-3">
            {hiringSteps.map((s, i) => (
              <KtReveal as="article" key={s.title} index={i}>
                <KtCell theme="dark">
                  <p className="kt-t-mono">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="kt-t-h3">{s.title}</h3>
                  <p className="kt-t-small">{s.desc}</p>
                </KtCell>
              </KtReveal>
            ))}
          </div>
        </div>
      </section>

      <KtCtaSection
        title="Nothing here fits you?"
        body="Send us what you have built. You can also write to careers@kaiketsutech.online."
        primary={{ href: "/contact", label: "Start a project" }}
        secondary={{ href: "/showcase", label: "See the work" }}
        variant="light"
      />
    </>
  );
}
