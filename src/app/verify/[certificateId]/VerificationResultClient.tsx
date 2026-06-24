'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShieldCheck, ShieldX, Clock, User, Calendar, Code, ArrowLeft, ExternalLink } from 'lucide-react'
import type { VerificationResult } from '@/types/intern.types'

interface Props {
  result: VerificationResult
  certificateId: string
}

export default function VerificationResultClient({ result, certificateId }: Props) {
  const isValid = result.valid
  const statusConfig = {
    active: { icon: <ShieldCheck size={48} />, color: 'text-[#4ade80]', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'VERIFIED' },
    revoked: { icon: <ShieldX size={48} />, color: 'text-error', bg: 'bg-error-container/10', border: 'border-error-container/20', label: 'REVOKED' },
    expired: { icon: <Clock size={48} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'EXPIRED' },
    not_found: { icon: <ShieldX size={48} />, color: 'text-on-surface-variant', bg: 'bg-[#222]', border: 'border-[#333]', label: 'NOT FOUND' },
  }

  const config = statusConfig[result.status]

  return (
    <div className="bg-background text-on-surface antialiased overflow-x-hidden min-h-screen">
      <main className="flex-grow pt-32 pb-section-gap flex flex-col gap-12 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Back link */}
        <Link href="/verify" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-body-md">
          <ArrowLeft size={16} /> Back to Verification Portal
        </Link>

        {/* Status Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`${config.bg} ${config.border} border rounded-xl p-8 md:p-12 text-center`}
        >
          <div className={`${config.color} flex justify-center mb-6`}>
            {config.icon}
          </div>
          <p className={`font-mono-sm text-sm uppercase tracking-widest ${config.color} mb-2`}>
            {config.label}
          </p>
          <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-on-surface mb-4">
            {certificateId}
          </h1>
          {result.certificate && (
            <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto">
              {result.certificate.title}
            </p>
          )}
          {result.status === 'revoked' && result.certificate?.revoked_reason && (
            <p className="text-error/80 text-sm mt-4 font-body-md">
              Reason: {result.certificate.revoked_reason}
            </p>
          )}
        </motion.div>

        {/* Certificate & Intern Details */}
        {result.intern && result.certificate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Intern Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#111111] border border-[#222222] rounded-lg p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <User size={28} />
                </div>
                <div>
                  <h2 className="font-headline-lg text-xl font-semibold text-on-surface">{result.intern.name || 'KaiketsuTech Intern'}</h2>
                  <p className="font-mono-sm text-xs text-primary uppercase tracking-widest">{result.intern.intern_id}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Code size={16} className="text-on-surface-variant shrink-0" />
                  <div>
                    <span className="text-on-surface-variant">Department:</span>{' '}
                    <span className="text-on-surface capitalize font-semibold">{result.intern.department}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-on-surface-variant shrink-0" />
                  <div>
                    <span className="text-on-surface-variant">Period:</span>{' '}
                    <span className="text-on-surface font-semibold">
                      {new Date(result.intern.start_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      {' — '}
                      {result.intern.end_date
                        ? new Date(result.intern.end_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                        : 'Present'}
                    </span>
                  </div>
                </div>

                {result.intern.bio && (
                  <p className="text-on-surface-variant pt-2 border-t border-[#222222]">{result.intern.bio}</p>
                )}

                {result.intern.skills && result.intern.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {result.intern.skills.map((skill) => (
                      <span key={skill} className="bg-[#222222] text-on-surface px-3 py-1 rounded text-xs font-mono-sm border border-[#333333]">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social Links */}
                <div className="flex gap-3 pt-3 border-t border-[#222222]">
                  {result.intern.github_url && (
                    <a href={result.intern.github_url} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-xs">
                      GitHub <ExternalLink size={12} />
                    </a>
                  )}
                  {result.intern.linkedin_url && (
                    <a href={result.intern.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-xs">
                      LinkedIn <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              <Link
                href={`/intern/${result.intern.intern_id}`}
                className="mt-6 inline-flex items-center gap-2 text-primary text-sm hover:underline font-semibold"
              >
                View Full Profile <ExternalLink size={14} />
              </Link>
            </motion.div>

            {/* Certificate Details + QR */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#111111] border border-[#222222] rounded-lg p-8 flex flex-col"
            >
              <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-6">Certificate Details</h3>

              <div className="space-y-4 text-sm flex-grow">
                <div>
                  <span className="text-on-surface-variant">Title:</span>{' '}
                  <span className="text-on-surface font-semibold">{result.certificate.title}</span>
                </div>
                {result.certificate.description && (
                  <div>
                    <span className="text-on-surface-variant">Description:</span>{' '}
                    <span className="text-on-surface">{result.certificate.description}</span>
                  </div>
                )}
                <div>
                  <span className="text-on-surface-variant">Issued:</span>{' '}
                  <span className="text-on-surface font-semibold">
                    {new Date(result.certificate.issued_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                {result.certificate.valid_until && (
                  <div>
                    <span className="text-on-surface-variant">Valid Until:</span>{' '}
                    <span className="text-on-surface font-semibold">
                      {new Date(result.certificate.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              {/* QR Code */}
              {result.certificate.qr_code_url && (
                <div className="mt-8 flex flex-col items-center">
                  <img
                    src={result.certificate.qr_code_url}
                    alt={`QR Code for certificate ${certificateId}`}
                    className="w-40 h-40 rounded-lg border border-[#222222]"
                  />
                  <p className="font-mono-sm text-[10px] text-on-surface-variant mt-3 uppercase tracking-widest">
                    Scan to verify
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Project Contributions */}
        {result.contributions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#111111] border border-[#222222] rounded-lg p-8"
          >
            <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-6">Project Contributions</h3>
            <div className="divide-y divide-[#222222]">
              {result.contributions.map((contrib, idx) => (
                <div key={idx} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <p className="font-semibold text-on-surface">{contrib.project_title}</p>
                    {contrib.contribution_summary && (
                      <p className="text-sm text-on-surface-variant mt-1">{contrib.contribution_summary}</p>
                    )}
                  </div>
                  <span className="bg-primary-container/10 text-primary px-3 py-1 rounded text-[10px] font-mono-sm uppercase tracking-widest shrink-0 w-fit">
                    {contrib.role}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Not Found State */}
        {result.status === 'not_found' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-12"
          >
            <p className="text-on-surface-variant text-lg mb-6">
              No certificate found with ID <strong className="text-on-surface">{certificateId}</strong>.
            </p>
            <p className="text-on-surface-variant text-sm mb-8">
              Please double-check the certificate ID and try again. If you believe this is an error, contact KaiketsuTech support.
            </p>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 bg-primary-container text-white px-8 py-3 rounded font-label-md text-label-md font-semibold hover:bg-[#d8600d] transition-colors"
            >
              <ArrowLeft size={16} /> Try Again
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  )
}
