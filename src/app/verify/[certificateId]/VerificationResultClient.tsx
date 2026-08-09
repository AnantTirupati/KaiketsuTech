'use client'

import Link from 'next/link'
import { ShieldCheck, ShieldX, Clock, User, Calendar, Code, ArrowLeft, ExternalLink } from 'lucide-react'
import type { VerificationResult } from '@/types/intern.types'
import Reveal from '@/components/marketing/Reveal'

interface Props {
  result: VerificationResult
  certificateId: string
}

const DEPARTMENT_STYLES: Record<string, string> = {
  engineering: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  design: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  marketing: 'border-pink-500/30 bg-pink-500/10 text-pink-400',
  operations: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  management: 'border-marketing-accent/30 bg-marketing-accent/10 text-marketing-accent',
}

export default function VerificationResultClient({ result, certificateId }: Props) {
  const statusConfig = {
    active: { icon: <ShieldCheck size={40} />, color: 'text-marketing-accent', bg: 'bg-marketing-accent/10', border: 'border-marketing-accent/30', label: 'Verified' },
    revoked: { icon: <ShieldX size={40} />, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Revoked' },
    expired: { icon: <Clock size={40} />, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Expired' },
    not_found: { icon: <ShieldX size={40} />, color: 'text-marketing-muted-dim', bg: 'bg-marketing-bg-raised', border: 'border-marketing-border', label: 'Not found' },
  }

  const config = statusConfig[result.status]

  const formatDepartment = (dept: string) => (dept.toLowerCase() === 'management' ? 'Management Intern' : dept)

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-10 px-[6vw] pb-[10vh] pt-[12vh]">
      <Link href="/verify" className="flex items-center gap-2 text-sm text-marketing-muted-dim transition-colors hover:text-marketing-accent">
        <ArrowLeft size={16} /> Back to verification portal
      </Link>

      <Reveal className={`${config.bg} ${config.border} border p-8 text-center md:p-12`}>
        <div className={`${config.color} mb-5 flex justify-center`}>{config.icon}</div>
        <p className={`font-marketing-mono text-xs uppercase tracking-widest ${config.color} mb-2`}>{config.label}</p>
        <h1 className="mb-4 font-marketing-sans text-3xl font-bold text-marketing-fg md:text-5xl">{certificateId}</h1>
        {result.certificate && (
          <p className="mx-auto max-w-xl text-lg text-marketing-muted">{result.certificate.title}</p>
        )}
        {result.status === 'revoked' && result.certificate?.revoked_reason && (
          <p className="mt-4 text-sm text-red-400/80">Reason: {result.certificate.revoked_reason}</p>
        )}
      </Reveal>

      {result.intern && result.certificate && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal delay={0.1} className="border border-marketing-border bg-marketing-bg-raised p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center border border-marketing-border text-marketing-accent">
                <User size={24} />
              </div>
              <div>
                <h2 className="font-marketing-sans text-xl font-semibold text-marketing-fg">
                  {result.intern.name || 'KaiketsuTech Intern'}
                </h2>
                <p className="font-marketing-mono text-xs uppercase tracking-widest text-marketing-accent">
                  {result.intern.intern_id}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-center gap-3">
                <Code size={16} className="shrink-0 text-marketing-muted-dim" />
                <span className="text-marketing-muted">Department:</span>
                <span
                  className={`border px-2 py-0.5 font-marketing-mono text-[10px] font-semibold uppercase tracking-wider ${
                    DEPARTMENT_STYLES[result.intern.department] ||
                    'border-marketing-border bg-marketing-bg text-marketing-fg'
                  }`}
                >
                  {formatDepartment(result.intern.department)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="shrink-0 text-marketing-muted-dim" />
                <span className="text-marketing-muted">Period:</span>
                <span className="font-semibold text-marketing-fg">
                  {new Date(result.intern.start_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  {' — '}
                  {result.intern.end_date
                    ? new Date(result.intern.end_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                    : 'Present'}
                </span>
              </div>

              {result.intern.bio && (
                <p className="border-t border-marketing-border pt-4 text-marketing-muted">{result.intern.bio}</p>
              )}

              {result.intern.skills && result.intern.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {result.intern.skills.map((skill) => (
                    <span key={skill} className="border border-marketing-border px-2.5 py-1 font-marketing-mono text-xs text-marketing-muted-dim">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-4 border-t border-marketing-border pt-4">
                {result.intern.github_url && (
                  <a href={result.intern.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-marketing-muted-dim transition-colors hover:text-marketing-accent">
                    GitHub <ExternalLink size={12} />
                  </a>
                )}
                {result.intern.linkedin_url && (
                  <a href={result.intern.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-marketing-muted-dim transition-colors hover:text-marketing-accent">
                    LinkedIn <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>

            <Link
              href={`/intern/${result.intern.intern_id}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-marketing-accent hover:underline"
            >
              View full profile <ExternalLink size={14} />
            </Link>
          </Reveal>

          <Reveal delay={0.15} className="flex flex-col border border-marketing-border bg-marketing-bg-raised p-8">
            <h3 className="mb-6 font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">
              Certificate details
            </h3>

            <div className="flex-grow flex-col gap-4 text-sm [&>div]:mb-4">
              <div>
                <span className="text-marketing-muted">Title:</span>{' '}
                <span className="font-semibold text-marketing-fg">{result.certificate.title}</span>
              </div>
              {result.certificate.description && (
                <div>
                  <span className="text-marketing-muted">Description:</span>{' '}
                  <span className="text-marketing-fg">{result.certificate.description}</span>
                </div>
              )}
              <div>
                <span className="text-marketing-muted">Issued:</span>{' '}
                <span className="font-semibold text-marketing-fg">
                  {new Date(result.certificate.issued_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              {result.certificate.valid_until && (
                <div>
                  <span className="text-marketing-muted">Valid until:</span>{' '}
                  <span className="font-semibold text-marketing-fg">
                    {new Date(result.certificate.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>

            {result.certificate.qr_code_url && (
              <div className="mt-8 flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.certificate.qr_code_url}
                  alt={`QR Code for certificate ${certificateId}`}
                  className="h-40 w-40 border border-marketing-border"
                />
                <p className="mt-3 font-marketing-mono text-[10px] uppercase tracking-widest text-marketing-muted-dim">
                  Scan to verify
                </p>
              </div>
            )}
          </Reveal>
        </div>
      )}

      {result.contributions.length > 0 && (
        <Reveal delay={0.2} className="border border-marketing-border bg-marketing-bg-raised p-8">
          <h3 className="mb-6 font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">
            Project contributions
          </h3>
          <div className="divide-y divide-marketing-border">
            {result.contributions.map((contrib, idx) => (
              <div key={idx} className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-marketing-fg">{contrib.project_title}</p>
                  {contrib.contribution_summary && (
                    <p className="mt-1 text-sm text-marketing-muted">{contrib.contribution_summary}</p>
                  )}
                </div>
                <span className="w-fit shrink-0 border border-marketing-border px-3 py-1 font-marketing-mono text-[10px] uppercase tracking-widest text-marketing-accent">
                  {contrib.role}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {result.status === 'not_found' && (
        <Reveal className="py-12 text-center">
          <p className="mb-6 text-lg text-marketing-muted">
            No certificate found with ID <strong className="text-marketing-fg">{certificateId}</strong>.
          </p>
          <p className="mb-8 text-sm text-marketing-muted">
            Please double-check the certificate ID and try again. If you believe this is an error,
            contact KaiketsuTech support.
          </p>
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 bg-marketing-accent px-8 py-3 text-sm font-semibold text-marketing-accent-ink transition-colors hover:bg-marketing-fg"
          >
            <ArrowLeft size={16} /> Try again
          </Link>
        </Reveal>
      )}
    </section>
  )
}
