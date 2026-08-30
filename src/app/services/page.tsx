import type { Metadata } from "next";
import Link from "next/link";
import { KtPageHead } from "@/components/marketing/kt/KtPageHead";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtRevealLink } from "@/components/marketing/kt/KtRevealLink";
import { KtCtaSection } from "@/components/marketing/kt/KtCtaSection";
import { KtCell } from "@/components/marketing/kt/KtCell";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, custom software, AI-driven solutions, and the MLOps/DevOps foundation to run them reliably.",
};

const capabilities = [
  {
    title: "Web Development",
    description:
      "High-performance web applications built on modern frameworks — optimized for speed, and built to actually stay maintainable.",
    href: "/contact?subject=software",
  },
  {
    title: "Custom Software & MVPs",
    description:
      "Full applications beyond a templated site — multi-role platforms, internal tools, and first versions built to validate an idea fast.",
    href: "/contact?subject=software",
  },
  {
    title: "AI-Driven Solutions",
    description:
      "Assistants grounded in your own data, and custom model features bolted onto existing products — built on established APIs, not hype.",
    href: "/contact?subject=software",
  },
  {
    title: "MLOps & Infrastructure",
    description:
      "Model registries, versioned pipelines, and drift monitoring for ML systems that need to keep working after the demo.",
    href: "/contact?subject=infrastructure",
  },
  {
    title: "DevOps & Cloud",
    description:
      "CI/CD ownership, infrastructure-as-code, and cloud cost review — the operational discipline behind a system that doesn’t page you at 2am.",
    href: "/contact?subject=infrastructure",
  },
  {
    title: "Technical Consulting",
    description:
      "Architecture review and technical due diligence for teams that need a second, independent set of eyes before they commit.",
    href: "/contact?subject=consulting",
  },
];

const benefits = [
  { title: "Repo access day one", desc: "You're a collaborator on the actual repository from the first commit, not a spectator waiting for a reveal." },
  { title: "Weekly demos", desc: "A working build, shown against a live environment, every week — not a status update slide." },
  { title: "Written handover", desc: "Documentation for the next engineer, whether that's you, your team, or whoever we hand off to." },
  { title: "Two weeks post-launch", desc: "We stay on past launch at no extra cost, because that's when things actually break." },
];

export default function Services() {
  return (
    <>
      <KtPageHead
        eyebrow="Services"
        imageSrc="/images/banners/services_banner.jpg"
        title={
          <>
            Precision engineered
            <br />
            solutions.
          </>
        }
        lede="From a five-page website to the MLOps foundation running a production model — scoped and built by the people who'll actually maintain it."
      />

      <section className="kt-section kt-s--light">
        <div className="kt-wrap">
          <div className="kt-steps">
            {capabilities.map((cap, i) => (
              <KtReveal as="div" key={cap.title} index={i} className="kt-step">
                <p className="kt-t-mono">{String(i + 1).padStart(2, "0")}</p>
                <div>
                  <h3 className="kt-t-h3">{cap.title}</h3>
                  <p className="kt-t-small" style={{ marginTop: 8 }}>
                    {cap.description}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
                  <Link className="kt-link-arrow" href={cap.href}>
                    View details
                  </Link>
                </div>
              </KtReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="kt-section">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                What you always get
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2">
                Same process, every engagement.
              </KtReveal>
            </div>
            <KtRevealLink index={2} className="kt-link-arrow" href="/pricing">
              See pricing
            </KtRevealLink>
          </div>
          <div className="kt-grid kt-grid-4">
            {benefits.map((b, i) => (
              <KtReveal as="article" key={b.title} index={i}>
                <KtCell theme="dark">
                  <h3 className="kt-t-h3">{b.title}</h3>
                  <p className="kt-t-small">{b.desc}</p>
                </KtCell>
              </KtReveal>
            ))}
          </div>
        </div>
      </section>

      <KtCtaSection
        title="Not sure which of these you need?"
        body="Tell us what you're building and we'll tell you honestly which of these actually applies — sometimes it's fewer than you'd think."
        primary={{ href: "/contact", label: "Talk to us" }}
        secondary={{ href: "/pricing", label: "View pricing" }}
      />
    </>
  );
}
