'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft, ArrowRight, ShieldCheck, HelpCircle, Loader } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function StartProject() {
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    jobTitle: '',
    companyName: '',
    companySize: '1-10',
    projectScope: 'web-dev',
    projectDescription: '',
    timelineWeeks: 12,
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        setFormData(prev => ({
          ...prev,
          workEmail: data.user?.email || '',
        }))
      }
    })
  }, [supabase])

  const nextStep = () => {
    // Basic validations per step
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.workEmail) {
        toast('Please fill in your name and email.', 'warning')
        return
      }
    }
    if (step === 2) {
      if (!formData.companyName) {
        toast('Please enter your company name.', 'warning')
        return
      }
    }
    if (step === 3) {
      if (!formData.projectDescription) {
        toast('Please describe your project.', 'warning')
        return
      }
    }
    setStep(prev => Math.min(prev + 1, 5))
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase.from('project_requests').insert({
        client_id: userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        work_email: formData.workEmail,
        job_title: formData.jobTitle,
        company_name: formData.companyName,
        project_scope: formData.projectScope,
        project_description: formData.projectDescription,
        timeline_weeks: formData.timelineWeeks,
        status: 'pending',
      })

      if (error) throw error

      toast('Your project request has been submitted successfully!', 'success')
      
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      })

      setTimeout(() => {
        router.push('/')
      }, 2500)
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Failed to submit project request.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-body-md antialiased selection:bg-primary/30 selection:text-primary">
      <header className="w-full py-stack-md px-margin-mobile md:px-margin-desktop flex justify-between items-center fixed top-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant">
        <Link href="/" className="font-body-lg font-bold text-on-surface tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ArrowLeft size={18} className="text-primary" />
          Back to KaiketsuTech
        </Link>
        <div className="flex items-center gap-2 text-on-surface-variant font-mono-sm text-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Auto-saving
        </div>
      </header>

      <main className="flex-grow pt-[120px] pb-section-gap flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mb-2">Initiate Project</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Provide the foundational details of your engineering request.</p>
          </div>

          {/* Stepper Progress */}
          <div className="mb-12 relative flex items-center justify-between">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#222222] -z-10 -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-primary -z-10 -translate-y-1/2 transition-all duration-500" 
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            ></div>

            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono-sm text-xs border-2 transition-all duration-300 ${
                  step >= num 
                    ? 'bg-primary text-[#0B0B0B] border-primary' 
                    : 'bg-[#111111] border-[#333333] text-on-surface-variant'
                }`}>
                  {num}
                </div>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="glass-panel p-8 md:p-12 rounded-lg relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              
              {/* Step 1: Personal Identity */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-headline-lg text-xl font-bold mb-1">Personal Identity</h2>
                    <p className="font-body-md text-sm text-on-surface-variant">Who will be the primary point of contact for this engagement?</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <div className="space-y-2">
                      <label className="font-label-md text-sm text-on-surface-variant block">First Name</label>
                      <input 
                        className="form-input" 
                        placeholder="e.g. Jane" 
                        type="text"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md text-sm text-on-surface-variant block">Last Name</label>
                      <input 
                        className="form-input" 
                        placeholder="e.g. Doe" 
                        type="text"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-sm text-on-surface-variant block">Work Email</label>
                    <input 
                      className="form-input" 
                      placeholder="jane@company.com" 
                      type="email"
                      value={formData.workEmail}
                      onChange={e => setFormData({ ...formData, workEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-sm text-on-surface-variant block">Job Title</label>
                    <input 
                      className="form-input" 
                      placeholder="Director of Engineering" 
                      type="text"
                      value={formData.jobTitle}
                      onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Business details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-headline-lg text-xl font-bold mb-1">Business Details</h2>
                    <p className="font-body-md text-sm text-on-surface-variant">Tell us about your organization.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-sm text-on-surface-variant block">Company Name</label>
                    <input 
                      className="form-input" 
                      placeholder="Acme Corp" 
                      type="text"
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-sm text-on-surface-variant block">Company Size</label>
                    <select 
                      className="form-input appearance-none cursor-pointer"
                      value={formData.companySize}
                      onChange={e => setFormData({ ...formData, companySize: e.target.value })}
                    >
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201+">201+ employees</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Scope */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-headline-lg text-xl font-bold mb-1">Project Scope</h2>
                    <p className="font-body-md text-sm text-on-surface-variant">What are we building together?</p>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-sm text-on-surface-variant block">Project Type</label>
                    <select 
                      className="form-input appearance-none cursor-pointer"
                      value={formData.projectScope}
                      onChange={e => setFormData({ ...formData, projectScope: e.target.value })}
                    >
                      <option value="web-dev">Web App Development</option>
                      <option value="ecommerce">E-Commerce Storefront</option>
                      <option value="infrastructure">Infrastructure & DevOps</option>
                      <option value="other">Other Software Engineering</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-sm text-on-surface-variant block">Project Description</label>
                    <textarea 
                      className="form-input resize-none" 
                      placeholder="Describe the goals, requirements, and constraints of the project..." 
                      rows={5}
                      value={formData.projectDescription}
                      onChange={e => setFormData({ ...formData, projectDescription: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 4: Timeline & Budget */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-headline-lg text-xl font-bold mb-1">Timeline & Delivery</h2>
                    <p className="font-body-md text-sm text-on-surface-variant">What is the target timeframe?</p>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-sm text-on-surface-variant block">Estimated Timeline (Weeks): {formData.timelineWeeks} weeks</label>
                    <input 
                      type="range" 
                      min="4" 
                      max="52" 
                      step="2"
                      className="w-full accent-primary" 
                      value={formData.timelineWeeks}
                      onChange={e => setFormData({ ...formData, timelineWeeks: parseInt(e.target.value) })}
                    />
                    <div className="flex justify-between font-mono-sm text-xs text-on-surface-variant">
                      <span>4 weeks</span>
                      <span>26 weeks</span>
                      <span>52 weeks</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-headline-lg text-xl font-bold mb-1">Review Request</h2>
                    <p className="font-body-md text-sm text-on-surface-variant">Verify the details before sending it to our squads.</p>
                  </div>
                  <div className="bg-[#0B0B0B] border border-[#222] rounded-lg p-6 space-y-4 font-body-md text-sm">
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#222]">
                      <div>
                        <span className="text-on-surface-variant block text-xs">CONTACT</span>
                        <span className="font-semibold">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-xs">EMAIL</span>
                        <span className="font-semibold">{formData.workEmail}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#222]">
                      <div>
                        <span className="text-on-surface-variant block text-xs">ORGANIZATION</span>
                        <span className="font-semibold">{formData.companyName} ({formData.companySize})</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-xs">SCOPE</span>
                        <span className="font-semibold capitalize">{formData.projectScope.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-xs">TIMELINE</span>
                      <span className="font-semibold">{formData.timelineWeeks} weeks</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 border-t border-[#222222] flex justify-between items-center mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1 || submitting}
                  className={`px-6 py-3 bg-[#111111] border border-[#333333] text-on-surface font-label-md text-sm rounded hover:bg-[#1A1A1A] transition-colors disabled:opacity-30 cursor-pointer`}
                >
                  Previous
                </button>

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-primary text-[#0B0B0B] font-label-md text-sm font-bold rounded hover:bg-opacity-90 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-primary-container text-white font-label-md text-sm font-bold rounded hover:bg-opacity-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? <Loader className="animate-spin" size={16} /> : 'Submit Request'}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="mt-8 flex justify-center gap-2 text-on-surface-variant/50">
            <ShieldCheck size={16} />
            <p className="font-mono-sm text-xs">End-to-end encrypted transmission</p>
          </div>
        </div>
      </main>
    </div>
  )
}
