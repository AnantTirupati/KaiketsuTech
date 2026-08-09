'use client'

import Link from 'next/link'
import { User, Calendar, Code, ExternalLink, Award, ArrowLeft, Briefcase, Globe, Download, FileText } from 'lucide-react'
import Reveal from '@/components/marketing/Reveal'

interface InternData {
  intern: Record<string, unknown> & {
    intern_id: string
    department: string
    start_date: string
    end_date: string | null
    status: string
    bio: string | null
    skills: string[] | null
    github_url: string | null
    linkedin_url: string | null
    portfolio_url: string | null
    profiles: {
      full_name: string | null
      email: string
      avatar_url: string | null
      rating: number | null
    } | null
  }
  contributions: Array<{
    role: string
    contribution_summary: string | null
    start_date: string | null
    end_date: string | null
    projects: {
      id: string
      title: string
      description: string | null
      status: string | null
      showcase_tags: string[] | null
    } | null
  }>
  certificates: Array<{
    certificate_id: string
    title: string
    description: string | null
    issued_at: string | null
    qr_code_url: string | null
    status: string
  }>
  application?: {
    phone: string | null
    experience: string | null
    skills: string | null
    technologies: string | null
    resume_url: string | null
    created_at: string | null
  } | null
}

const DEPARTMENT_STYLES: Record<string, string> = {
  engineering: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  design: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  marketing: 'border-pink-500/30 bg-pink-500/10 text-pink-400',
  operations: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  management: 'border-marketing-accent/30 bg-marketing-accent/10 text-marketing-accent',
}

const STATUS_STYLES: Record<string, string> = {
  active: 'border-marketing-accent/30 bg-marketing-accent/10 text-marketing-accent',
  completed: 'border-marketing-border-strong bg-marketing-bg text-marketing-fg',
}

