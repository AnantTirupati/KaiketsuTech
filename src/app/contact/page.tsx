'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Phone, Mail, MapPin, Clock, ChevronDown, Compass } from 'lucide-react'
import Reveal from '@/components/marketing/Reveal'
import KineticText from '@/components/marketing/KineticText'

const inputClass =
  'w-full border border-marketing-border bg-marketing-bg-raised px-4 py-3.5 text-[15px] text-marketing-fg placeholder:text-marketing-muted-dim focus:border-marketing-accent focus:outline-none'

function ContactContent() {
  const searchParams = useSearchParams()
  const initialSubject = searchParams.get('subject') || ''

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    subject: initialSubject,
    message: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    if (initialSubject) {
      setFormData(prev => ({ ...prev, subject: initialSubject }))
    }
  }, [initialSubject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast('Please fill in all required fields.', 'warning')
      return
    }

    setSubmitting(true)

    try {
      const { error } = await supabase.from('contact_inquiries').insert({
        full_name: formData.name,
        organization: formData.company || null,
        email: formData.email,
        subject: formData.subject || null,
        message: formData.message,
      })

      if (error) throw error

      toast('Your inquiry has been submitted successfully. Our engineering team will contact you shortly.', 'success')
      setFormData({
        name: '',
        company: '',
        email: '',
        subject: '',
        message: '',
      })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Failed to submit inquiry. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const faqs = [
    {
      question: 'What is your typical engagement model?',
      answer: 'We favor long-term, embedded partnerships. Following an initial architectural audit, we integrate directly with your existing technical leadership to execute defined milestones via agile sprints.',
    },
    {
      question: 'Do you handle legacy system modernization?',
      answer: 'Yes. A significant portion of our portfolio involves strangler fig patterns and gradual refactoring of monolithic architectures into highly available, distributed microservices using modern container orchestration.',
    },
    {
      question: 'What is your baseline security compliance?',
      answer: 'All deliverables are engineered to meet or exceed SOC 2 Type II and ISO 27001 standards. Security protocols, including automated vulnerability scanning and penetration testing, are integrated into our CI/CD pipelines.',
    },
  ]

  return (
    <>
      <section className="px-[6vw] pb-[6vh] pt-[12vh]">
        <Reveal>
          <div className="mb-3 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-accent">
            Contact
          </div>
          <KineticText
            as="h1"
            className="max-w-[16ch] font-marketing-sans text-[clamp(36px,6vw,64px)] font-bold leading-[1.02]"
            text="Let's engineer your future."
          />
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-marketing-muted">
            Initiate a dialogue with our engineering team. Whether you&rsquo;re scaling
            infrastructure or architecting a new solution, we&rsquo;re ready to build.
          </p>
        </Reveal>
      </section>

      <section className="grid grid-cols-1 gap-10 px-[6vw] pb-[10vh] lg:grid-cols-12">
        {/* Contact info */}
        <Reveal delay={0.05} className="flex flex-col gap-5 lg:col-span-5">
          <div className="flex items-start gap-5 border border-marketing-border bg-marketing-bg-raised p-6">
            <Phone size={22} className="mt-1 shrink-0 text-marketing-accent" />
            <div>
              <h3 className="mb-1 font-marketing-mono text-xs uppercase tracking-wider text-marketing-muted-dim">
                Direct line
              </h3>
              <p className="text-lg font-semibold text-marketing-fg">+91 7467831005</p>
              <p className="mt-1 font-marketing-mono text-xs text-marketing-muted-dim">
                Priority routing for existing clients
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5 border border-marketing-border bg-marketing-bg-raised p-6">
            <Mail size={22} className="mt-1 shrink-0 text-marketing-accent" />
            <div>
              <h3 className="mb-1 font-marketing-mono text-xs uppercase tracking-wider text-marketing-muted-dim">
                Electronic mail
              </h3>
              <p className="font-semibold text-marketing-fg">
                <a href="mailto:hello@kaiketsutech.online" className="hover:text-marketing-accent">
                  hello@kaiketsutech.online
                </a>
              </p>
              <p className="font-semibold text-marketing-fg">
                <a href="mailto:support@kaiketsutech.online" className="hover:text-marketing-accent">
                  support@kaiketsutech.online
                </a>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="border border-marketing-border bg-marketing-bg-raised p-6">
              <MapPin size={22} className="mb-4 text-marketing-muted-dim" />
              <h3 className="mb-1 font-marketing-mono text-xs uppercase tracking-wider text-marketing-muted-dim">
                Headquarters
              </h3>
              <p className="text-sm text-marketing-fg">Kanpur, Uttar Pradesh, India</p>
            </div>
            <div className="border border-marketing-border bg-marketing-bg-raised p-6">
              <Clock size={22} className="mb-4 text-marketing-muted-dim" />
              <h3 className="mb-1 font-marketing-mono text-xs uppercase tracking-wider text-marketing-muted-dim">
                Operations
              </h3>
              <p className="text-sm text-marketing-fg">
                Mon–Fri
                <br />
                09:00–18:00 IST
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5 border border-marketing-border bg-marketing-bg-raised p-6">
            <Compass size={22} className="mt-1 shrink-0 text-marketing-accent" />
            <div>
              <h3 className="mb-3 font-marketing-mono text-xs uppercase tracking-wider text-marketing-muted-dim">
                Social channels
              </h3>
              <div className="flex flex-wrap gap-5">
                <a
                  href="https://www.linkedin.com/company/kaiketsutech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-marketing-fg hover:text-marketing-accent"
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/kaiketsutech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-marketing-fg hover:text-marketing-accent"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.1} className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-marketing-border bg-marketing-bg-raised p-8 md:p-10">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Full name"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Organization (optional)"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                className={inputClass}
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={inputClass}
            />

            <select
              required
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              className={`${inputClass} cursor-pointer appearance-none`}
            >
              <option value="" disabled>
                Select an area of interest…
              </option>
              <option value="infrastructure">Infrastructure scaling</option>
              <option value="software">Custom software development</option>
              <option value="consulting">Technical consulting</option>
              <option value="other">Other inquiry</option>
            </select>

            <textarea
              placeholder="Project scope, timeline, and core tech stacks…"
              rows={5}
              required
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              className={`resize-y ${inputClass}`}
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 self-start rounded-full bg-marketing-accent px-7 py-3.5 text-[15px] font-semibold text-marketing-accent-ink transition-colors hover:bg-marketing-fg disabled:opacity-50"
            >
              {submitting ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="border-t border-marketing-border px-[6vw] py-[10vh]">
        <Reveal className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 font-marketing-sans text-2xl font-bold text-marketing-fg md:text-3xl">
              Operational protocol FAQ
            </h2>
            <p className="text-marketing-muted">
              Common questions about our engagement models and technical process.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => {
              const open = activeFaq === idx
              return (
                <div
                  key={faq.question}
                  className="cursor-pointer border border-marketing-border bg-marketing-bg-raised p-6"
                  onClick={() => setActiveFaq(open ? null : idx)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-marketing-fg">{faq.question}</h3>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-marketing-muted-dim transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {open && (
                    <p className="mt-4 text-[15px] leading-relaxed text-marketing-muted">{faq.answer}</p>
                  )}
                </div>
              )
            })}
          </div>
        </Reveal>
      </section>
    </>
  )
}

export default function Contact() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center font-marketing-mono text-marketing-muted-dim">
          Loading contact configuration…
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  )
}
