'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Search, ArrowRight, QrCode } from 'lucide-react'
import Reveal from '@/components/marketing/Reveal'
import KineticText from '@/components/marketing/KineticText'

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = certificateId.trim().toUpperCase()
    if (!trimmed) {
      setError('Please enter a certificate ID')
      return
    }
    if (!trimmed.startsWith('KT-')) {
      setError('Certificate ID must start with KT-')
      return
    }
    setError('')
    router.push(`/verify/${trimmed}`)
  }

  const steps = [
    {
      icon: <QrCode size={24} />,
      title: 'Scan or enter ID',
      description: 'Use the QR code on the certificate or type the Certificate ID shown on the document.',
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Instant verification',
      description: 'Our system instantly checks the certificate against our secure database and validates its authenticity.',
    },
    {
      icon: <ArrowRight size={24} />,
      title: 'View details',
      description: "See the intern's profile, department, internship period, and project contributions.",
    },
  ]

  return (
    <>
      <section className="flex flex-col items-center px-[6vw] pb-[6vh] pt-[12vh] text-center">
        <Reveal className="flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center border border-marketing-accent/30 bg-marketing-accent/10 text-marketing-accent">
            <ShieldCheck size={32} />
          </div>
          <KineticText
            as="h1"
            className="max-w-[18ch] font-marketing-sans text-[clamp(32px,5.5vw,56px)] font-bold leading-[1.05]"
            text="Verify a certificate."
          />
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-marketing-muted">
            Confirm the authenticity of a KaiketsuTech internship certificate. Enter the Certificate
            ID printed on the document or scan the QR code.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 w-full max-w-xl">
          <form onSubmit={handleVerify}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-marketing-muted-dim" size={18} />
              <input
                type="text"
                placeholder="Enter certificate ID (e.g. KT-A7F2-2606)"
                value={certificateId}
                onChange={(e) => { setCertificateId(e.target.value); setError('') }}
                className="w-full border border-marketing-border bg-marketing-bg-raised py-4 pl-12 pr-32 text-marketing-fg outline-none transition-colors placeholder:text-marketing-muted-dim/60 focus:border-marketing-accent"
                id="certificate-search"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 bg-marketing-accent px-6 py-2.5 text-sm font-semibold text-marketing-accent-ink transition-colors hover:bg-marketing-fg"
              >
                Verify <ArrowRight size={16} />
              </button>
            </div>
            {error && <p className="mt-3 text-left text-sm text-red-400">{error}</p>}
          </form>
        </Reveal>
      </section>

      <section className="border-t border-marketing-border px-[6vw] py-[8vh]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 0.05}
              className="border border-marketing-border bg-marketing-bg-raised p-8 text-center transition-colors hover:border-marketing-accent"
            >
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-marketing-border text-marketing-accent">
                {step.icon}
              </div>
              <h3 className="mb-2 font-marketing-sans text-lg font-semibold text-marketing-fg">{step.title}</h3>
              <p className="text-sm text-marketing-muted">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-marketing-border px-[6vw] py-[8vh] text-center">
        <Reveal className="border border-marketing-border bg-marketing-bg-raised p-8 md:p-12">
          <p className="mb-3 font-marketing-mono text-xs uppercase tracking-widest text-marketing-accent">
            Trusted verification
          </p>
          <p className="mx-auto max-w-2xl text-marketing-muted">
            Each certificate is uniquely generated with a tamper-proof QR code linked to our secure
            verification system. All intern records are maintained with full audit trails.
          </p>
        </Reveal>
      </section>
    </>
  )
}