export default function InternProfileClient({ data }: { data: InternData }) {
  const { intern, contributions, certificates, application } = data
  const profile = intern.profiles
  const name = profile?.full_name || 'KaiketsuTech Intern'

  const formatDepartment = (dept: string) => (dept.toLowerCase() === 'management' ? 'Management Intern' : dept)

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8 px-[6vw] pb-[10vh] pt-[12vh]">
      <Link href="/verify" className="flex items-center gap-2 text-sm text-marketing-muted-dim transition-colors hover:text-marketing-accent">
        <ArrowLeft size={16} /> Back to verification
      </Link>

      <Reveal className="flex flex-col items-start gap-8 border border-marketing-border bg-marketing-bg-raised p-8 md:flex-row md:p-12">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center border-2 border-marketing-accent/30 bg-marketing-accent/10 text-marketing-accent">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            <User size={40} />
          )}
        </div>

        <div className="flex-grow">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="mb-1 font-marketing-sans text-3xl font-bold text-marketing-fg md:text-4xl">{name}</h1>
              <p className="mb-3 font-marketing-mono text-xs uppercase tracking-widest text-marketing-accent">{intern.intern_id}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-marketing-muted">
                  <Code size={14} />
                  <span
                    className={`border px-2.5 py-1 font-marketing-mono text-xs font-semibold uppercase tracking-wider ${
                      DEPARTMENT_STYLES[intern.department] || 'border-marketing-border bg-marketing-bg text-marketing-fg'
                    }`}
                  >
                    {formatDepartment(intern.department)}
                  </span>
                </span>
                <span className="text-marketing-border-strong">•</span>
                <span className="flex items-center gap-1.5 text-marketing-muted">
                  <Calendar size={14} />
                  {new Date(intern.start_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  {' — '}
                  {intern.end_date
                    ? new Date(intern.end_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                    : 'Present'}
                </span>
              </div>
            </div>

            <div
              className={`w-fit shrink-0 border px-4 py-1.5 font-marketing-mono text-xs uppercase tracking-widest ${
                STATUS_STYLES[intern.status] || 'border-marketing-border bg-marketing-bg text-marketing-muted-dim'
              }`}
            >
              {intern.status}
            </div>
          </div>

          {intern.bio && (
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-marketing-muted">{intern.bio}</p>
          )}

          {intern.skills && intern.skills.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {intern.skills.map((skill: string) => (
                <span key={skill} className="border border-marketing-border px-2.5 py-1 font-marketing-mono text-xs text-marketing-muted-dim">
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-4 border-t border-marketing-border pt-6">
            {intern.github_url && (
              <a href={intern.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-marketing-muted-dim transition-colors hover:text-marketing-accent">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub
              </a>
            )}
            {intern.linkedin_url && (
              <a href={intern.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-marketing-muted-dim transition-colors hover:text-marketing-accent">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            )}
            {intern.portfolio_url && (
              <a href={intern.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-marketing-muted-dim transition-colors hover:text-marketing-accent">
                <Globe size={16} /> Portfolio
              </a>
            )}
          </div>
        </div>
      </Reveal>

      {application && (
        <Reveal delay={0.1} className="border border-marketing-border bg-marketing-bg-raised p-8">
          <h2 className="mb-6 flex items-center gap-2 border-b border-marketing-border pb-4 font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">
            <FileText size={14} className="text-marketing-accent" /> Application credentials &amp; background
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              {application.phone && (
                <div>
                  <span className="mb-1 block font-marketing-mono text-xs uppercase tracking-wider text-marketing-muted-dim">Contact phone</span>
                  <span className="text-sm text-marketing-fg">{application.phone}</span>
                </div>
              )}
              {application.created_at && (
                <div>
                  <span className="mb-1 block font-marketing-mono text-xs uppercase tracking-wider text-marketing-muted-dim">Applied on</span>
                  <span className="text-sm text-marketing-fg">
                    {new Date(application.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}
              {application.technologies && (
                <div>
                  <span className="mb-1 block font-marketing-mono text-xs uppercase tracking-wider text-marketing-muted-dim">Technologies declared</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {application.technologies.split(',').map((tech: string) => (
                      <span key={tech} className="border border-marketing-border px-2 py-0.5 font-marketing-mono text-[10px] text-marketing-muted-dim">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {application.resume_url && (
                <div className="pt-2">
                  <a
                    href={application.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-marketing-border px-4 py-2.5 text-xs font-semibold text-marketing-fg transition-colors hover:border-marketing-accent"
                  >
                    <Download size={14} className="text-marketing-accent" /> Download submitted resume
                  </a>
                </div>
              )}
            </div>

            {application.experience && (
              <div>
                <span className="mb-1 block font-marketing-mono text-xs uppercase tracking-wider text-marketing-muted-dim">Prior experience</span>
                <div className="max-h-[220px] overflow-y-auto whitespace-pre-line border border-marketing-border bg-marketing-bg p-4 text-sm leading-relaxed text-marketing-muted">
                  {application.experience}
                </div>
              </div>
            )}
          </div>
        </Reveal>
      )}

      {contributions.length > 0 && (
        <Reveal delay={0.15}>
          <h2 className="mb-4 flex items-center gap-2 font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">
            <Briefcase size={14} /> Project contributions
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {contributions.map((contrib, idx) => (
              <div key={idx} className="border border-marketing-border bg-marketing-bg-raised p-6 transition-colors hover:border-marketing-accent">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="font-marketing-sans text-lg font-semibold text-marketing-fg">{contrib.projects?.title || 'Project'}</h3>
                  <span className="shrink-0 border border-marketing-border px-3 py-0.5 font-marketing-mono text-[10px] uppercase tracking-widest text-marketing-accent">
                    {contrib.role}
                  </span>
                </div>
                {contrib.projects?.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-marketing-muted">{contrib.projects.description}</p>
                )}
                {contrib.contribution_summary && (
                  <p className="mt-3 border-t border-marketing-border pt-3 text-sm text-marketing-fg">
                    {contrib.contribution_summary}
                  </p>
                )}
                {contrib.projects?.showcase_tags && contrib.projects.showcase_tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {contrib.projects.showcase_tags.map((tag: string) => (
                      <span key={tag} className="border border-marketing-border px-2 py-0.5 font-marketing-mono text-[10px] text-marketing-muted-dim">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {certificates.length > 0 && (
        <Reveal delay={0.2}>
          <h2 className="mb-4 flex items-center gap-2 font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">
            <Award size={14} /> Certificates
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <Link
                key={cert.certificate_id}
                href={`/verify/${cert.certificate_id}`}
                className="group block border border-marketing-border bg-marketing-bg-raised p-6 transition-colors hover:border-marketing-accent"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Award size={18} className="text-marketing-accent" />
                  <span className="font-marketing-mono text-xs uppercase tracking-widest text-marketing-accent">{cert.certificate_id}</span>
                </div>
                <h3 className="mb-2 font-marketing-sans text-base font-semibold text-marketing-fg">{cert.title}</h3>
                {cert.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-marketing-muted">{cert.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-marketing-muted-dim">
                  <span>
                    {cert.issued_at
                      ? new Date(cert.issued_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                      : ''}
                  </span>
                  <span className="flex items-center gap-1 text-marketing-accent group-hover:underline">
                    Verify <ExternalLink size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      )}
    </section>
  )
}
