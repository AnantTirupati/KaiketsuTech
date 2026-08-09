'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft, ArrowRight, ShieldCheck, Upload, FileText, Loader } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

const inputClass =
  'w-full bg-marketing-bg border border-marketing-border rounded-lg py-3 px-4 text-sm text-marketing-fg placeholder:text-marketing-muted-dim focus:border-marketing-accent outline-none'
const labelClass = 'font-mono text-xs font-bold uppercase tracking-wider text-marketing-muted-dim block'

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Failed to submit project request.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-marketing-bg font-marketing-sans text-marketing-fg antialiased selection:bg-marketing-accent/30 selection:text-marketing-accent">
      <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-marketing-border bg-marketing-bg/80 px-[6vw] py-4 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-marketing-fg transition-opacity hover:opacity-80">
          <ArrowLeft size={18} className="text-marketing-accent" />
          Back to KaiketsuTech
        </Link>
        <div className="flex items-center gap-2 font-marketing-mono text-xs text-marketing-muted-dim">
          <span className="h-2 w-2 animate-pulse rounded-full bg-marketing-accent" />
          Secure channel
        </div>
      </header>

      <main className="flex flex-grow flex-col items-center justify-center px-[6vw] pb-24 pt-[120px]">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center md:text-left">
            <h1 className="mb-2 font-marketing-sans text-3xl font-bold text-marketing-fg md:text-4xl">
              Request a project
            </h1>
            <p className="text-marketing-muted">Tell us about your engineering project requirements.</p>
          </div>

          {/* Stepper */}
          <div className="relative mb-12 flex items-center justify-between">
            <div className="absolute left-0 top-1/2 -z-10 h-[2px] w-full -translate-y-1/2 bg-marketing-border" />
            <div
              className="absolute left-0 top-1/2 -z-10 h-[2px] -translate-y-1/2 bg-marketing-accent transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-marketing-mono text-xs font-bold transition-all duration-300 ${
                  step >= num
                    ? 'border-marketing-accent bg-marketing-accent text-marketing-accent-ink'
                    : 'border-marketing-border bg-marketing-bg-raised text-marketing-muted-dim'
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          <div className="border border-marketing-border bg-marketing-bg-raised p-8 md:p-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="mb-1 text-xl font-bold text-marketing-fg">Company &amp; personal identity</h2>
                    <p className="text-sm text-marketing-muted">
                      Who is requesting this project, and on behalf of which company?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>Company name *</label>
                      <input
                        className={inputClass}
                        placeholder="Vanguard Solutions"
                        required
                        type="text"
                        value={formData.companyName}
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>Contact person *</label>
                      <input
                        className={inputClass}
                        placeholder="Your name"
                        required
                        type="text"
                        value={formData.contactPerson}
                        onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>Work email *</label>
                      <input
                        className={inputClass}
                        placeholder="example@gmail.com"
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>Phone number</label>
                      <input
                        className={inputClass}
                        placeholder="+91 1234567890"
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="mb-1 text-xl font-bold text-marketing-fg">Project scope &amp; business goals</h2>
                    <p className="text-sm text-marketing-muted">
                      What are you looking to build, and what are the main goals?
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Project title *</label>
                    <input
                      className={inputClass}
                      placeholder="E-commerce application modernization"
                      required
                      type="text"
                      value={formData.projectTitle}
                      onChange={e => setFormData({ ...formData, projectTitle: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Project description *</label>
                    <textarea
                      className={`resize-none ${inputClass}`}
                      placeholder="Migrate legacy stack to Next.js 16, integrate unified payments checkout, and optimize SQL querying…"
                      rows={4}
                      required
                      value={formData.projectDescription}
                      onChange={e => setFormData({ ...formData, projectDescription: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Business goals</label>
                    <textarea
                      className={`resize-none ${inputClass}`}
                      placeholder="Reduce server-side API response latency by 45% and scale system capacity for high concurrent traffic…"
                      rows={3}
                      value={formData.businessGoals}
                      onChange={e => setFormData({ ...formData, businessGoals: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="mb-1 text-xl font-bold text-marketing-fg">Budget, timeline &amp; urgency</h2>
                    <p className="text-sm text-marketing-muted">
                      Map out target budget parameters, priority, and timeline expectations.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>Target budget (USD) *</label>
                      <input
                        className={inputClass}
                        type="number"
                        required
                        value={formData.budget}
                        onChange={e => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>Urgency / priority</label>
                      <select
                        className={`cursor-pointer ${inputClass}`}
                        value={formData.priority}
                        onChange={e =>
                          setFormData({ ...formData, priority: e.target.value as typeof formData.priority })
                        }
                      >
                        <option value="low">Low priority</option>
                        <option value="medium">Medium priority</option>
                        <option value="high">High priority</option>
                        <option value="critical">Critical path / urgent</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Timeline: {formData.timelineWeeks} weeks</label>
                    <input
                      type="range"
                      min="4"
                      max="52"
                      step="2"
                      className="w-full accent-marketing-accent"
                      value={formData.timelineWeeks}
                      onChange={e => setFormData({ ...formData, timelineWeeks: parseInt(e.target.value) })}
                    />
                    <div className="flex justify-between font-marketing-mono text-xs text-marketing-muted-dim">
                      <span>4 weeks (rapid MVP)</span>
                      <span>26 weeks (mid-term)</span>
                      <span>52 weeks (full eng.)</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="mb-1 text-xl font-bold text-marketing-fg">Requirement documents &amp; attachments</h2>
                    <p className="text-sm text-marketing-muted">
                      Upload PDFs, wireframes, RFP documents, or specifications.
                    </p>
                  </div>

                  <div className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-marketing-border p-6 text-center transition-colors hover:border-marketing-accent">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <Upload size={24} className="text-marketing-muted-dim" />
                    <span className="text-xs text-marketing-muted-dim">
                      Drag and drop files here or click to browse
                    </span>
                  </div>

                  {attachedFiles.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="font-marketing-mono text-[10px] font-semibold uppercase tracking-widest text-marketing-muted-dim">
                        Attached files
                      </p>
                      <div className="divide-y divide-marketing-border border border-marketing-border">
                        {attachedFiles.map((file, i) => (
                          <div key={i} className="flex items-center justify-between p-3 text-xs">
                            <div className="flex items-center gap-2 text-marketing-accent">
                              <FileText size={16} />
                              <span>
                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="cursor-pointer text-[11px] text-red-400 hover:underline"
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

              <div className="mt-8 flex items-center justify-between border-t border-marketing-border pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1 || submitting}
                  className="cursor-pointer border border-marketing-border px-6 py-3 font-marketing-mono text-xs text-marketing-fg transition-colors hover:border-marketing-accent disabled:opacity-30"
                >
                  Previous
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-marketing-accent px-8 py-3 font-marketing-mono text-xs font-bold text-marketing-accent-ink transition-colors hover:bg-marketing-fg"
                  >
                    Continue
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-marketing-accent px-8 py-3 font-marketing-mono text-xs font-bold text-marketing-accent-ink transition-colors hover:bg-marketing-fg disabled:opacity-50"
                  >
                    {submitting ? <Loader className="animate-spin" size={16} /> : 'Submit request'}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="mt-8 flex justify-center gap-2 text-marketing-muted-dim">
            <ShieldCheck size={16} />
            <p className="font-marketing-mono text-xs">End-to-end encrypted transmission</p>
          </div>
        </div>
      </main>
    </div>
  )
}
