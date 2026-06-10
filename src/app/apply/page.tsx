'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft, ArrowRight, Upload, Briefcase, FileText, Loader } from 'lucide-react'
import TopNavBar from '@/components/shared/TopNavBar'
import Footer from '@/components/shared/Footer'

function ApplyFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [roleTrack, setRoleTrack] = useState('software-engineer')
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
      setRoleTrack(roleParam)
    }
  }, [searchParams])

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

    setSubmitting(true)
    toast('Uploading resume and processing application...', 'info')

    try {
      // 1. Upload resume to Supabase Storage
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

      // 2. Insert application record into database
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
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Failed to submit application. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#111111] border border-[#222222] rounded-lg p-8 md:p-12 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-60"></div>
      
      <div className="mb-8 border-b border-[#222222] pb-6">
        <h2 className="font-headline-xl text-xl md:text-2xl text-on-surface font-bold">Internship Application</h2>
        <p className="font-body-md text-xs text-on-surface-variant mt-1">
          Apply for the <span className="text-primary font-semibold capitalize">{roleTrack.replace('-', ' ')}</span> track.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="fullname">Full Name *</label>
            <input 
              id="fullname"
              type="text"
              required
              className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none"
              placeholder="Jane Doe"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="email">Email Address *</label>
            <input 
              id="email"
              type="email"
              required
              className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none"
              placeholder="jane@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="phone">Phone Number</label>
            <input 
              id="phone"
              type="tel"
              className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none"
              placeholder="+1 (555) 019-2834"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="experience">Years of Experience</label>
            <input 
              id="experience"
              type="text"
              className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none"
              placeholder="e.g. 1 year academic, self-taught, etc."
              value={experience}
              onChange={e => setExperience(e.target.value)}
            />
          </div>
        </div>

        {/* Step 2: Technical profile */}
        <div className="space-y-2">
          <label className="block font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="skills">Core Skills</label>
          <input 
            id="skills"
            type="text"
            className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none"
            placeholder="e.g. React, UI/UX, Git, SQL"
            value={skills}
            onChange={e => setSkills(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="technologies">Technologies Worked With</label>
          <input 
            id="technologies"
            type="text"
            className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none"
            placeholder="e.g. Next.js, Figma, Tailwind CSS, Supabase"
            value={technologies}
            onChange={e => setTechnologies(e.target.value)}
          />
        </div>

        {/* Step 3: Web links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="portfolio">Portfolio URL</label>
            <input 
              id="portfolio"
              type="url"
              className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none"
              placeholder="https://myportfolio.com"
              value={portfolioUrl}
              onChange={e => setPortfolioUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="github">GitHub URL</label>
            <input 
              id="github"
              type="url"
              className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none"
              placeholder="https://github.com/profile"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="linkedin">LinkedIn URL</label>
            <input 
              id="linkedin"
              type="url"
              className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 px-4 text-sm focus:border-primary-container outline-none"
              placeholder="https://linkedin.com/in/profile"
              value={linkedinUrl}
              onChange={e => setLinkedinUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Step 4: Resume upload */}
        <div className="space-y-2 border-t border-[#222222] pt-6">
          <label className="block font-label-md text-xs text-on-surface-variant font-bold uppercase tracking-wider">Upload Resume (PDF/Word under 5MB) *</label>
          <div className="relative border-2 border-dashed border-[#333333] hover:border-primary/50 transition-colors rounded-lg p-6 flex flex-col items-center justify-center text-center bg-[#0B0B0B] cursor-pointer">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {resumeFile ? (
              <div className="flex items-center gap-2 text-primary">
                <FileText size={28} />
                <span className="text-xs font-semibold">{resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                <Upload size={28} />
                <span className="text-xs">Drag and drop file here or click to browse</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-[#222222] flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-primary text-[#0B0B0B] font-label-md text-xs font-bold rounded hover:bg-opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? <Loader className="animate-spin" size={16} /> : 'Submit Application'}
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ApplyPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-body-md antialiased">
      <TopNavBar />

      <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-2xl mx-auto mb-8">
          <Link href="/careers" className="font-body-md font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Careers
          </Link>
        </div>

        <Suspense fallback={
          <div className="w-full max-w-2xl mx-auto bg-[#111111] border border-[#222222] rounded-lg p-12 flex justify-center items-center">
            <Loader className="animate-spin text-primary" size={32} />
          </div>
        }>
          <ApplyFormContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
