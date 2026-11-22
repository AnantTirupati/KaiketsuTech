import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { KtPageHead } from "@/components/marketing/kt/KtPageHead";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtCell } from "@/components/marketing/kt/KtCell";
import { KtCtaSection } from "@/components/marketing/kt/KtCtaSection";

export const metadata: Metadata = {
  title: "Intern cohorts",
  description: "The students who have trained and shipped with KaiketsuTech, grouped by cohort, with verifiable profiles.",
};

// Cohort lists change rarely; refresh every ten minutes rather than per request.
export const revalidate = 600;

type CohortIntern = {
  intern_id: string;
  department: string;
  start_date: string;
  end_date: string | null;
  status: string;
  skills: string[] | null;
  profiles: { full_name: string | null } | { full_name: string | null }[] | null;
};

async function fetchInterns(): Promise<CohortIntern[]> {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const base = "intern_id, department, start_date, end_date, status, skills, profiles (full_name)";
    // Senior team members are listed on the About page, not in a cohort. The
    // member_type column may not exist yet on an older database, so fall back
    // to the original query if the first one is rejected.
    const withType = await supabase
      .from("interns")
      .select(base)
      .is("deleted_at", null)
      .in("status", ["active", "completed"])
      .neq("member_type", "senior")
      .order("start_date", { ascending: false });
    if (!withType.error) return (withType.data as unknown as CohortIntern[]) ?? [];

    const fallback = await supabase
      .from("interns")
      .select(base)
      .is("deleted_at", null)
      .in("status", ["active", "completed"])
      .order("start_date", { ascending: false });
    return (fallback.data as unknown as CohortIntern[]) ?? [];
  } catch {
    return [];
  }
}

function cohortKey(startDate: string) {
  const d = new Date(startDate);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function cohortLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
}

function nameOf(i: CohortIntern) {
  const p = Array.isArray(i.profiles) ? i.profiles[0] : i.profiles;
  return p?.full_name?.trim() || i.intern_id;
}

const departmentLabel: Record<string, string> = {
  engineering: "Engineering",
  design: "Design",
  marketing: "Marketing",
  operations: "Operations",
};

export default async function CohortsPage() {
  const interns = await fetchInterns();

  const grouped = new Map<string, CohortIntern[]>();
  for (const i of interns) {
    const key = cohortKey(i.start_date);
    grouped.set(key, [...(grouped.get(key) ?? []), i]);
  }
  const cohorts = [...grouped.entries()].sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <>
      <KtPageHead
        eyebrow="Cohorts"
        imageSrc="/images/banners/about_banner.jpg"
        title={
          <>
            The people who
            <br />
            build with us.
          </>
        }
        lede={
          <>
            Every intern at KaiketsuTech works on live projects and receives a verifiable record of it. Each profile
            below is public and every certificate can be checked on the{" "}
            <Link href="/verify" className="kt-link-arrow" style={{ display: "inline-flex" }}>
              verification page
            </Link>
            .
          </>
        }
      />

      {cohorts.length === 0 ? (
        <section id="cohort-list" className="kt-section kt-s--light">
          <div className="kt-wrap">
            <KtReveal
              as="div"
              className="kt-step"
              style={{ textAlign: "center", justifyContent: "center", padding: "56px 24px" }}
            >
              <div>
                <p className="kt-t-mono kt-eyebrow" style={{ justifyContent: "center" }}>
                  First cohort
                </p>
                <p className="kt-t-body" style={{ maxWidth: "48ch", margin: "12px auto 0" }}>
                  Our first public cohort will be listed here as soon as interns are onboarded. Applications are open.
                </p>
                <p style={{ marginTop: 20 }}>
                  <Link href="/careers" className="kt-link-arrow" style={{ display: "inline-flex" }}>
                    See open roles
                  </Link>
                </p>
              </div>
            </KtReveal>
          </div>
        </section>
      ) : (
        cohorts.map(([key, members], ci) => (
          <section key={key} id={ci === 0 ? "cohort-list" : undefined} className={ci % 2 === 0 ? "kt-section kt-s--light" : "kt-section"}>
            <div className="kt-wrap">
              <div className="kt-sec-head">
                <div>
                  <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                    {members.length} {members.length === 1 ? "intern" : "interns"}
                  </KtReveal>
                  <KtReveal as="h2" index={1} className="kt-t-h2">
                    {cohortLabel(key)} cohort
                  </KtReveal>
                </div>
              </div>
              <div className="kt-grid kt-grid-3">
                {members.map((m, i) => (
                  <KtReveal as="article" key={m.intern_id} index={i}>
                    <Link href={`/intern/${m.intern_id}`} style={{ display: "block", height: "100%" }}>
                      <KtCell theme={ci % 2 === 0 ? "light" : "dark"}>
                        <p className="kt-t-mono">
                          {departmentLabel[m.department] ?? m.department} · {m.status === "completed" ? "Completed" : "Active"}
                        </p>
                        <h3 className="kt-t-h3">{nameOf(m)}</h3>
                        {m.skills && m.skills.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto", paddingTop: 12 }}>
                            {m.skills.slice(0, 5).map((s) => (
                              <span
                                key={s}
                                className="kt-t-mono"
                                style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "4px 10px", fontSize: 11 }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="kt-t-mono" style={{ marginTop: 12 }}>
                          {m.intern_id}
                        </span>
                      </KtCell>
                    </Link>
                  </KtReveal>
                ))}
              </div>
            </div>
          </section>
        ))
      )}

      <KtCtaSection
        title="Want to be in the next cohort?"
        body="We take students who can already ship and give them real client work, senior review and a record they can show employers."
        primary={{ href: "/careers", label: "See open roles" }}
        secondary={{ href: "/verify", label: "Verify a certificate" }}
        variant={cohorts.length % 2 === 0 ? "light" : "dark"}
      />
    </>
  );
}
