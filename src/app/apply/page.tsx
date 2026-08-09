'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft, Upload, FileText, Loader } from 'lucide-react'
import Reveal from '@/components/marketing/Reveal'

const inputClass =
  'w-full border border-marketing-border bg-marketing-bg-raised px-4 py-3 text-[15px] text-marketing-fg placeholder:text-marketing-muted-dim focus:border-marketing-accent focus:outline-none'

function ApplyFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [roleTitle, setRoleTitle] = useState('General Internship')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [skills, setSkills] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [experience, setExperience] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roleParam)
      if (isUuid) {
        supabase
          .from('job_postings')
          .select('title')
          .eq('id', roleParam)
          .single()
          .then(({ data }) => {
            if (data?.title) {
              // eslint-disable-next-line react-hooks/set-state-in-effect
              setRoleTitle(data.title)
            }
          })
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRoleTitle(roleParam.replace(/-/g, ' '))
      }
    }
  }, [searchParams, supabase])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        toast('Resume file size must be under 5MB.', 'warning')
        return
      }
      setResumeFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !email || !resumeFile) {
      toast('Please fill in Name, Email and upload a Resume.', 'warning')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast('Please enter a valid email address.', 'error')
      return
    }

    setSubmitting(true)
    toast('Uploading resume and processing application...', 'info')

    try {
      const fileExt = resumeFile.name.split('.').pop()
      const randomId = Math.random().toString(36).substring(2, 12)
      const resumePath = `${Date.now()}_${randomId}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(resumePath, resumeFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Resume upload failed: ${uploadError.message}`)
      }

      const { error: dbError } = await supabase
        .from('intern_applications')
        .insert({
          full_name: fullName,
          email,
          phone,
          skills,
          technologies,
          experience,
          portfolio_url: portfolioUrl,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
          resume_url: resumePath,
          status: 'pending'
        })

      if (dbError) {
        throw dbError
      }

      toast('Application submitted successfully! Our engineering team will review it.', 'success')
      setTimeout(() => {
        router.push('/careers')
      }, 2500)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Failed to submit application. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl border border-marketing-border bg-marketing-bg-raised p-8 md:p-12">
      <div className="mb-8 border-b border-marketing-border pb-6">
        <h2 className="font-marketing-sans text-xl font-bold text-marketing-fg md:text-2xl">
          Internship application
        </h2>
        <p className="mt-1 text-sm text-marketing-muted">
          Applying for the <span className="capitalize text-marketing-accent">{roleTitle}</span> track.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Full name"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className={inputClass}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Experience — self-taught, 2 yrs production work…"
            value={experience}
            onChange={e => setExperience(e.target.value)}
            className={inputClass}
          />
        </div>

        <input
          type="text"
          placeholder="Core skills — React, Node.js, SQL, TypeScript"
          value={skills}
          onChange={e => setSkills(e.target.value)}
          className={inputClass}
        />

        <input
          type="text"
          placeholder="Technologies worked with — Next.js, Tailwind, Supabase"
          value={technologies}
          onChange={e => setTechnologies(e.target.value)}
          className={inputClass}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            type="url"
            placeholder="Portfolio URL"
            value={portfolioUrl}
            onChange={e => setPortfolioUrl(e.target.value)}
            className={inputClass}
          />
          <input
            type="url"
            placeholder="GitHub URL"
            value={githubUrl}
            onChange={e => setGithubUrl(e.target.value)}
            className={inputClass}
          />
          <input
            type="url"
            placeholder="LinkedIn URL"
            value={linkedinUrl}
            onChange={e => setLinkedinUrl(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="border-t border-marketing-border pt-6">
          <label className="mb-2 block font-marketing-mono text-xs uppercase tracking-wider text-marketing-muted-dim">
            Resume (PDF/Word, under 5MB) *
          </label>
          <div className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-marketing-border p-6 text-center transition-colors hover:border-marketing-accent">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              required
              onChange={handleFileChange}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            {resumeFile ? (
              <div className="flex items-center gap-2 text-marketing-accent">
                <FileText size={24} />
                <span className="text-xs font-semibold">
                  {resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-marketing-muted-dim">
                <Upload size={24} />
                <span className="text-xs">Drag and drop, or click to browse</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex items-center justify-center gap-2 self-start rounded-full bg-marketing-accent px-7 py-3.5 text-[15px] font-semibold text-marketing-accent-ink transition-colors hover:bg-marketing-fg disabled:opacity-50"
        >
          {submitting ? <Loader className="animate-spin" size={16} /> : 'Submit application'}
        </button>
      </form>
    </div>
  )
}

export default function ApplyPage() {
  return (
    <section className="flex flex-col items-center px-[6vw] pb-[10vh] pt-[12vh]">
      <div className="mb-8 w-full max-w-2xl">
        <Link
          href="/careers"
          className="flex items-center gap-2 font-marketing-mono text-xs uppercase tracking-wider text-marketing-muted-dim transition-colors hover:text-marketing-accent"
        >
          <ArrowLeft size={14} />
          Back to careers
        </Link>
      </div>

      <Reveal className="w-full max-w-2xl">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center border border-marketing-border bg-marketing-bg-raised p-12">
              <Loader className="animate-spin text-marketing-accent" size={28} />
            </div>
          }
        >
          <ApplyFormContent />
        </Suspense>
      </Reveal>
    </section>
  )
}
