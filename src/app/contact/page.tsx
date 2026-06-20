'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Phone, Mail, MapPin, Clock, ChevronDown, Compass, ArrowRight } from 'lucide-react'

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
    <div className="bg-background text-on-surface flex flex-col min-h-screen selection:bg-primary-container selection:text-white">
      <main className="flex-grow pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop">
        {/* Hero Section */}
        <section className="max-w-max-width mx-auto mb-16 text-center md:text-left">
          <h1 className="font-display-lg text-5xl md:text-7xl lg:text-7xl font-bold text-on-surface mb-stack-lg max-w-4xl font-bold">
            Let's Engineer Your Future.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Initiate a dialogue with our senior engineering team. Whether you are scaling infrastructure or architecting a new enterprise solution, we are ready to build.
          </p>
        </section>

        {/* Contact Grid */}
        <section className="max-w-max-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-24">
          {/* Left: Contact Info Bento */}
          <div className="lg:col-span-5 flex flex-col gap-gutter">
            {/* Direct Line */}
            <div className="bg-surface-container-low border border-outline-variant p-8 rounded-lg flex items-start gap-6 hover:border-primary-container transition-colors duration-300">
              <div className="bg-surface-container p-3 rounded-lg flex-shrink-0 text-primary">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-bold">Direct Line</h3>
                <p className="font-headline-lg text-xl md:text-2xl text-on-surface mb-1 font-semibold">+91 7467831005</p>
                <p className="font-mono-sm text-xs text-on-surface-variant/70">Priority routing for existing clients</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-surface-container-low border border-outline-variant p-8 rounded-lg flex items-start gap-6 hover:border-primary-container transition-colors duration-300">
              <div className="bg-surface-container p-3 rounded-lg flex-shrink-0 text-primary">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-bold">Electronic Mail</h3>
                <p className="font-body-lg text-base md:text-lg text-on-surface mb-1 font-semibold">
                  <a href="mailto:hello@kaiketsutech.online" className="hover:text-primary transition-colors">hello@kaiketsutech.online</a>
                </p>
                <p className="font-body-lg text-base md:text-lg text-on-surface mb-1 font-semibold">
                  <a href="mailto:support@kaiketsutech.online" className="hover:text-primary transition-colors">support@kaiketsutech.online</a>
                </p>
                <p className="font-mono-sm text-xs text-on-surface-variant/70">GPG Key available upon request</p>
              </div>
            </div>

            {/* Location & Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="bg-surface-container-low border border-outline-variant p-6 rounded-lg flex flex-col justify-between hover:border-primary-container transition-colors duration-300">
                <MapPin size={24} className="text-on-surface-variant mb-4" />
                <div>
                  <h3 className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-bold">Headquarters</h3>
                  <p className="font-body-md text-sm text-on-surface">Kanpur, Uttar Pradesh, India</p>
                </div>
              </div>
              <div className="bg-surface-container-low border border-outline-variant p-6 rounded-lg flex flex-col justify-between hover:border-primary-container transition-colors duration-300">
                <Clock size={24} className="text-on-surface-variant mb-4" />
                <div>
                  <h3 className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-bold">Operations</h3>
                  <p className="font-body-md text-sm text-on-surface">Mon - Fri<br/>09:00 - 18:00 IST</p>
                  <p className="font-mono-sm text-xs text-on-surface-variant/70 mt-2">24/7 SLA Available</p>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="bg-surface-container-low border border-outline-variant p-8 rounded-lg flex items-start gap-6 hover:border-primary-container transition-colors duration-300">
              <div className="bg-surface-container p-3 rounded-lg flex-shrink-0 text-primary flex items-center justify-center">
                <Compass size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant mb-3 font-bold">Social Channels</h3>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://www.linkedin.com/company/kaiketsutech/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm font-semibold text-on-surface hover:text-primary transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect width="4" height="12" x="2" y="9"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/kaiketsutech/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm font-semibold text-on-surface hover:text-primary transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant p-8 md:p-12 rounded-lg relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl pointer-events-none"></div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-sm text-on-surface-variant font-medium" htmlFor="name">Full Name</label>
                  <input 
                    className="form-input" 
                    id="name" 
                    placeholder="Your Name" 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-sm text-on-surface-variant font-medium" htmlFor="company">Organization</label>
                  <input 
                    className="form-input" 
                    id="company" 
                    placeholder="Vanguard Solutions" 
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm text-on-surface-variant font-medium" htmlFor="email">Email Address</label>
                <input 
                  className="form-input" 
                  id="email" 
                  placeholder="example@gmail.com" 
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm text-on-surface-variant font-medium" htmlFor="subject">Inquiry Subject</label>
                <select 
                  className="form-input appearance-none cursor-pointer" 
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="" disabled>Select an area of interest...</option>
                  <option value="infrastructure">Infrastructure Scaling</option>
                  <option value="software">Custom Software Development</option>
                  <option value="consulting">Technical Consulting</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm text-on-surface-variant font-medium" htmlFor="message">Project Details</label>
                <textarea 
                  className="form-input resize-none" 
                  id="message" 
                  placeholder="Provide details about your project scope, timeline expectations, and core tech stacks..." 
                  rows={5}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <div className="mt-4 flex justify-end">
                <button 
                  className="bg-primary-container text-white px-8 py-4 rounded-lg font-label-md text-label-md font-bold tracking-wide hover:bg-opacity-95 transition-all flex items-center gap-2 group cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="max-w-max-width mx-auto mb-24 w-full">
          <div className="w-full h-[400px] rounded-lg overflow-hidden border border-outline-variant/30 relative bg-surface-container flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-variant/20 via-background to-background opacity-80 z-0"></div>
            <div className="relative z-10 bg-surface-container-highest/80 backdrop-blur-md px-6 py-4 rounded-lg border border-outline-variant shadow-2xl flex items-center gap-4">
              <Compass className="text-primary animate-spin" style={{ animationDuration: '6s' }} />
              <div>
                <p className="font-label-md text-sm text-on-surface font-bold">Kanpur HQ</p>
                <p className="font-mono-sm text-xs text-on-surface-variant">Coordinates: 26.4499° N, 80.3319° E</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="font-headline-xl text-2xl md:text-3xl text-on-surface mb-4 font-bold">Operational Protocol FAQ</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Common inquiries regarding our engagement models and technical processes.</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className={`faq-item bg-surface-container-low border border-outline-variant rounded-lg p-6 cursor-pointer hover:border-on-surface-variant transition-colors ${
                  activeFaq === idx ? 'active' : ''
                }`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-headline-lg text-lg text-on-surface font-semibold">{faq.question}</h3>
                  <ChevronDown className={`text-on-surface-variant faq-icon transition-transform ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`} />
                </div>
                <div className="faq-content">
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default function Contact() {
  return (
    <Suspense fallback={
      <div className="bg-background text-on-surface flex items-center justify-center min-h-screen font-mono-sm">
        Loading contact configuration...
      </div>
    }>
      <ContactContent />
    </Suspense>
  )
}

