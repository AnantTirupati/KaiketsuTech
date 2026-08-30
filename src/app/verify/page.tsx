"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search, ArrowRight, QrCode } from "lucide-react";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtCell } from "@/components/marketing/kt/KtCell";
import StarfieldButton from "@/components/marketing/StarfieldButton";
import RadialRevealButton from "@/components/marketing/RadialRevealButton";

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

  const handleVerify = (e: React.FormEvent | React.MouseEvent) => {
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
        <div className="kt-pagehead-field" aria-hidden="true" style={{ opacity: 1 }}>
          <img src="/images/banners/verify_banner.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />
        </div>
        <div className="kt-wrap kt-pagehead-in" style={{ textAlign: "center", alignItems: "center" }}>
          <KtReveal as="h1" index={2} className="kt-t-h1">
            Verify a certificate.
          </KtReveal>
          <KtReveal as="p" index={3} className="kt-t-body kt-lede" style={{ margin: "22px auto 0" }}>
            Confirm the authenticity of a KaiketsuTech internship certificate. Enter the Certificate ID printed on
            the document or scan the QR code.
          </KtReveal>

          <KtReveal as="form" index={4} onSubmit={handleVerify} style={{ marginTop: 40, width: "100%", maxWidth: 600, marginInline: "auto" }}>
            <div style={{ display: "flex", flexWrap: "nowrap", gap: 12, alignItems: "center", justifyContent: "center" }}>
              <StarfieldButton as="div" padding="0" 
                colors={{ fill: "rgba(255, 255, 255, 0.08)" }} 
                border={{ borderColor: "rgba(255, 255, 255, 0.25)", borderWidth: 1, borderStyle: "solid" }} 
                stroke={{ color: "rgba(255, 255, 255, 0.8)" }}
                pixel={{ density: 0 }} 
                rounded={100}
                style={{ position: "relative", flex: "1 1 auto", borderRadius: 999, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)" }}>
                <Search
                  size={18}
                  style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "rgba(255, 255, 255, 0.6)", zIndex: 10 }}
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
                    background: "transparent",
                    color: "#ffffff",
                    fontSize: 14,
                    outline: "none",
                    height: 52,
                    padding: "0 24px 0 46px",
                    border: "none",
                    position: "relative",
                    zIndex: 5
                  }}
                />
              </StarfieldButton>
              <div style={{ display: "flex", flex: "none" }}>
                <RadialRevealButton 
                  type="submit" 
                  label="Verify"
                  showText={true}
                  addIcon={false}
                  padding="0 36px"
                  colors={{ fill: "#050505", textColor: "#fafafa" }}
                  hover={{ fill: "#fafafa", textColor: "#050505" }}
                  border={{ borderColor: "rgba(255, 255, 255, 0.1)", borderWidth: 1, borderStyle: "solid" }}
                  font={{ fontSize: 14, fontWeight: 500, fontFamily: "Inter" }}
                  style={{ height: 52, borderRadius: 999, justifyContent: "center" }}
                />
              </div>
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
