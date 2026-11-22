import type { Metadata } from "next";
import Link from "next/link";
import { KtPageHead } from "@/components/marketing/kt/KtPageHead";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtCell } from "@/components/marketing/kt/KtCell";
import { KtCtaSection } from "@/components/marketing/kt/KtCtaSection";

export const metadata: Metadata = {
  title: "Nova — voice assistant for desktop automation",
  description:
    "Nova is a voice assistant that runs on your own computer and automates desktop work, sending every request down the cheapest path that can complete it. Windows and Linux downloads are coming soon.",
};

const ladder = [
  { step: "01", title: "Instant command", body: "Simple requests such as the time or a quick recap are matched locally and run immediately.", cost: "Free" },
  { step: "02", title: "Saved automation", body: "Jobs you ask for repeatedly are saved as automations and run without calling any model.", cost: "Free" },
  { step: "03", title: "Free model", body: "Questions, lookups and clicking through web pages are handled by free hosted models.", cost: "Free tier" },
  { step: "04", title: "Premium model", body: "Only what the earlier steps cannot finish is passed to a paid model.", cost: "Paid" },
];

const features = [
  { title: "Voice first", body: "Speech recognition, speaker identification and the assistant's voice all run on your computer." },
  { title: "Learns your routines", body: "When you ask for the same job again and again, Nova offers to save it as an automation that costs nothing to run." },
  { title: "Shows its plan", body: "Every request is drawn as a plan graph, so you can see what Nova will do before and while it does it." },
  { title: "Controls your desktop and browser", body: "Opens applications, manages windows, plays media and operates web pages on your behalf." },
  { title: "Your phone as a remote", body: "Send requests to your computer from your phone over a private connection." },
  { title: "Tested", body: "1,165 automated tests cover the assistant, and the source is public." },
];

const platforms = [
  { name: "Windows", detail: "Windows 11" },
  { name: "Linux", detail: "Ubuntu (GNOME)" },
];

export default function NovaLandingPage() {
  return (
    <>
      <KtPageHead
        eyebrow="Our products · Voice assistant"
        imageSrc="/images/banners/showcase_banner.jpg"
        title={
          <>
            Nova.
            <br />
            Say it once. It handles the rest.
          </>
        }
        lede="A voice assistant that runs on your own computer, automates the work you repeat every day, and only pays for a premium model when nothing cheaper can do the job."
      />

      {/* Download */}
      <section className="kt-section kt-s--light" id="download">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                Download
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2">
                Coming soon.
              </KtReveal>
            </div>
            <KtReveal as="p" index={2} className="kt-t-body kt-lede">
              Nova currently runs on its author&rsquo;s own machines. Installers for Windows and Linux are in preparation
              and will be published here.
            </KtReveal>
          </div>
          <div className="kt-grid kt-grid-2">
            {platforms.map((p, i) => (
              <KtReveal as="article" key={p.name} index={i}>
                <KtCell theme="light">
                  <p className="kt-t-mono">{p.detail}</p>
                  <h3 className="kt-t-h3">{p.name}</h3>
                  <div style={{ marginTop: "auto", paddingTop: 12 }}>
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="kt-t-mono"
                      style={{
                        border: "1px solid var(--line)",
                        borderRadius: 999,
                        padding: "12px 22px",
                        color: "var(--ink-mute)",
                        background: "transparent",
                        cursor: "not-allowed",
                      }}
                    >
                      Download for {p.name} · Coming soon
                    </button>
                  </div>
                </KtCell>
              </KtReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="kt-section">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                How it works
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2" style={{ maxWidth: "20ch" }}>
                Every request takes the cheapest path.
              </KtReveal>
            </div>
            <KtReveal as="p" index={2} className="kt-t-body kt-lede">
              Nova tries each step in order and stops at the first one that can complete the request.
            </KtReveal>
          </div>
          <div className="kt-grid kt-grid-4">
            {ladder.map((l, i) => (
              <KtReveal as="article" key={l.step} index={i}>
                <KtCell theme="dark">
                  <p className="kt-t-mono">
                    {l.step} · {l.cost}
                  </p>
                  <h3 className="kt-t-h3">{l.title}</h3>
                  <p className="kt-t-small">{l.body}</p>
                </KtCell>
              </KtReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="kt-section kt-s--light">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                Features
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2">
                Built for daily desktop work.
              </KtReveal>
            </div>
          </div>
          <div className="kt-grid kt-grid-3">
            {features.map((f, i) => (
              <KtReveal as="article" key={f.title} index={i}>
                <KtCell theme="light">
                  <h3 className="kt-t-h3">{f.title}</h3>
                  <p className="kt-t-small">{f.body}</p>
                </KtCell>
              </KtReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Research */}
      <section className="kt-section">
        <div className="kt-wrap">
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                Published research
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2" style={{ maxWidth: "22ch" }}>
                Described in an engineering paper.
              </KtReveal>
            </div>
          </div>
          <KtReveal as="article" index={2}>
            <KtCell theme="dark">
              <p className="kt-t-mono">Preprint on Zenodo · DOI 10.5281/zenodo.24026001</p>
              <h3 className="kt-t-h3" style={{ maxWidth: "40ch" }}>
                Writing Itself Out of the Job: Design and Autobiographical Deployment of a Cost-Ordered,
                Self-Automating Desktop Voice Assistant
              </h3>
              <p className="kt-t-small" style={{ maxWidth: "70ch" }}>
                Aakshant Kumar. In a 30-day deployment, 70% of 185 requests never reached a paid model: 24% were
                answered by scripts and 46% by a free model alone. The paper also reports three measurement errors
                that inflated the apparent savings, and a port from Windows to Ubuntu on Wayland.
              </p>
              <div style={{ marginTop: "auto", paddingTop: 12, display: "flex", gap: 22, flexWrap: "wrap" }}>
                <a
                  href="https://zenodo.org/records/24026001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kt-link-arrow"
                  style={{ display: "inline-flex" }}
                >
                  Read the paper
                </a>
                <a
                  href="https://github.com/unexperiencedone/assistant-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kt-link-arrow"
                  style={{ display: "inline-flex" }}
                >
                  View the source
                </a>
              </div>
            </KtCell>
          </KtReveal>
        </div>
      </section>

      <KtCtaSection
        title="Want to be told when Nova is available?"
        body="Write to us and we will email you as soon as the Windows and Linux installers are ready."
        primary={{ href: "/contact?subject=nova", label: "Get notified" }}
        secondary={{ href: "/portfolio", label: "View portfolio" }}
      />

      <p className="kt-t-mono kt-wrap" style={{ color: "var(--ink-mute)", paddingBottom: 32 }}>
        &copy; 2026 KaiketsuTech. Nova is a KaiketsuTech product. All rights reserved.{" "}
        <Link href="/showcase" className="kt-link-arrow" style={{ display: "inline-flex" }}>
          All work
        </Link>
      </p>
    </>
  );
}
