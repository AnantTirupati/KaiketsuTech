'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { User, Calendar, Code, ExternalLink, Award, ArrowLeft, Briefcase, Globe, Download, FileText } from 'lucide-react'

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

export default function InternProfileClient({ data }: { data: InternData }) {
  const { intern, contributions, certificates, application } = data
  const profile = intern.profiles
  const name = profile?.full_name || 'KaiketsuTech Intern'

  const formatDepartment = (dept: string) => {
    if (dept.toLowerCase() === 'management') return 'Management Intern'
    return dept
  }

  return (
    <div className="bg-background text-on-surface antialiased overflow-x-hidden min-h-screen">
      <main className="flex-grow pt-32 pb-section-gap flex flex-col gap-8 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Back link */}
        <Link href="/verify" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-body-md">
          <ArrowLeft size={16} /> Back to Verification
        </Link>

        {/* Profile Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#111111] border border-[#222222] rounded-xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start"
        >
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-primary-container/10 border-2 border-primary-container/30 flex items-center justify-center text-primary shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={40} />
            )}
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface mb-1">{name}</h1>
                <p className="font-mono-sm text-xs text-primary uppercase tracking-widest mb-3">{intern.intern_id}</p>
                <div className="flex flex-wrap gap-3 items-center text-sm">
                  <span className="flex items-center gap-1.5 text-on-surface-variant">
                    <Code size={14} />
                    <span className={`px-2.5 py-1 rounded text-xs font-mono-sm font-semibold uppercase tracking-wider ${
                      intern.department === 'engineering' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      intern.department === 'design' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      intern.department === 'marketing' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' :
                      intern.department === 'operations' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      intern.department === 'management' ? 'bg-primary-container/10 text-primary border border-primary-container/20' :
                      'bg-outline-variant/10 text-on-surface border border-outline-variant/20'
                    }`}>
                      {formatDepartment(intern.department)}
                    </span>
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="flex items-center gap-1.5 text-on-surface-variant">
                    <Calendar size={14} />
                    {new Date(intern.start_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    {' — '}
                    {intern.end_date
                      ? new Date(intern.end_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                      : 'Present'}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`px-4 py-1.5 rounded-full text-xs font-mono-sm uppercase tracking-widest border shrink-0 ${
                intern.status === 'active'
                  ? 'bg-green-500/10 text-[#4ade80] border-green-500/20'
                  : intern.status === 'completed'
                    ? 'bg-primary-container/10 text-primary border-primary-container/20'
                    : 'bg-[#222] text-on-surface-variant border-[#333]'
              }`}>
                {intern.status}
              </div>
            </div>

            {/* Bio */}
            {intern.bio && (
              <p className="text-on-surface-variant text-sm mt-6 leading-relaxed max-w-2xl">
                {intern.bio}
              </p>
            )}

            {/* Skills */}
            {intern.skills && intern.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {intern.skills.map((skill: string) => (
                  <span key={skill} className="bg-[#222222] text-on-surface px-3 py-1 rounded text-xs font-mono-sm border border-[#333333]">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Social Links */}
            <div className="flex gap-4 mt-6 pt-6 border-t border-[#222222]">
              {intern.github_url && (
                <a href={intern.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  GitHub
                </a>
              )}
              {intern.linkedin_url && (
                <a href={intern.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
              {intern.portfolio_url && (
                <a href={intern.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-sm">
                  <Globe size={16} /> Portfolio
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Application Details */}
        {application && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#111111] border border-[#222222] rounded-xl p-8 space-y-6"
          >
            <h2 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest flex items-center gap-2 border-b border-[#222222] pb-4">
              <FileText size={14} className="text-primary" /> Application Credentials & Background
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Metrics and Document */}
              <div className="space-y-4">
                {application.phone && (
                  <div>
                    <span className="text-xs text-on-surface-variant font-mono-sm uppercase tracking-wider block mb-1">Contact Phone</span>
                    <span className="text-sm text-on-surface">{application.phone}</span>
                  </div>
                )}
                {application.created_at && (
                  <div>
                    <span className="text-xs text-on-surface-variant font-mono-sm uppercase tracking-wider block mb-1">Applied On</span>
                    <span className="text-sm text-on-surface">
                      {new Date(application.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
                {application.technologies && (
                  <div>
                    <span className="text-xs text-on-surface-variant font-mono-sm uppercase tracking-wider block mb-1">Technologies Declared</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {application.technologies.split(',').map((tech: string) => (
                        <span key={tech} className="bg-[#1a1a1a] text-on-surface-variant border border-[#222] px-2 py-0.5 rounded text-[10px] font-mono-sm">
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
                      className="inline-flex items-center gap-2 bg-[#222222] hover:bg-[#2a2a2a] border border-[#333333] hover:border-primary/50 text-on-surface text-xs font-semibold px-4 py-2.5 rounded transition-all cursor-pointer"
                    >
                      <Download size={14} className="text-primary" /> Download Submitted Resume
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: Prior Experience */}
              {application.experience && (
                <div>
                  <span className="text-xs text-on-surface-variant font-mono-sm uppercase tracking-wider block mb-1">Prior Experience</span>
                  <div className="bg-[#1a1a1a] border border-[#222] p-4 rounded-lg text-sm leading-relaxed text-on-surface-variant max-h-[220px] overflow-y-auto whitespace-pre-line">
                    {application.experience}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Project Contributions */}
        {contributions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-4 flex items-center gap-2">
              <Briefcase size={14} /> Project Contributions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {contributions.map((contrib, idx) => (
                <div key={idx} className="bg-[#111111] border border-[#222222] rounded-lg p-6 group hover:border-primary-container/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-headline-lg text-lg font-semibold text-on-surface">{contrib.projects?.title || 'Project'}</h3>
                    <span className="bg-primary-container/10 text-primary px-3 py-0.5 rounded text-[10px] font-mono-sm uppercase tracking-widest">
                      {contrib.role}
                    </span>
                  </div>
                  {contrib.projects?.description && (
                    <p className="text-on-surface-variant text-sm mb-3 line-clamp-2">{contrib.projects.description}</p>
                  )}
                  {contrib.contribution_summary && (
                    <p className="text-on-surface text-sm border-t border-[#222222] pt-3 mt-3">
                      {contrib.contribution_summary}
                    </p>
                  )}
                  {contrib.projects?.showcase_tags && contrib.projects.showcase_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {contrib.projects.showcase_tags.map((tag: string) => (
                        <span key={tag} className="bg-[#1a1a1a] text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-mono-sm">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-4 flex items-center gap-2">
              <Award size={14} /> Certificates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {certificates.map((cert) => (
                <Link
                  key={cert.certificate_id}
                  href={`/verify/${cert.certificate_id}`}
                  className="bg-[#111111] border border-[#222222] rounded-lg p-6 group hover:border-primary-container/30 transition-colors block"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Award size={20} className="text-primary" />
                    <span className="font-mono-sm text-xs text-primary uppercase tracking-widest">{cert.certificate_id}</span>
                  </div>
                  <h3 className="font-headline-lg text-base font-semibold text-on-surface mb-2">{cert.title}</h3>
                  {cert.description && (
                    <p className="text-on-surface-variant text-sm line-clamp-2 mb-3">{cert.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span>
                      {cert.issued_at
                        ? new Date(cert.issued_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                        : ''}
                    </span>
                    <span className="flex items-center gap-1 text-primary group-hover:underline">
                      Verify <ExternalLink size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
