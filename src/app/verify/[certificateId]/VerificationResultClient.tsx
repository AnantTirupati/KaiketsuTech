"use client";

import Link from "next/link";
import { ShieldCheck, ShieldX, Clock, User, Calendar, Code, ArrowLeft, ExternalLink } from "lucide-react";
import type { VerificationResult } from "@/types/intern.types";
import { KtReveal } from "@/components/marketing/kt/KtReveal";

interface Props {
  result: VerificationResult;
  certificateId: string;
}

export default function VerificationResultClient({ result, certificateId }: Props) {
  // Monochrome by design (see GRADIENTS.md's "no color without a job" rule) —
  // status is conveyed by icon + border style + the label itself rather than
  // a red/amber/green palette the rest of the kt- design system doesn't have.
  const statusConfig = {
    active: { icon: <ShieldCheck size={36} />, label: "Verified", border: "1px solid var(--line)", bg: "var(--sf-1)" },
    revoked: { icon: <ShieldX size={36} />, label: "Revoked", border: "1px solid var(--ink)", bg: "var(--sf-2)" },
    expired: { icon: <Clock size={36} />, label: "Expired", border: "1px dashed var(--ink-mute)", bg: "var(--sf-1)" },
    not_found: { icon: <ShieldX size={36} />, label: "Not found", border: "1px dashed var(--line)", bg: "var(--bg)" },
  };

  const config = statusConfig[result.status];

  const formatDepartment = (dept: string) => (dept.toLowerCase() === "management" ? "Management Intern" : dept);

  return (
    <section className="kt-section" style={{ paddingTop: "clamp(96px,12vh,160px)" }}>
      <div className="kt-wrap" style={{ display: "flex", flexDirection: "column", gap: "clamp(32px,4vw,56px)", maxWidth: 920, margin: "0 auto" }}>
        <Link href="/verify" className="kt-t-mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ink-mute)" }}>
          <ArrowLeft size={16} /> Back to verification portal
        </Link>

        <KtReveal as="div" style={{ border: config.border, background: config.bg, padding: "clamp(28px,4vw,48px)", textAlign: "center" }}>
          <div style={{ marginBottom: 18, display: "flex", justifyContent: "center", color: "var(--ink)" }}>{config.icon}</div>
          <p className="kt-t-mono" style={{ textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>
            {config.label}
          </p>
          <h1 className="kt-t-h1" style={{ marginBottom: 12 }}>
            {certificateId}
          </h1>
          {result.certificate && (
            <p className="kt-t-body" style={{ maxWidth: "48ch", margin: "0 auto" }}>
              {result.certificate.title}
            </p>
          )}
          {result.status === "revoked" && result.certificate?.revoked_reason && (
            <p className="kt-t-small" style={{ marginTop: 14, color: "var(--ink-mute)" }}>
              Reason: {result.certificate.revoked_reason}
            </p>
          )}
        </KtReveal>

        {result.intern && result.certificate && (
          <div className="kt-grid kt-grid-2">
            <KtReveal as="article" index={1} className="kt-cell">
              <div style={{ border: "1px solid var(--line)", background: "var(--sf-1)", padding: "clamp(24px,2.6vw,36px)", height: "100%" }}>
                <div style={{ marginBottom: 22, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ display: "flex", height: 52, width: 52, alignItems: "center", justifyContent: "center", border: "1px solid var(--line)", color: "var(--ink)" }}>
                    <User size={22} />
                  </div>
                  <div>
                    <h2 className="kt-t-h3">{result.intern.name || "KaiketsuTech Intern"}</h2>
                    <p className="kt-t-mono" style={{ textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-mute)" }}>
                      {result.intern.intern_id}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="kt-t-small">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Code size={15} style={{ color: "var(--ink-mute)", flexShrink: 0 }} />
                    <span style={{ color: "var(--ink-mute)" }}>Department:</span>
                    <span
                      className="kt-t-mono"
                      style={{ border: "1px solid var(--line)", padding: "3px 10px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}
                    >
                      {formatDepartment(result.intern.department)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Calendar size={15} style={{ color: "var(--ink-mute)", flexShrink: 0 }} />
                    <span style={{ color: "var(--ink-mute)" }}>Period:</span>
                    <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                      {new Date(result.intern.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      {" — "}
                      {result.intern.end_date
                        ? new Date(result.intern.end_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                        : "Present"}
                    </span>
                  </div>

                  {result.intern.bio && (
                    <p style={{ borderTop: "1px solid var(--line)", paddingTop: 14, color: "var(--ink-soft)" }}>{result.intern.bio}</p>
                  )}

                  {result.intern.skills && result.intern.skills.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 6 }}>
                      {result.intern.skills.map((skill) => (
                        <span key={skill} className="kt-t-mono" style={{ border: "1px solid var(--line)", padding: "4px 10px", fontSize: 11 }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 18, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                    {result.intern.github_url && (
                      <a href={result.intern.github_url} target="_blank" rel="noopener noreferrer" className="kt-t-mono" style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--ink-mute)" }}>
                        GitHub <ExternalLink size={11} />
                      </a>
                    )}
                    {result.intern.linkedin_url && (
                      <a href={result.intern.linkedin_url} target="_blank" rel="noopener noreferrer" className="kt-t-mono" style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--ink-mute)" }}>
                        LinkedIn <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>

                <Link href={`/intern/${result.intern.intern_id}`} className="kt-link-arrow" style={{ marginTop: 22, display: "inline-flex" }}>
                  View full profile
                </Link>
              </div>
            </KtReveal>

            <KtReveal as="article" index={2} className="kt-cell">
              <div style={{ border: "1px solid var(--line)", background: "var(--sf-1)", padding: "clamp(24px,2.6vw,36px)", height: "100%", display: "flex", flexDirection: "column" }}>
                <h3 className="kt-t-mono" style={{ textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-mute)", marginBottom: 22 }}>
                  Certificate details
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="kt-t-small">
                  <div>
                    <span style={{ color: "var(--ink-mute)" }}>Title:</span>{" "}
                    <span style={{ color: "var(--ink)", fontWeight: 500 }}>{result.certificate.title}</span>
                  </div>
                  {result.certificate.description && (
                    <div>
                      <span style={{ color: "var(--ink-mute)" }}>Description:</span>{" "}
                      <span style={{ color: "var(--ink)" }}>{result.certificate.description}</span>
                    </div>
                  )}
                  <div>
                    <span style={{ color: "var(--ink-mute)" }}>Issued:</span>{" "}
                    <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                      {new Date(result.certificate.issued_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  {result.certificate.valid_until && (
                    <div>
                      <span style={{ color: "var(--ink-mute)" }}>Valid until:</span>{" "}
                      <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                        {new Date(result.certificate.valid_until).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                  )}
                </div>

                {result.certificate.qr_code_url && (
                  <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.certificate.qr_code_url}
                      alt={`QR Code for certificate ${certificateId}`}
                      style={{ height: 160, width: 160, border: "1px solid var(--line)" }}
                    />
                    <p className="kt-t-mono" style={{ marginTop: 10, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 10, color: "var(--ink-mute)" }}>
                      Scan to verify
                    </p>
                  </div>
                )}
              </div>
            </KtReveal>
          </div>
        )}

        {result.contributions.length > 0 && (
          <KtReveal as="div" index={3} style={{ border: "1px solid var(--line)", background: "var(--sf-1)", padding: "clamp(24px,2.6vw,36px)" }}>
            <h3 className="kt-t-mono" style={{ textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ink-mute)", marginBottom: 22 }}>
              Project contributions
            </h3>
            <div>
              {result.contributions.map((contrib, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    padding: "16px 0",
                    borderTop: idx > 0 ? "1px solid var(--line)" : undefined,
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <p style={{ color: "var(--ink)", fontWeight: 500 }}>{contrib.project_title}</p>
                    <span className="kt-t-mono" style={{ border: "1px solid var(--line)", padding: "3px 10px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {contrib.role}
                    </span>
                  </div>
                  {contrib.contribution_summary && <p className="kt-t-small">{contrib.contribution_summary}</p>}
                </div>
              ))}
            </div>
          </KtReveal>
        )}

        {result.status === "not_found" && (
          <KtReveal as="div" style={{ padding: "48px 0", textAlign: "center" }}>
            <p className="kt-t-body" style={{ marginBottom: 20 }}>
              No certificate found with ID <strong style={{ color: "var(--ink)" }}>{certificateId}</strong>.
            </p>
            <p className="kt-t-small" style={{ marginBottom: 28 }}>
              Please double-check the certificate ID and try again. If you believe this is an error, contact
              KaiketsuTech support.
            </p>
            <Link href="/verify" className="kt-pill" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <ArrowLeft size={16} /> Try again
            </Link>
          </KtReveal>
        )}
      </div>
    </section>
  );
}
