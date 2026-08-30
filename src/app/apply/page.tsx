"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft, Upload, FileText, Loader } from "lucide-react";
import { KtReveal } from "@/components/marketing/kt/KtReveal";

function ApplyFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [roleTitle, setRoleTitle] = useState("General Internship");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roleParam);
      if (isUuid) {
        supabase
          .from("job_postings")
          .select("title")
          .eq("id", roleParam)
          .single()
          .then(({ data }) => {
            if (data?.title) {
              // eslint-disable-next-line react-hooks/set-state-in-effect
              setRoleTitle(data.title);
            }
          });
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRoleTitle(roleParam.replace(/-/g, " "));
      }
    }
  }, [searchParams, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast("Resume file size must be under 5MB.", "warning");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !resumeFile) {
      toast("Please fill in Name, Email and upload a Resume.", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast("Please enter a valid email address.", "error");
      return;
    }

    setSubmitting(true);
    toast("Uploading resume and processing application...", "info");

    try {
      const fileExt = resumeFile.name.split(".").pop();
      const randomId = Math.random().toString(36).substring(2, 12);
      const resumePath = `${Date.now()}_${randomId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("resumes").upload(resumePath, resumeFile, {
        cacheControl: "3600",
        upsert: false,
      });

      if (uploadError) {
        throw new Error(`Resume upload failed: ${uploadError.message}`);
      }

      const { error: dbError } = await supabase.from("intern_applications").insert({
        full_name: fullName,
        email,
        phone,
        skills,
        technologies,
        experience,
        portfolio_url: portfolioUrl,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        resume_url: resumePath,
        status: "pending",
      });

      if (dbError) {
        throw dbError;
      }

      toast("Application submitted successfully! Our engineering team will review it.", "success");
      setTimeout(() => {
        router.push("/careers");
      }, 2500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast(err.message || "Failed to submit application. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 720, border: "1px solid var(--line)", background: "var(--sf-1)", padding: "clamp(28px,4vw,52px)" }}>
      <div style={{ marginBottom: 32, borderBottom: "1px solid var(--line)", paddingBottom: 22 }}>
        <h2 className="kt-t-h3">Internship application</h2>
        <p className="kt-t-small" style={{ marginTop: 6 }}>
          Applying for the <span style={{ color: "var(--ink)", textTransform: "capitalize" }}>{roleTitle}</span>{" "}
          track.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="kt-form">
        <div className="kt-field">
          <label className="kt-t-mono" htmlFor="a-name">
            Full name
          </label>
          <input id="a-name" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="kt-field">
          <label className="kt-t-mono" htmlFor="a-email">
            Email
          </label>
          <input id="a-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="kt-field">
          <label className="kt-t-mono" htmlFor="a-phone">
            Phone (optional)
          </label>
          <input id="a-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="kt-field">
          <label className="kt-t-mono" htmlFor="a-experience">
            Experience
          </label>
          <input
            id="a-experience"
            type="text"
            placeholder="Self-taught, 2 yrs production work…"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>

        <div className="kt-field kt-field--full">
          <label className="kt-t-mono" htmlFor="a-skills">
            Core skills
          </label>
          <input
            id="a-skills"
            type="text"
            placeholder="React, Node.js, SQL, TypeScript"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <div className="kt-field kt-field--full">
          <label className="kt-t-mono" htmlFor="a-tech">
            Technologies worked with
          </label>
          <input
            id="a-tech"
            type="text"
            placeholder="Next.js, Tailwind, Supabase"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
          />
        </div>

        <div className="kt-field">
          <label className="kt-t-mono" htmlFor="a-portfolio">
            Portfolio URL
          </label>
          <input id="a-portfolio" type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
        </div>
        <div className="kt-field">
          <label className="kt-t-mono" htmlFor="a-github">
            GitHub URL
          </label>
          <input id="a-github" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
        </div>
        <div className="kt-field kt-field--full">
          <label className="kt-t-mono" htmlFor="a-linkedin">
            LinkedIn URL
          </label>
          <input id="a-linkedin" type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
        </div>

        <div className="kt-field kt-field--full">
          <label className="kt-t-mono">Resume (PDF/Word, under 5MB) *</label>
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              border: "1px dashed var(--line)",
              padding: 28,
              textAlign: "center",
            }}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              required
              onChange={handleFileChange}
              style={{ position: "absolute", inset: 0, cursor: "pointer", opacity: 0 }}
            />
            {resumeFile ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink)" }}>
                <FileText size={22} />
                <span className="kt-t-small">
                  {resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--ink-mute)" }}>
                <Upload size={22} />
                <span className="kt-t-small">Drag and drop, or click to browse</span>
              </div>
            )}
          </div>
        </div>

        <div
          className="kt-field kt-field--full"
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}
        >
          <button type="submit" disabled={submitting} className="kt-pill" style={{ opacity: submitting ? 0.5 : 1, display: "flex", alignItems: "center", gap: 8 }}>
            {submitting ? <Loader className="animate-spin" size={16} /> : "Submit application"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <section
      className="kt-section"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "clamp(96px,12vh,160px)" }}
    >
      <div style={{ marginBottom: 28, width: "100%", maxWidth: 720 }}>
        <Link href="/careers" className="kt-t-mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12 }}>
          <ArrowLeft size={14} />
          Back to careers
        </Link>
      </div>

      <KtReveal as="div" style={{ width: "100%", maxWidth: 720, display: "flex", justifyContent: "center" }}>
        <Suspense
          fallback={
            <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", border: "1px solid var(--line)", background: "var(--sf-1)", padding: 48 }}>
              <Loader className="animate-spin" size={26} />
            </div>
          }
        >
          <ApplyFormContent />
        </Suspense>
      </KtReveal>
    </section>
  );
}
