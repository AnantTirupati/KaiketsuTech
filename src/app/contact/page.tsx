"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import { KtPageHead } from "@/components/marketing/kt/KtPageHead";
import { KtReveal } from "@/components/marketing/kt/KtReveal";
import { KtCtaSection } from "@/components/marketing/kt/KtCtaSection";
import { KtCell } from "@/components/marketing/kt/KtCell";

const trustPoints = [
  {
    idx: "Response time",
    title: "Two working days",
    desc: "Every enquiry gets a real reply from a person, including the ones we turn down.",
  },
  {
    idx: "First call",
    title: "Thirty minutes",
    desc: "With the engineers who would actually build it, not a salesperson.",
  },
  {
    idx: "Quote",
    title: "Fixed and written",
    desc: "A scope document and a number you can hold us to before anything starts.",
  },
];

const faqs = [
  {
    question: "What is your typical engagement model?",
    answer:
      "We favor long-term, embedded partnerships. Following an initial architectural audit, we integrate directly with your existing technical leadership to execute defined milestones via agile sprints.",
  },
  {
    question: "Do you handle legacy system modernization?",
    answer:
      "Yes. A significant portion of our portfolio involves strangler fig patterns and gradual refactoring of monolithic architectures into highly available, distributed microservices using modern container orchestration.",
  },
  {
    question: "What is your baseline security compliance?",
    answer:
      "All deliverables are engineered to meet or exceed SOC 2 Type II and ISO 27001 standards. Security protocols, including automated vulnerability scanning and penetration testing, are integrated into our CI/CD pipelines.",
  },
];

function ContactContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject") || "";

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    subject: initialSubject,
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    if (initialSubject) {
      setFormData((prev) => ({ ...prev, subject: initialSubject }));
    }
  }, [initialSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast("Please fill in all required fields.", "warning");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from("contact_inquiries").insert({
        full_name: formData.name,
        organization: formData.company || null,
        email: formData.email,
        subject: formData.subject || null,
        message: formData.message,
      });

      if (error) throw error;

      toast("Your inquiry has been submitted successfully. Our engineering team will contact you shortly.", "success");
      setFormData({
        name: "",
        company: "",
        email: "",
        subject: "",
        message: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast(err.message || "Failed to submit inquiry. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <KtPageHead
        eyebrow="Contact"
        imageSrc="/images/banners/services_banner.jpg"
        title={
          <>
            Tell us what
            <br />
            you&rsquo;re building.
          </>
        }
        lede="One paragraph is enough to start. We reply within two working days with a scope and a number, or an honest reason we're not the right crew for it."
      />

      <section className="kt-section kt-s--light">
        <div className="kt-wrap">
          <KtReveal as="form" onSubmit={handleSubmit} className="kt-form">
            <div className="kt-field">
              <label className="kt-t-mono" htmlFor="f-name">
                Your name
              </label>
              <input
                id="f-name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="kt-field">
              <label className="kt-t-mono" htmlFor="f-email">
                Email
              </label>
              <input
                id="f-email"
                name="email"
                type="email"
                placeholder="jane@company.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="kt-field">
              <label className="kt-t-mono" htmlFor="f-org">
                Organisation
              </label>
              <input
                id="f-org"
                name="org"
                type="text"
                placeholder="Optional"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div className="kt-field">
              <label className="kt-t-mono" htmlFor="f-type">
                What kind of work
              </label>
              <select
                id="f-type"
                name="type"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="" disabled>
                  Select an area of interest…
                </option>
                <option value="infrastructure">Infrastructure scaling</option>
                <option value="software">Custom software development</option>
                <option value="consulting">Technical consulting</option>
                <option value="other">Other inquiry</option>
              </select>
            </div>
            <div className="kt-field kt-field--full">
              <label className="kt-t-mono" htmlFor="f-msg">
                What are you building
              </label>
              <textarea
                id="f-msg"
                name="message"
                placeholder="What it is, who it is for, and roughly when you need it."
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <div
              className="kt-field kt-field--full"
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}
            >
              <p className="kt-t-small" style={{ margin: 0 }}>
                Or email{" "}
                <a href="mailto:hello@kaiketsutech.online" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                  hello@kaiketsutech.online
                </a>{" "}
                / <a href="mailto:support@kaiketsutech.online" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                  support@kaiketsutech.online
                </a>{" "}
                / <a href="tel:+917467831005" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                  +91 7467831005
                </a>
              </p>
              <button className="kt-pill" type="submit" disabled={submitting} style={{ opacity: submitting ? 0.5 : 1 }}>
                {submitting ? "Sending…" : "Send it"}
              </button>
            </div>
          </KtReveal>
        </div>
      </section>

      <section className="kt-section">
        <div className="kt-wrap">
          <div className="kt-grid kt-grid-3">
            {trustPoints.map((t, i) => (
              <KtReveal as="article" key={t.idx} index={i}>
                <KtCell theme="dark">
                  <p className="kt-t-mono">{t.idx}</p>
                  <h3 className="kt-t-h3">{t.title}</h3>
                  <p className="kt-t-small">{t.desc}</p>
                </KtCell>
              </KtReveal>
            ))}
          </div>
        </div>

        <div className="kt-wrap" style={{ marginTop: "clamp(48px,6vw,88px)" }}>
          <div className="kt-sec-head">
            <div>
              <KtReveal as="p" className="kt-t-mono kt-eyebrow">
                FAQ
              </KtReveal>
              <KtReveal as="h2" index={1} className="kt-t-h2">
                Operational protocol.
              </KtReveal>
            </div>
            <KtReveal as="p" index={2} className="kt-t-body kt-lede">
              Common questions about our engagement models and technical process.
            </KtReveal>
          </div>
          <div className="kt-steps">
            {faqs.map((faq, i) => {
              const open = activeFaq === i;
              return (
                <KtReveal
                  as="div"
                  key={faq.question}
                  index={i}
                  className="kt-step"
                  style={{ cursor: "pointer", gridTemplateColumns: "1fr auto" }}
                  onClick={() => setActiveFaq(open ? null : i)}
                >
                  <div>
                    <h3 className="kt-t-h3">{faq.question}</h3>
                    {open && (
                      <p className="kt-t-small" style={{ marginTop: 12 }}>
                        {faq.answer}
                      </p>
                    )}
                  </div>
                  <p className="kt-t-mono" aria-hidden="true">
                    {open ? "−" : "+"}
                  </p>
                </KtReveal>
              );
            })}
          </div>
        </div>
      </section>

      <KtCtaSection
        title="Or just read the work first."
        body="Recent builds, what they run on, and what we'd do differently now."
        primary={{ href: "/showcase", label: "See the work" }}
        secondary={{ href: "/pricing", label: "See pricing" }}
        variant="light"
      />
    </>
  );
}

export default function Contact() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", minHeight: "60vh", alignItems: "center", justifyContent: "center" }} className="kt-t-mono">
          Loading contact configuration…
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
