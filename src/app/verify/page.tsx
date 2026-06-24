'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Search, ArrowRight, QrCode } from 'lucide-react'

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

  return (
    <div className="bg-background text-on-surface antialiased overflow-x-hidden min-h-screen">
      <main className="flex-grow pt-32 pb-section-gap flex flex-col gap-16">
        {/* Hero Section */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-24 h-24 rounded-full bg-primary-container/10 border border-primary-container/30 flex items-center justify-center mb-8"
          >
            <ShieldCheck className="text-primary" size={48} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display-lg text-4xl md:text-6xl lg:text-7xl font-bold text-on-surface mb-stack-md"
          >
            VERIFY A CERTIFICATE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12"
          >
            Confirm the authenticity of a KaiketsuTech internship certificate. Enter the Certificate ID
            printed on the document or scan the QR code.
          </motion.p>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onSubmit={handleVerify}
            className="w-full max-w-xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. KT-A7F2-2606)"
                value={certificateId}
                onChange={(e) => { setCertificateId(e.target.value); setError('') }}
                className="w-full bg-[#111111] border border-[#222222] rounded-lg pl-12 pr-32 py-4 text-on-surface font-body-md outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50"
                id="certificate-search"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-container text-white px-6 py-2.5 rounded-lg font-label-md text-label-md font-semibold hover:bg-[#d8600d] transition-colors flex items-center gap-2 cursor-pointer"
              >
                Verify <ArrowRight size={16} />
              </button>
            </div>
            {error && (
              <p className="text-error text-sm mt-3 text-left font-body-md">{error}</p>
            )}
          </motion.form>
        </section>

        {/* How it works */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
          >
            {[
              {
                icon: <QrCode size={28} />,
                title: 'Scan or Enter ID',
                description: 'Use the QR code on the certificate or type the Certificate ID shown on the document.',
              },
              {
                icon: <ShieldCheck size={28} />,
                title: 'Instant Verification',
                description: 'Our system instantly checks the certificate against our secure database and validates its authenticity.',
              },
              {
                icon: <ArrowRight size={28} />,
                title: 'View Details',
                description: "See the intern's profile, department, internship period, and project contributions.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-[#111111] border border-[#222222] rounded-lg p-8 text-center group hover:border-primary-container/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-primary-container/10 flex items-center justify-center mx-auto mb-6 text-primary group-hover:bg-primary-container/20 transition-colors">
                  {step.icon}
                </div>
                <h3 className="font-headline-lg text-lg font-semibold text-on-surface mb-3">{step.title}</h3>
                <p className="font-body-md text-sm text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Trust indicators */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <div className="bg-[#111111] border border-[#222222] rounded-lg p-8 md:p-12">
            <p className="font-mono-sm text-[10px] text-primary uppercase tracking-widest mb-4">Trusted Verification</p>
            <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">
              Each certificate is uniquely generated with a tamper-proof QR code linked to our secure verification system.
              All intern records are maintained with full audit trails.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
