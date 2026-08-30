"use client";

import Link from "next/link";
import { User, Calendar, Code, ExternalLink, Award, ArrowLeft, Briefcase, Globe, Download, FileText } from "lucide-react";
import { KtReveal } from "@/components/marketing/kt/KtReveal";

interface InternData {
  intern: Record<string, unknown> & {
    intern_id: string;
    department: string;
    start_date: string;
    end_date: string | null;
    status: string;
    bio: string | null;
    skills: string[] | null;
    github_url: string | null;
    linkedin_url: string | null;
    portfolio_url: string | null;
    profiles: {
      full_name: string | null;
      email: string;
      avatar_url: string | null;
      rating: number | null;
    } | null;
  };
  contributions: Array<{
    role: string;
    contribution_summary: string | null;
    start_date: string | null;
    end_date: string | null;
    projects: {
      id: string;
      title: string;
      description: string | null;
      status: string | null;
      showcase_tags: string[] | null;
    } | null;
  }>;
  certificates: Array<{
    certificate_id: string;
    title: string;
    description: string | null;
    issued_at: string | null;
    qr_code_url: string | null;
    status: string;
  }>;
  application?: {
    phone: string | null;
    experience: string | null;
    skills: string | null;
    technologies: string | null;
    resume_url: string | null;
    created_at: string | null;
  } | null;
}

