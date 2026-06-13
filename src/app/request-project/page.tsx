'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft, ArrowRight, ShieldCheck, Upload, FileText, Loader } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function RequestProject() {
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    projectTitle: '',
    projectDescription: '',
    businessGoals: '',
    budget: 10000,
    timelineWeeks: 12,
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
  })
  
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', data.user.id)
          .single()
          .then(({ data: p }) => {
            setFormData(prev => ({
              ...prev,
              email: data.user?.email || '',
              contactPerson: p?.full_name || ''
            }))
          })
      } else {
        toast('Please register or sign in to submit a project request.', 'warning')
        router.push('/login?redirect=/request-project')
      }
    })
  }, [supabase, router, toast])

  const nextStep = () => {
    if (step === 1) {
      if (!formData.companyName || !formData.contactPerson || !formData.email) {
        toast('Please fill in Company Name, Contact Person, and Email.', 'warning')
        return
      }
    }
    if (step === 2) {
      if (!formData.projectTitle || !formData.projectDescription) {
        toast('Please provide a Project Title and description.', 'warning')
        return
      }
    }
    setStep(prev => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setAttachedFiles(prev => [...prev, ...filesArray])
      toast(`${filesArray.length} file(s) attached.`, 'info')
    }
  }

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    toast('Submitting project request...', 'info')

    try {
      // Split Contact Name into First/Last name for backward compatibility
      const nameParts = formData.contactPerson.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // 1. Insert lead request into DB
      const { data, error: dbError } = await supabase
        .from('project_requests')
        .insert({
          client_id: userId,
          first_name: firstName,
          last_name: lastName,
          work_email: formData.email,
          phone: formData.phone,
          company_name: formData.companyName,
          project_title: formData.projectTitle,
          project_description: formData.projectDescription,
          business_goals: formData.businessGoals,
          budget: formData.budget,
          timeline_weeks: formData.timelineWeeks,
          priority: formData.priority,
          status: 'pending',
        })
        .select()
        .single()

      if (dbError) throw dbError

      // 2. Upload any attachments to storage project-files bucket under the lead request id
      if (attachedFiles.length > 0 && userId && data) {
        toast('Uploading files to project space...', 'info')
        for (const file of attachedFiles) {
          const fileExt = file.name.split('.').pop()
          const randomId = Math.random().toString(36).substring(2, 9)
          const filePath = `${userId}/${data.id}_${randomId}.${fileExt}`

          await supabase.storage
            .from('project-files')
            .upload(filePath, file)
        }
      }

      toast('Your project request has been submitted successfully!', 'success')
      
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      })

      setTimeout(() => {
        router.push(userId ? '/dashboard/client' : '/')
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
          Secure Channel
        </div>
      </header>

      <main className="flex-grow pt-[120px] pb-24 flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mb-2">Request Software Project</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Provide details of your engineering project requirements below.</p>
          </div>

          {/* Stepper Progress */}
          <div className="mb-12 relative flex items-center justify-between">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#222222] -z-10 -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-primary -z-10 -translate-y-1/2 transition-all duration-500" 
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>

            {[1, 2, 3, 4].map((num) => (
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
          <div className="glass-panel p-8 md:p-12 rounded-lg relative overflow-hidden bg-[#111111] border border-[#222222]">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              
              {/* Step 1: Contact Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-headline-lg text-xl font-bold mb-1">Company & Personal Identity</h2>
                    <p className="font-body-md text-sm text-on-surface-variant">Who is requesting this project and on behalf of which company?</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <div className="space-y-2">
                      <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Company Name *</label>
                      <input 
                        className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none" 
                        placeholder="e.g. Acme Corp" 
                        required
                        type="text"
                        value={formData.companyName}
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Contact Person *</label>
                      <input 
                        className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none" 
                        placeholder="e.g. Jane Doe" 
                        required
                        type="text"
                        value={formData.contactPerson}
                        onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <div className="space-y-2">
                      <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Work Email *</label>
                      <input 
                        className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none" 
                        placeholder="jane@company.com" 
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Phone Number</label>
                      <input 
                        className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none" 
                        placeholder="+1 (555) 012-3456" 
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Project Specifications */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-headline-lg text-xl font-bold mb-1">Project Scope & Business Goals</h2>
                    <p className="font-body-md text-sm text-on-surface-variant">What are you looking to build, and what are the main goals?</p>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Project Title *</label>
                    <input 
                      className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none" 
                      placeholder="e.g. Next-Gen Mobile Core Architecture" 
                      required
                      type="text"
                      value={formData.projectTitle}
                      onChange={e => setFormData({ ...formData, projectTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Project Description *</label>
                    <textarea 
                      className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none resize-none" 
                      placeholder="Describe the scope of work, features required, and core functionalities..." 
                      rows={4}
                      required
                      value={formData.projectDescription}
                      onChange={e => setFormData({ ...formData, projectDescription: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Business Goals</label>
                    <textarea 
                      className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none resize-none" 
                      placeholder="What business objectives does this project aim to achieve?" 
                      rows={3}
                      value={formData.businessGoals}
                      onChange={e => setFormData({ ...formData, businessGoals: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 3: Timelines, Priority & Budget */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-headline-lg text-xl font-bold mb-1">Budget, Timeline & Urgency</h2>
                    <p className="font-body-md text-sm text-on-surface-variant">Map out target budget parameters, priority, and timeline expectations.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Target Budget (USD) *</label>
                      <input 
                        className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none" 
                        type="number"
                        required
                        value={formData.budget}
                        onChange={e => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Urgency / Priority</label>
                      <select 
                        className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none cursor-pointer"
                        value={formData.priority}
                        onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="critical">Critical Path / Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant block">Timeline: {formData.timelineWeeks} Weeks</label>
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
                      <span>4 weeks (Rapid MVP)</span>
                      <span>26 weeks (Mid-term)</span>
                      <span>52 weeks (Full Eng.)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Attachments & Submission */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-headline-lg text-xl font-bold mb-1">Requirement Documents & Attachments</h2>
                    <p className="font-body-md text-sm text-on-surface-variant">Upload PDFs, wireframes, RFP documents, or specifications.</p>
                  </div>

                  <div className="relative border-2 border-dashed border-[#333333] hover:border-primary/50 transition-colors rounded-lg p-6 flex flex-col items-center justify-center text-center bg-[#0B0B0B] cursor-pointer">
                    <input 
                      type="file" 
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                      <Upload size={28} />
                      <span className="text-xs">Drag and drop files here or click to browse</span>
                    </div>
                  </div>

                  {attachedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">Attached Files</p>
                      <div className="divide-y divide-[#222222] bg-[#0b0b0b] border border-[#222] rounded-lg">
                        {attachedFiles.map((file, i) => (
                          <div key={i} className="p-3 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2 text-primary">
                              <FileText size={16} />
                              <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="text-error hover:underline text-[11px] cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 border-t border-[#222222] flex justify-between items-center mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1 || submitting}
                  className="px-6 py-3 bg-[#111111] border border-[#333333] text-on-surface font-label-md text-xs rounded hover:bg-[#1A1A1A] transition-colors disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-primary text-[#0B0B0B] font-label-md text-xs font-bold rounded hover:bg-opacity-90 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    Continue
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-primary-container text-white font-label-md text-xs font-bold rounded hover:bg-opacity-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
