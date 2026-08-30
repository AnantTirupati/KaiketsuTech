"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search, ArrowRight, QrCode } from "lucide-react";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtCell } from "@/components/marketing/kt/KtCell";

const steps = [
  {
    icon: <QrCode size={22} />,
    title: "Scan or enter ID",
    description: "Use the QR code on the certificate or type the Certificate ID shown on the document.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Instant verification",
    description: "Our system instantly checks the certificate against our secure database and validates its authenticity.",
  },
  {
    icon: <ArrowRight size={22} />,
    title: "View details",
    description: "See the intern's profile, department, internship period, and project contributions.",
  },
];

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = certificateId.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a certificate ID");
      return;
    }
    if (!trimmed.startsWith("KT-")) {
      setError("Certificate ID must start with KT-");
      return;
    }
    setError("");
    router.push(`/verify/${trimmed}`);
  };

  return (
    <>
      <section className="kt-pagehead">
        <div className="kt-pagehead-field" aria-hidden="true">
          <div className="kt-u-halftone" style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="kt-wrap kt-pagehead-in" style={{ textAlign: "center", alignItems: "center" }}>
          <KtReveal
            as="div"
            style={{
              display: "flex",
              height: 56,
              width: 56,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--line)",
              margin: "0 auto 22px",
              color: "var(--ink)",
            }}
          >
            <ShieldCheck size={26} />
          </KtReveal>
          <KtReveal as="p" index={1} className="kt-t-mono kt-eyebrow" style={{ justifyContent: "center" }}>
            Verify
          </KtReveal>
          <KtReveal as="h1" index={2} className="kt-t-h1">
            Verify a certificate.
          </KtReveal>
          <KtReveal as="p" index={3} className="kt-t-body kt-lede" style={{ margin: "22px auto 0" }}>
            Confirm the authenticity of a KaiketsuTech internship certificate. Enter the Certificate ID printed on
            the document or scan the QR code.
          </KtReveal>

          <KtReveal as="form" index={4} onSubmit={handleVerify} style={{ marginTop: 40, width: "100%", maxWidth: 560 }}>
            <div className="kt-verify-search">
              <Search
                size={18}
                style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--ink-mute)" }}
              />
              <input
                type="text"
                id="certificate-search"
                autoComplete="off"
                placeholder="Enter certificate ID (e.g. KT-A7F2-2606)"
                value={certificateId}
                onChange={(e) => {
                  setCertificateId(e.target.value);
                  setError("");
                }}
                style={{
                  width: "100%",
                  border: "1px solid var(--line)",
                  background: "var(--bg)",
                  color: "var(--ink)",
                  fontSize: 15,
                  outline: "none",
                }}
              />
              <button type="submit" className="kt-pill">
                Verify <ArrowRight size={14} style={{ marginLeft: 4 }} />
              </button>
            </div>
            {error && (
              <p className="kt-t-small" style={{ marginTop: 12, textAlign: "left", color: "var(--ink)" }}>
                {error}
              </p>
            )}
          </KtReveal>
        </div>
      </section>

      <section className="kt-section kt-s--light">
        <div className="kt-wrap">
          <div className="kt-grid kt-grid-3">
            {steps.map((step, i) => (
              <KtReveal as="article" key={step.title} index={i}>
                <KtCell theme="light">
                  <div
                    style={{
                      display: "flex",
                      height: 44,
                      width: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--line)",
                      color: "var(--ink)",
                    }}
                  >
                    {step.icon}
                  </div>
                  <h3 className="kt-t-h3" style={{ marginTop: 6 }}>
                    {step.title}
                  </h3>
                  <p className="kt-t-small">{step.description}</p>
                </KtCell>
              </KtReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="kt-section">
        <div className="kt-wrap">
          <KtReveal
            as="div"
            style={{ border: "1px solid var(--line)", background: "var(--sf-1)", padding: "clamp(32px,4vw,56px)", textAlign: "center" }}
          >
            <p className="kt-t-mono kt-eyebrow" style={{ justifyContent: "center" }}>
              Trusted verification
            </p>
            <p className="kt-t-body" style={{ maxWidth: "56ch", margin: "14px auto 0" }}>
              Each certificate is uniquely generated with a tamper-proof QR code linked to our secure verification
              system. All intern records are maintained with full audit trails.
            </p>
          </KtReveal>
        </div>
      </section>
    </>
  );
}