export default function InternProfileClient({ data }: { data: InternData }) {
  const { intern, contributions, certificates, application } = data;
  const profile = intern.profiles;
  const name = profile?.full_name || "KaiketsuTech Intern";

  const formatDepartment = (dept: string) => (dept.toLowerCase() === "management" ? "Management Intern" : dept);
  const isActive = intern.status === "active";

  return (
    <section className="kt-section" style={{ paddingTop: "clamp(96px,12vh,160px)" }}>
      <div className="kt-wrap" style={{ display: "flex", flexDirection: "column", gap: "clamp(28px,3.4vw,44px)", maxWidth: 1040, margin: "0 auto" }}>
        <Link href="/verify" className="kt-t-mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ink-mute)" }}>
          <ArrowLeft size={16} /> Back to verification
        </Link>

        <KtReveal
          as="div"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(24px,3vw,40px)",
            border: "1px solid var(--line)",
            background: "var(--sf-1)",
            padding: "clamp(28px,4vw,48px)",
          }}
        >
          <div className="flex flex-col md:flex-row" style={{ gap: "clamp(24px,3vw,40px)" }}>
            <div
              style={{
                display: "flex",
                height: 96,
                width: 96,
                flexShrink: 0,
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--line)",
                color: "var(--ink)",
                overflow: "hidden",
              }}
            >
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={name} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
              ) : (
                <User size={38} />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <h1 className="kt-t-h1" style={{ fontSize: "clamp(28px,3.6vw,44px)", marginBottom: 6 }}>
                    {name}
                  </h1>
                  <p className="kt-t-mono" style={{ textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-mute)", marginBottom: 14 }}>
                    {intern.intern_id}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }} className="kt-t-small">
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Code size={14} style={{ color: "var(--ink-mute)" }} />
                      <span
                        className="kt-t-mono"
                        style={{ border: "1px solid var(--line)", padding: "4px 10px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}
                      >
                        {formatDepartment(intern.department)}
                      </span>
                    </span>
                    <span style={{ color: "var(--line-bold)" }}>•</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Calendar size={14} style={{ color: "var(--ink-mute)" }} />
                      {new Date(intern.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      {" — "}
                      {intern.end_date
                        ? new Date(intern.end_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                        : "Present"}
                    </span>
                  </div>
                </div>

                <div
                  className="kt-t-mono"
                  style={{
                    flexShrink: 0,
                    border: isActive ? "1px solid var(--line)" : "1px dashed var(--ink-mute)",
                    background: isActive ? "var(--sf-2)" : "transparent",
                    padding: "7px 16px",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                  }}
                >
                  {intern.status}
                </div>
              </div>

              {intern.bio && (
                <p className="kt-t-small" style={{ marginTop: 22, maxWidth: "60ch" }}>
                  {intern.bio}
                </p>
              )}

              {intern.skills && intern.skills.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
                  {intern.skills.map((skill: string) => (
                    <span key={skill} className="kt-t-mono" style={{ border: "1px solid var(--line)", padding: "4px 10px", fontSize: 11 }}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 20, borderTop: "1px solid var(--line)", marginTop: 22, paddingTop: 20 }}>
                {intern.github_url && (
                  <a href={intern.github_url} target="_blank" rel="noopener noreferrer" className="kt-t-mono" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ink-mute)" }}>
                    <svg style={{ height: 15, width: 15 }} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    GitHub
                  </a>
                )}
                {intern.linkedin_url && (
                  <a href={intern.linkedin_url} target="_blank" rel="noopener noreferrer" className="kt-t-mono" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ink-mute)" }}>
                    <svg style={{ height: 15, width: 15 }} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
                {intern.portfolio_url && (
                  <a href={intern.portfolio_url} target="_blank" rel="noopener noreferrer" className="kt-t-mono" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ink-mute)" }}>
                    <Globe size={15} /> Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>
        </KtReveal>

        {application && (
          <KtReveal
            as="div"
            index={1}
            style={{ border: "1px solid var(--line)", background: "var(--sf-1)", padding: "clamp(24px,2.6vw,40px)" }}
          >
            <h2
              className="kt-t-mono"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderBottom: "1px solid var(--line)",
                paddingBottom: 16,
                marginBottom: 22,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--ink-mute)",
              }}
            >
              <FileText size={14} style={{ color: "var(--ink)" }} /> Application credentials &amp; background
            </h2>

            <div className="kt-grid kt-grid-2">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {application.phone && (
                  <div>
                    <span className="kt-t-mono" style={{ display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-mute)" }}>
                      Contact phone
                    </span>
                    <span className="kt-t-small">{application.phone}</span>
                  </div>
                )}
                {application.created_at && (
                  <div>
                    <span className="kt-t-mono" style={{ display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-mute)" }}>
                      Applied on
                    </span>
                    <span className="kt-t-small">
                      {new Date(application.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                )}
                {application.technologies && (
                  <div>
                    <span className="kt-t-mono" style={{ display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-mute)" }}>
                      Technologies declared
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                      {application.technologies.split(",").map((tech: string) => (
                        <span key={tech} className="kt-t-mono" style={{ border: "1px solid var(--line)", padding: "3px 8px", fontSize: 10 }}>
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {application.resume_url && (
                  <div style={{ paddingTop: 8 }}>
                    <a
                      href={application.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kt-t-mono"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid var(--line)", padding: "10px 16px", fontSize: 11 }}
                    >
                      <Download size={14} style={{ color: "var(--ink)" }} /> Download submitted resume
                    </a>
                  </div>
                )}
              </div>

              {application.experience && (
                <div>
                  <span className="kt-t-mono" style={{ display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-mute)" }}>
                    Prior experience
                  </span>
                  <div
                    className="kt-t-small"
                    style={{ maxHeight: 220, overflowY: "auto", whiteSpace: "pre-line", border: "1px solid var(--line)", background: "var(--bg)", padding: 16 }}
                  >
                    {application.experience}
                  </div>
                </div>
              )}
            </div>
          </KtReveal>
        )}

        {contributions.length > 0 && (
          <KtReveal as="div" index={2}>
            <h2
              className="kt-t-mono"
              style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-mute)" }}
            >
              <Briefcase size={14} /> Project contributions
            </h2>
            <div className="kt-grid kt-grid-2">
              {contributions.map((contrib, idx) => (
                <div key={idx} style={{ border: "1px solid var(--line)", background: "var(--sf-1)", padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                    <h3 className="kt-t-h3">{contrib.projects?.title || "Project"}</h3>
                    <span className="kt-t-mono" style={{ flexShrink: 0, border: "1px solid var(--line)", padding: "3px 10px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {contrib.role}
                    </span>
                  </div>
                  {contrib.projects?.description && <p className="kt-t-small">{contrib.projects.description}</p>}
                  {contrib.contribution_summary && (
                    <p className="kt-t-small" style={{ marginTop: 12, borderTop: "1px solid var(--line)", paddingTop: 12, color: "var(--ink)" }}>
                      {contrib.contribution_summary}
                    </p>
                  )}
                  {contrib.projects?.showcase_tags && contrib.projects.showcase_tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                      {contrib.projects.showcase_tags.map((tag: string) => (
                        <span key={tag} className="kt-t-mono" style={{ border: "1px solid var(--line)", padding: "3px 8px", fontSize: 10 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </KtReveal>
        )}

        {certificates.length > 0 && (
          <KtReveal as="div" index={3}>
            <h2
              className="kt-t-mono"
              style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-mute)" }}
            >
              <Award size={14} /> Certificates
            </h2>
            <div className="kt-grid kt-grid-3">
              {certificates.map((cert) => (
                <Link
                  key={cert.certificate_id}
                  href={`/verify/${cert.certificate_id}`}
                  style={{ display: "block", border: "1px solid var(--line)", background: "var(--sf-1)", padding: 22 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <Award size={16} style={{ color: "var(--ink)" }} />
                    <span className="kt-t-mono" style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}>
                      {cert.certificate_id}
                    </span>
                  </div>
                  <h3 className="kt-t-h3" style={{ fontSize: 16, marginBottom: 8 }}>
                    {cert.title}
                  </h3>
                  {cert.description && <p className="kt-t-small">{cert.description}</p>}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }} className="kt-t-mono">
                    <span style={{ color: "var(--ink-mute)", textTransform: "none", letterSpacing: 0 }}>
                      {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      Verify <ExternalLink size={11} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </KtReveal>
        )}
      </div>
    </section>
  );
}
