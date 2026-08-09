'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import TopAppBar from '@/components/shared/TopAppBar'
import { 
  DollarSign, Briefcase, Percent, TrendingUp, PlusCircle, 
  Award, CheckCircle2, ArrowRight, UserCheck, Trash2, 
  UserMinus, Users, Check, X, ShieldAlert, Loader, Eye, Plus, Layers, LogOut, Home,
  Calendar, FileText, Shield, ExternalLink, UserPlus, ClipboardList, Settings, Star
} from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database.types'
import { User } from '@supabase/supabase-js'
import type { 
  InternWithProfile, 
  CertificateWithIntern, 
  AuditLogWithActor, 
  ProjectContributorWithDetails 
} from '@/types/intern.types'

interface ProjectWithClient {
  capacity_utilization: number | null
  client_id: string | null
  created_at: string | null
  description: string | null
  estimated_budget: number | null
  id: string
  status: string | null
  timeline_end: string | null
  timeline_start: string | null
  title: string
  velocity: number | null
  is_showcase: boolean | null
  showcase_image_url: string | null
  showcase_tags: string[] | null
  profiles: {
    email: string
    full_name: string | null
  } | null
}

interface PaymentWithClient {
  amount: number
  client_id: string | null
  created_at: string | null
  currency: string | null
  id: string
  package_type: string | null
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  status: string | null
  profiles: {
    email: string
  } | null
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'projects' | 'clients' | 'payments' | 'interns' | 'certificates' | 'careers'>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // System Entities State
  const [leads, setLeads] = useState<Database['public']['Tables']['project_requests']['Row'][]>([])
  const [projects, setProjects] = useState<ProjectWithClient[]>([])
  const [clients, setClients] = useState<Database['public']['Tables']['profiles']['Row'][]>([])
  const [payments, setPayments] = useState<PaymentWithClient[]>([])
  const [interns, setInterns] = useState<Database['public']['Tables']['profiles']['Row'][]>([])
  const [applications, setApplications] = useState<Database['public']['Tables']['intern_applications']['Row'][]>([])

  // New State for Intern Verification & Certificate System
  const [internsList, setInternsList] = useState<InternWithProfile[]>([])
  const [certificatesList, setCertificatesList] = useState<CertificateWithIntern[]>([])
  const [auditLogsList, setAuditLogsList] = useState<AuditLogWithActor[]>([])
  const [contributorsList, setContributorsList] = useState<ProjectContributorWithDetails[]>([])

  // Careers (Job Postings) state
  const [jobPostings, setJobPostings] = useState<Database['public']['Tables']['job_postings']['Row'][]>([])
  const [newJob, setNewJob] = useState({
    title: '',
    track: 'Full Stack',
    description: '',
    requirements: ''
  })
  const [creatingJob, setCreatingJob] = useState(false)

  // Onboarding Form Modal State
  const [onboardOpen, setOnboardOpen] = useState(false)
  const [onboardingProfile, setOnboardingProfile] = useState<{ id: string; name: string; email: string } | null>(null)
  const [onboardingForm, setOnboardingForm] = useState({
    department: 'engineering',
    startDate: new Date().toISOString().split('T')[0],
    bio: '',
    skills: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: ''
  })
  const [submittingOnboard, setSubmittingOnboard] = useState(false)

  // Certificate Issuance Modal State
  const [issueOpen, setIssueOpen] = useState(false)
  const [selectedIntern, setSelectedIntern] = useState<InternWithProfile | null>(null)
  const [issuanceForm, setIssuanceForm] = useState({
    title: 'Certificate of Internship Completion',
    description: 'For successfully completing their internship as a Software Engineering Intern.',
    validUntil: ''
  })
  const [submittingIssue, setSubmittingIssue] = useState(false)

  // Revocation Modal State
  const [revokeOpen, setRevokeOpen] = useState(false)
  const [selectedCert, setSelectedCert] = useState<CertificateWithIntern | null>(null)
  const [revocationReason, setRevocationReason] = useState('')
  const [submittingRevoke, setSubmittingRevoke] = useState(false)

  // Project Contributor Modal State
  const [contributorOpen, setContributorOpen] = useState(false)
  const [contributorForm, setContributorForm] = useState({
    projectId: '',
    internId: '', // PK UUID of intern
    role: 'developer' as 'developer' | 'designer' | 'lead' | 'reviewer',
    contributionSummary: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  })
  const [submittingContributor, setSubmittingContributor] = useState(false)

  // Showcase Edit Modal State
  const [showcaseOpen, setShowcaseOpen] = useState(false)
  const [showcaseProject, setShowcaseProject] = useState<ProjectWithClient | null>(null)
  const [showcaseForm, setShowcaseForm] = useState({
    isShowcase: false,
    showcaseImageUrl: '',
    showcaseTags: ''
  })
  const [submittingShowcase, setSubmittingShowcase] = useState(false)

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('')

  // Reset search query on tab change to prevent stale filters carryover
  useEffect(() => {
    setSearchQuery('')
  }, [activeTab])

  // Filtered lists based on search query
  const filteredLeads = leads.filter(lead => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (lead.project_title || '').toLowerCase().includes(term) ||
      (lead.company_name || '').toLowerCase().includes(term) ||
      (lead.first_name || '').toLowerCase().includes(term) ||
      (lead.last_name || '').toLowerCase().includes(term) ||
      (lead.work_email || '').toLowerCase().includes(term)
    )
  })

  const filteredProjects = projects.filter(proj => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (proj.title || '').toLowerCase().includes(term) ||
      (proj.description || '').toLowerCase().includes(term) ||
      (proj.profiles?.email || '').toLowerCase().includes(term) ||
      (proj.profiles?.full_name || '').toLowerCase().includes(term)
    )
  })

  const filteredClients = clients.filter(cli => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (cli.full_name || '').toLowerCase().includes(term) ||
      (cli.email || '').toLowerCase().includes(term)
    )
  })

  const filteredPayments = payments.filter(pay => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (pay.razorpay_payment_id || '').toLowerCase().includes(term) ||
      (pay.profiles?.email || '').toLowerCase().includes(term) ||
      (pay.package_type || '').toLowerCase().includes(term) ||
      (pay.status || '').toLowerCase().includes(term)
    )
  })

  const filteredApplications = applications.filter(app => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (app.full_name || '').toLowerCase().includes(term) ||
      (app.email || '').toLowerCase().includes(term) ||
      (app.skills || '').toLowerCase().includes(term) ||
      (app.technologies || '').toLowerCase().includes(term) ||
      (app.phone || '').toLowerCase().includes(term)
    )
  })

  const filteredInterns = interns.filter(int => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (int.full_name || '').toLowerCase().includes(term) ||
      (int.email || '').toLowerCase().includes(term)
    )
  })

  const filteredCohortInterns = internsList.filter(int => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (int.intern_id || '').toLowerCase().includes(term) ||
      (int.profiles?.full_name || '').toLowerCase().includes(term) ||
      (int.profiles?.email || '').toLowerCase().includes(term) ||
      (int.department || '').toLowerCase().includes(term) ||
      (int.status || '').toLowerCase().includes(term)
    )
  })

  const filteredCertificates = certificatesList.filter(cert => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (cert.certificate_id || '').toLowerCase().includes(term) ||
      (cert.title || '').toLowerCase().includes(term) ||
      (cert.interns?.profiles?.full_name || '').toLowerCase().includes(term) ||
      (cert.status || '').toLowerCase().includes(term)
    )
  })

  // Project Creation State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    budget: 5000,
    clientId: '',
    status: 'planning' as 'planning' | 'in_progress' | 'review' | 'completed'
  })
  const [creatingProject, setCreatingProject] = useState(false)

  // Task Creation State (Assigning Interns)
  const [newTask, setNewTask] = useState({
    projectId: '',
    internId: '',
    title: '',
    category: 'Frontend' as 'Frontend' | 'Backend' | 'Design Sys' | 'Management' | 'Operations' | 'Other'
  })
  const [creatingTask, setCreatingTask] = useState(false)

  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadAdminData() {
      // 1. Verify User Session & Admin Role
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single()

      if (profile?.role !== 'admin') {
        toast('Unauthorized. Admin access required.', 'error')
        router.push(`/dashboard/${profile?.role || 'client'}`)
        return
      }

      setUser(currentUser)

      // 2. Fetch Dashboard Entities
      const { data: leadData } = await supabase.from('project_requests').select('*').order('created_at', { ascending: false })
      const { data: projData } = await supabase.from('projects').select('*, profiles(email, full_name)').order('created_at', { ascending: false })
      const { data: clientData } = await supabase.from('profiles').select('*').eq('role', 'client')
      const { data: payData } = await supabase.from('payments').select('*, profiles(email)').order('created_at', { ascending: false })
      const { data: internData } = await supabase.from('profiles').select('*').eq('role', 'intern')
      const { data: appData } = await supabase.from('intern_applications').select('*').order('created_at', { ascending: false })

      // Fetch joined intern records
      const { data: internsData } = await supabase
        .from('interns')
        .select('*, profiles(email, full_name, avatar_url, rating)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      // Fetch certificates
      const { data: certsData } = await supabase
        .from('certificates')
        .select('*, interns(*, profiles(email, full_name))')
        .order('created_at', { ascending: false })

      // Fetch audit logs
      const { data: auditData } = await supabase
        .from('audit_logs')
        .select('*, profiles(email, full_name)')
        .order('created_at', { ascending: false })
        .limit(100)

      // Fetch contributors
      const { data: contribData } = await supabase
        .from('project_contributors')
        .select(`
          *,
          projects(id, title, description, status, showcase_image_url, showcase_tags),
          interns(intern_id, department, profiles(full_name, avatar_url))
        `)
        .order('created_at', { ascending: false })

      // Fetch job postings
      const { data: jobData } = await supabase.from('job_postings').select('*').order('created_at', { ascending: false })

      setLeads(leadData || [])
      setProjects((projData as unknown as ProjectWithClient[]) || [])
      setClients(clientData || [])
      setPayments((payData as unknown as PaymentWithClient[]) || [])
      setInterns(internData || [])
      setApplications(appData || [])

      setInternsList((internsData as unknown as InternWithProfile[]) || [])
      setCertificatesList((certsData as unknown as CertificateWithIntern[]) || [])
      setAuditLogsList((auditData as unknown as AuditLogWithActor[]) || [])
      setContributorsList((contribData as unknown as ProjectContributorWithDetails[]) || [])
      setJobPostings(jobData || [])

      setLoading(false)
    }

    loadAdminData()
  }, [supabase, router])

  // Refresh helper
  const reloadData = async () => {
    const { data: leadData } = await supabase.from('project_requests').select('*').order('created_at', { ascending: false })
    const { data: projData } = await supabase.from('projects').select('*, profiles(email, full_name)').order('created_at', { ascending: false })
    const { data: payData } = await supabase.from('payments').select('*, profiles(email)').order('created_at', { ascending: false })
    const { data: appData } = await supabase.from('intern_applications').select('*').order('created_at', { ascending: false })
    const { data: internData } = await supabase.from('profiles').select('*').eq('role', 'intern')

    // Fetch new tables
    const { data: internsData } = await supabase
      .from('interns')
      .select('*, profiles(email, full_name, avatar_url, rating)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    const { data: certsData } = await supabase
      .from('certificates')
      .select('*, interns(*, profiles(email, full_name))')
      .order('created_at', { ascending: false })

    const { data: auditData } = await supabase
      .from('audit_logs')
      .select('*, profiles(email, full_name)')
      .order('created_at', { ascending: false })
      .limit(100)

    const { data: contribData } = await supabase
      .from('project_contributors')
      .select(`
        *,
        projects(id, title, description, status, showcase_image_url, showcase_tags),
        interns(intern_id, department, profiles(full_name, avatar_url))
      `)
      .order('created_at', { ascending: false })

    const { data: jobData } = await supabase.from('job_postings').select('*').order('created_at', { ascending: false })

    setLeads(leadData || [])
    setProjects((projData as unknown as ProjectWithClient[]) || [])
    setPayments((payData as unknown as PaymentWithClient[]) || [])
    setApplications(appData || [])
    setInterns(internData || [])

    setInternsList((internsData as unknown as InternWithProfile[]) || [])
    setCertificatesList((certsData as unknown as CertificateWithIntern[]) || [])
    setAuditLogsList((auditData as unknown as AuditLogWithActor[]) || [])
    setContributorsList((contribData as unknown as ProjectContributorWithDetails[]) || [])
    setJobPostings(jobData || [])
  }

  // --- ACTIONS ---

  // Lead Approval / Rejection
  const handleLeadAction = async (leadId: string, status: 'approved' | 'rejected') => {
    toast(`Processing lead status: ${status}`, 'info')
    try {
      const { data: lead } = await supabase
        .from('project_requests')
        .select('*')
        .eq('id', leadId)
        .single()

      if (!lead) throw new Error('Lead not found')

      // 1. Update project_request status
      const { error: updateErr } = await supabase
        .from('project_requests')
        .update({ status })
        .eq('id', leadId)

      if (updateErr) throw updateErr

      // 2. If approved, auto-provision a new project
      if (status === 'approved') {
        const { error: projErr } = await supabase.from('projects').insert({
          client_id: lead.client_id,
          title: lead.project_title || `${lead.company_name} Project`,
          description: lead.project_description,
          status: 'planning',
          estimated_budget: lead.budget || 5000,
          velocity: 0,
          capacity_utilization: 10
        })
        if (projErr) throw projErr
        toast('Lead approved. Project provisioned successfully.', 'success')
      } else {
        toast('Lead request rejected.', 'success')
      }

      reloadData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Action failed.'
      toast(message, 'error')
    }
  }

  // Project Creation
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.title) return

    setCreatingProject(true)
    try {
      const { error } = await supabase.from('projects').insert({
        title: newProject.title,
        description: newProject.description,
        estimated_budget: newProject.budget,
        client_id: newProject.clientId || null,
        status: newProject.status,
        velocity: 0,
        capacity_utilization: 10
      })

      if (error) throw error
      toast('New project created successfully.', 'success')
      setNewProject({ title: '', description: '', budget: 5000, clientId: '', status: 'planning' })
      reloadData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create project.'
      toast(message, 'error')
    } finally {
      setCreatingProject(false)
    }
  }

  // Project Deletion
  const handleDeleteProject = async (projId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', projId)
        if (error) throw error
        toast('Project deleted.', 'success')
        reloadData()
      } catch (err) {
        toast('Failed to delete project.', 'error')
      }
    }
  }

  // Project Status Update
  const handleUpdateProjectStatus = async (projId: string, nextStatus: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: nextStatus })
        .eq('id', projId)

      if (error) throw error
      toast('Project status updated.', 'success')
      reloadData()
    } catch (err) {
      toast('Failed to update status.', 'error')
    }
  }

  // Task Creation (Assign Intern)
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title || !newTask.projectId) {
      toast('Please enter task title and select project.', 'warning')
      return
    }

    setCreatingTask(true)
    try {
      const { error } = await supabase.from('tasks').insert({
        project_id: newTask.projectId,
        assigned_to: newTask.internId || null,
        title: newTask.title,
        status: 'todo',
        category: newTask.category
      })

      if (error) throw error
      toast('Task successfully assigned to intern.', 'success')
      setNewTask(prev => ({ ...prev, title: '' }))
      reloadData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to assign task.'
      toast(message, 'error')
    } finally {
      setCreatingTask(false)
    }
  }

  // Intern Application Approval / Rejection
  const handleApplicationAction = async (appId: string, status: 'approved' | 'rejected') => {
    toast(`Processing application: ${status}`, 'info')
    try {
      const { data: app } = await supabase
        .from('intern_applications')
        .select('*')
        .eq('id', appId)
        .single()

      if (!app) throw new Error('Application not found')

      // 1. Update application status
      const { error: appErr } = await supabase
        .from('intern_applications')
        .update({ status })
        .eq('id', appId)

      if (appErr) throw appErr

      // 2. If approved, look up existing user profile by email and upgrade role to 'intern'
      if (status === 'approved') {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', app.email)
          .maybeSingle()

        if (userProfile) {
          const { error: roleErr } = await supabase
            .from('profiles')
            .update({ role: 'intern' })
            .eq('id', userProfile.id)

          if (roleErr) throw roleErr
          toast('Application approved. User promoted to Intern role.', 'success')
        } else {
          toast('Application approved. Role will assign upon candidate registration.', 'success')
        }
      } else {
        toast('Application rejected.', 'success')
      }

      reloadData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Action failed.'
      toast(message, 'error')
    }
  }

  const handleInviteIntern = async (application: Database['public']['Tables']['intern_applications']['Row']) => {
    toast(`Inviting ${application.full_name}...`, 'info')
    try {
      const response = await fetch('/api/invite-intern', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: application.email,
          fullName: application.full_name,
          applicationId: application.id
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Invitation failed')
      }

      toast(`Invitation email successfully sent to ${application.email}`, 'success')
      reloadData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invitation failed'
      toast(`${message}. Please verify SUPABASE_SERVICE_ROLE_KEY configuration.`, 'error')
    }
  }

  const handleDownloadResume = async (resumePath: string) => {
    try {
      const { data, error } = await supabase.storage.from('resumes').createSignedUrl(resumePath, 60)
      if (error) throw error
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      }
    } catch (err) {
      toast('Failed to download resume file.', 'error')
    }
  }

  const handleUpdateInternRating = async (internId: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ rating })
        .eq('id', internId)

      if (error) throw error
      toast('Intern rating updated.', 'success')
      reloadData()
    } catch (err) {
      toast('Failed to update intern rating.', 'error')
    }
  }

  // --- NEW INTERN SYSTEM ACTIONS ---

  const handleOnboardIntern = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onboardingProfile) return
    setSubmittingOnboard(true)
    try {
      const skillsArray = onboardingForm.skills
        ? onboardingForm.skills.split(',').map(s => s.trim()).filter(Boolean)
        : []

      const res = await fetch('/api/interns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: onboardingProfile.id,
          department: onboardingForm.department,
          startDate: onboardingForm.startDate,
          bio: onboardingForm.bio || null,
          skills: skillsArray,
          github_url: onboardingForm.githubUrl || null,
          linkedin_url: onboardingForm.linkedinUrl || null,
          portfolio_url: onboardingForm.portfolioUrl || null
        })
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Onboarding failed')

      toast('Intern onboarded successfully!', 'success')
      setOnboardOpen(false)
      setOnboardingProfile(null)
      setOnboardingForm({
        department: 'engineering',
        startDate: new Date().toISOString().split('T')[0],
        bio: '',
        skills: '',
        githubUrl: '',
        linkedinUrl: '',
        portfolioUrl: ''
      })
      reloadData()
    } catch (err: any) {
      toast(err.message || 'Failed to onboard intern', 'error')
    } finally {
      setSubmittingOnboard(false)
    }
  }

  const handleUpdateInternStatus = async (internId: string, status: 'active' | 'completed' | 'revoked' | 'archived') => {
    if (status === 'archived' && !confirm('Are you sure you want to archive this intern? (Soft delete)')) return
    try {
      const res = await fetch(`/api/interns/${internId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Status update failed')

      toast(`Intern status updated to ${status}.`, 'success')
      reloadData()
    } catch (err: any) {
      toast(err.message || 'Failed to update status', 'error')
    }
  }

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedIntern) return
    setSubmittingIssue(true)
    try {
      const res = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internId: selectedIntern.id,
          title: issuanceForm.title,
          description: issuanceForm.description,
          validUntil: issuanceForm.validUntil || null
        })
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Issuance failed')

      toast('Certificate issued successfully!', 'success')
      setIssueOpen(false)
      setSelectedIntern(null)
      setIssuanceForm({
        title: 'Certificate of Internship Completion',
        description: 'For successfully completing their internship as a Software Engineering Intern.',
        validUntil: ''
      })
      reloadData()
    } catch (err: any) {
      toast(err.message || 'Failed to issue certificate', 'error')
    } finally {
      setSubmittingIssue(false)
    }
  }

  const handleRevokeCertificate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCert || !revocationReason) return
    setSubmittingRevoke(true)
    try {
      const res = await fetch('/api/certificates/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: selectedCert.certificate_id,
          reason: revocationReason
        })
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Revocation failed')

      toast('Certificate revoked successfully.', 'success')
      setRevokeOpen(false)
      setSelectedCert(null)
      setRevocationReason('')
      reloadData()
    } catch (err: any) {
      toast(err.message || 'Failed to revoke certificate', 'error')
    } finally {
      setSubmittingRevoke(false)
    }
  }

  const handleAssignContributor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contributorForm.projectId || !contributorForm.internId) {
      toast('Please select a project and an intern.', 'warning')
      return
    }
    setSubmittingContributor(true)
    try {
      const { error } = await supabase.from('project_contributors').insert({
        project_id: contributorForm.projectId,
        intern_id: contributorForm.internId,
        role: contributorForm.role,
        contribution_summary: contributorForm.contributionSummary || null,
        start_date: contributorForm.startDate || null,
        end_date: contributorForm.endDate || null
      })

      if (error) throw error
      toast('Contributor assigned successfully!', 'success')
      setContributorOpen(false)
      setContributorForm({
        projectId: '',
        internId: '',
        role: 'developer',
        contributionSummary: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      })
      reloadData()
    } catch (err: any) {
      toast(err.message || 'Failed to assign contributor', 'error')
    } finally {
      setSubmittingContributor(false)
    }
  }

  const handleRemoveContributor = async (id: string) => {
    if (!confirm('Are you sure you want to remove this contributor assignment?')) return
    try {
      const { error } = await supabase.from('project_contributors').delete().eq('id', id)
      if (error) throw error
      toast('Contributor assignment removed.', 'success')
      reloadData()
    } catch (err: any) {
      toast('Failed to remove contributor.', 'error')
    }
  }

  const handleSaveShowcase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showcaseProject) return
    setSubmittingShowcase(true)
    try {
      const tagsArray = showcaseForm.showcaseTags
        ? showcaseForm.showcaseTags.split(',').map(t => t.trim()).filter(Boolean)
        : []

      const { error } = await supabase
        .from('projects')
        .update({
          is_showcase: showcaseForm.isShowcase,
          showcase_image_url: showcaseForm.showcaseImageUrl || null,
          showcase_tags: tagsArray
        })
        .eq('id', showcaseProject.id)

      if (error) throw error
      toast('Showcase settings saved.', 'success')
      setShowcaseOpen(false)
      setShowcaseProject(null)
      reloadData()
    } catch (err: any) {
      toast(err.message || 'Failed to update showcase settings', 'error')
    } finally {
      setSubmittingShowcase(false)
    }
  }

  // --- CAREERS MANAGEMENT ACTIONS ---

  const handleCreateJobPosting = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newJob.title || !newJob.description) return
    setCreatingJob(true)
    try {
      const reqsArray = newJob.requirements
        ? newJob.requirements.split(',').map(r => r.trim()).filter(Boolean)
        : []

      const { error } = await supabase.from('job_postings').insert({
        title: newJob.title,
        track: newJob.track,
        description: newJob.description,
        requirements: reqsArray,
        status: 'open'
      })

      if (error) throw error
      toast('Job posting created successfully.', 'success')
      setNewJob({ title: '', track: 'Full Stack', description: '', requirements: '' })
      reloadData()
    } catch (err: any) {
      toast(err.message || 'Failed to create job posting', 'error')
    } finally {
      setCreatingJob(false)
    }
  }

  const handleToggleJobStatus = async (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'open' ? 'closed' : 'open'
    try {
      const { error } = await supabase
        .from('job_postings')
        .update({ status: nextStatus })
        .eq('id', jobId)

      if (error) throw error
      toast(`Job status updated to ${nextStatus}.`, 'success')
      reloadData()
    } catch (err) {
      toast('Failed to update status.', 'error')
    }
  }

  const handleDeleteJobPosting = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return
    try {
      const { error } = await supabase.from('job_postings').delete().eq('id', jobId)
      if (error) throw error
      toast('Job posting deleted.', 'success')
      reloadData()
    } catch (err) {
      toast('Failed to delete job posting.', 'error')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-marketing-bg">
        <Loader className="animate-spin text-marketing-accent" size={36} />
      </div>
    )
  }

  // Analytics helper metrics
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0)
  const activeProjectsCount = projects.filter(p => p.status !== 'completed').length

  return (
    <div className="bg-marketing-bg text-marketing-fg antialiased min-h-screen flex font-marketing-sans overflow-hidden relative">
      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`bg-marketing-bg-raised w-64 h-screen border-r border-marketing-border flex flex-col justify-between shrink-0 transition-transform duration-300 z-50
        fixed inset-y-0 left-0 md:static md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="p-6 border-b border-marketing-border">
            <div className="flex items-center justify-between">
              <Link href="/" className="block font-marketing-mono text-sm font-bold tracking-tight text-marketing-fg transition-colors hover:text-marketing-accent">
                KAIKETSU<span className="text-marketing-accent">_</span>TECH
              </Link>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-marketing-muted hover:text-marketing-accent transition-all p-2 cursor-pointer flex items-center justify-center"
                aria-label="Close Sidebar"
              >
                <X size={18} />
              </button>
            </div>
            <p className="font-marketing-mono text-[10px] text-marketing-muted uppercase tracking-widest mt-2 font-bold font-black">Admin Console</p>
          </div>
          <nav className="px-4 py-6 space-y-1">
            {(
              [
                { id: 'overview', label: 'Analytics Overview', icon: <TrendingUp size={18} /> },
                { id: 'leads', label: 'Requested Leads', icon: <Briefcase size={18} /> },
                { id: 'projects', label: 'Projects & Tasks', icon: <Layers size={18} /> },
                { id: 'clients', label: 'Client Accounts', icon: <Users size={18} /> },
                { id: 'payments', label: 'Payments Ledger', icon: <DollarSign size={18} /> },
                { id: 'interns', label: 'Intern Cohort', icon: <Users size={18} /> },
                { id: 'certificates', label: 'Certificates', icon: <Award size={18} /> },
                { id: 'careers', label: 'Careers Manager', icon: <Briefcase size={18} /> }
              ] as const
            ).map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === tab.id 
                    ? 'bg-marketing-accent text-marketing-accent-ink' 
                    : 'text-marketing-muted hover:bg-marketing-bg hover:text-marketing-fg'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-marketing-border flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-marketing-accent/20 flex items-center justify-center text-marketing-accent font-bold font-marketing-mono text-xs">
              A
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-marketing-fg truncate">{user?.email}</span>
              <span className="text-[10px] text-marketing-muted font-marketing-mono">Administrator</span>
            </div>
          </div>
          <Link 
            href="/"
            className="w-full bg-marketing-bg-raised hover:bg-marketing-bg border border-marketing-border text-marketing-fg py-2 flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <Home size={14} />
            Go to Home
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full bg-marketing-bg-raised hover:bg-marketing-bg border border-marketing-border text-marketing-fg py-2 flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content frame */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopAppBar 
          title={activeTab === 'overview' ? 'Analytics Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
          placeholder="Search admin console..." 
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Scrollable Canvas */}
        <div className="flex-grow overflow-y-auto p-gutter pt-8 max-w-max-width w-full mx-auto space-y-6">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
                <div className="bg-marketing-bg-raised border border-marketing-border p-6 flex flex-col justify-between">
                  <p className="font-marketing-mono text-[10px] text-marketing-muted uppercase tracking-widest font-bold">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-marketing-accent mt-2">${totalRevenue.toLocaleString()}</h3>
                </div>

                <div className="bg-marketing-bg-raised border border-marketing-border p-6 flex flex-col justify-between">
                  <p className="font-marketing-mono text-[10px] text-marketing-muted uppercase tracking-widest font-bold">Active Projects</p>
                  <h3 className="text-3xl font-bold text-marketing-fg mt-2">{activeProjectsCount}</h3>
                </div>

                <div className="bg-marketing-bg-raised border border-marketing-border p-6 flex flex-col justify-between">
                  <p className="font-marketing-mono text-[10px] text-marketing-muted uppercase tracking-widest font-bold">Registered Clients</p>
                  <h3 className="text-3xl font-bold text-marketing-fg mt-2">{clients.length}</h3>
                </div>

                <div className="bg-marketing-bg-raised border border-marketing-border p-6 flex flex-col justify-between">
                  <p className="font-marketing-mono text-[10px] text-marketing-muted uppercase tracking-widest font-bold">Active Interns</p>
                  <h3 className="text-3xl font-bold text-marketing-fg mt-2">{interns.length}</h3>
                </div>
              </div>

              {/* Recent Orders / Quick lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="bg-marketing-bg-raised border border-marketing-border p-6">
                  <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4">Pending Requests (Leads)</h4>
                  <div className="divide-y divide-marketing-border">
                    {filteredLeads.filter(l => l.status === 'pending').slice(0, 5).map(lead => (
                      <div key={lead.id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-marketing-fg">{lead.project_title || 'Untitled Lead'}</p>
                          <p className="text-marketing-muted mt-0.5">{lead.company_name}</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab('leads')}
                          className="text-marketing-accent hover:underline text-[10px] font-marketing-mono uppercase"
                        >
                          Review
                        </button>
                      </div>
                    ))}
                    {filteredLeads.filter(l => l.status === 'pending').length === 0 && (
                      <div className="py-4 text-center text-marketing-muted text-xs font-marketing-mono">No pending leads.</div>
                    )}
                  </div>
                </div>

                <div className="bg-marketing-bg-raised border border-marketing-border p-6">
                  <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4">Live Project Status</h4>
                  <div className="divide-y divide-marketing-border">
                    {filteredProjects.slice(0, 5).map(proj => (
                      <div key={proj.id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-marketing-fg">{proj.title}</p>
                          <p className="text-marketing-muted mt-0.5 font-marketing-mono text-[10px]">Client: {proj.profiles?.email || 'N/A'}</p>
                        </div>
                        <span className="bg-marketing-accent/10 text-marketing-accent px-2 py-0.5 text-[10px] font-marketing-mono capitalize">
                          {(proj.status || '').replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEADS TAB */}
          {activeTab === 'leads' && (
            <div className="bg-marketing-bg-raised border border-marketing-border p-6">
              <h3 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-6">Requested Leads</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-marketing-sans text-marketing-muted">
                  <thead>
                    <tr className="border-b border-marketing-border font-marketing-mono text-[10px] uppercase text-marketing-muted/70 tracking-widest pb-3">
                      <th className="pb-3">Lead / Company</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Budget</th>
                      <th className="pb-3">Urgency</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-marketing-border">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-marketing-bg/45 transition-colors">
                        <td className="py-4">
                          <p className="font-semibold text-marketing-fg text-xs md:text-sm">{lead.project_title || 'Untitled Request'}</p>
                          <p className="text-xs text-marketing-muted mt-0.5">{lead.company_name}</p>
                        </td>
                        <td className="py-4 text-xs">
                          <p className="text-marketing-fg">{lead.first_name} {lead.last_name}</p>
                          <p className="text-marketing-muted">{lead.work_email}</p>
                        </td>
                        <td className="py-4 font-marketing-mono text-xs text-marketing-fg">${Number(lead.budget || 0).toLocaleString()}</td>
                        <td className="py-4 font-marketing-mono text-xs capitalize">
                          <span className={`px-2 py-0.5 text-[10px] ${
                            lead.priority === 'critical' || lead.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-marketing-border text-marketing-muted'
                          }`}>
                            {lead.priority || 'medium'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {lead.status === 'pending' ? (
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleLeadAction(lead.id, 'approved')}
                                className="p-1 bg-marketing-accent/10 hover:bg-marketing-accent/20 text-marketing-accent cursor-pointer"
                                title="Approve & Create Project"
                              >
                                <Check size={16} />
                              </button>
                              <button 
                                onClick={() => handleLeadAction(lead.id, 'rejected')}
                                className="p-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 cursor-pointer"
                                title="Reject Lead"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <span className="font-marketing-mono text-[10px] uppercase text-marketing-muted/70 tracking-widest">{lead.status}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Project Provision Form */}
              <div className="bg-marketing-bg-raised border border-marketing-border p-6">
                <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4">Provision New Project</h4>
                <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input 
                    type="text" 
                    placeholder="Project Title"
                    required
                    value={newProject.title}
                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                    className="bg-marketing-bg border border-marketing-border p-3 text-xs outline-none focus:border-marketing-accent text-marketing-fg"
                  />
                  <input 
                    type="text" 
                    placeholder="Project Description"
                    value={newProject.description}
                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                    className="bg-marketing-bg border border-marketing-border p-3 text-xs outline-none focus:border-marketing-accent text-marketing-fg"
                  />
                  <select 
                    value={newProject.clientId}
                    onChange={e => setNewProject({ ...newProject, clientId: e.target.value })}
                    className="bg-marketing-bg border border-marketing-border p-3 text-xs outline-none focus:border-marketing-accent text-marketing-fg cursor-pointer"
                  >
                    <option value="">Select Client Account</option>
                    {clients.map(cli => (
                      <option key={cli.id} value={cli.id}>{cli.email}</option>
                    ))}
                  </select>
                  <button 
                    type="submit" 
                    disabled={creatingProject}
                    className="bg-marketing-accent text-marketing-accent-ink py-3 hover:bg-marketing-fg transition-colors flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
                  >
                    {creatingProject ? <Loader className="animate-spin" size={14} /> : <Plus size={14} />}
                    Create Project
                  </button>
                </form>
              </div>

              {/* Task Assigner Panel (Assign Interns) */}
              <div className="bg-marketing-bg-raised border border-marketing-border p-6">
                <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4">Assign Task to Intern</h4>
                <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <select 
                    value={newTask.projectId}
                    onChange={e => setNewTask({ ...newTask, projectId: e.target.value })}
                    className="bg-marketing-bg border border-marketing-border p-3 text-xs outline-none focus:border-marketing-accent text-marketing-fg cursor-pointer"
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                  <select 
                    value={newTask.internId}
                    onChange={e => setNewTask({ ...newTask, internId: e.target.value })}
                    className="bg-marketing-bg border border-marketing-border p-3 text-xs outline-none focus:border-marketing-accent text-marketing-fg cursor-pointer"
                  >
                    <option value="">Select Intern</option>
                    {interns.map(i => (
                      <option key={i.id} value={i.id}>{i.full_name || i.email}</option>
                    ))}
                  </select>
                  <select 
                    value={newTask.category}
                    onChange={e => setNewTask({ ...newTask, category: e.target.value as 'Frontend' | 'Backend' | 'Design Sys' | 'Management' | 'Operations' | 'Other' })}
                    className="bg-marketing-bg border border-marketing-border p-3 text-xs outline-none focus:border-marketing-accent text-marketing-fg cursor-pointer"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Design Sys">Design Sys</option>
                    <option value="Management">Management</option>
                    <option value="Operations">Operations</option>
                    <option value="Other">Other</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Task Title (e.g. API Integration)"
                    required
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    className="bg-marketing-bg border border-marketing-border p-3 text-xs outline-none focus:border-marketing-accent text-marketing-fg"
                  />
                  <button 
                    type="submit" 
                    disabled={creatingTask}
                    className="bg-marketing-accent text-marketing-accent-ink py-3 hover:bg-marketing-fg transition-colors flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
                  >
                    {creatingTask ? <Loader className="animate-spin" size={14} /> : <UserCheck size={14} />}
                    Assign Task
                  </button>
                </form>
              </div>

              {/* Projects Table */}
              <div className="bg-marketing-bg-raised border border-marketing-border p-6">
                <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4">Managed Projects</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm font-marketing-sans text-marketing-muted">
                    <thead>
                      <tr className="border-b border-marketing-border font-marketing-mono text-[10px] uppercase text-marketing-muted/70 tracking-widest pb-3">
                        <th className="pb-3">Project</th>
                        <th className="pb-3">Client Email</th>
                        <th className="pb-3">Budget</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-marketing-border">
                      {filteredProjects.map(proj => (
                        <tr key={proj.id} className="hover:bg-marketing-bg/45 transition-colors">
                          <td className="py-4 font-semibold text-marketing-fg">
                            {proj.title}
                            {proj.is_showcase && (
                              <span className="ml-2 bg-marketing-accent/20 text-marketing-accent text-[10px] font-mono px-1.5 py-0.5">
                                Showcase
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-xs">{proj.profiles?.email || 'No client assigned'}</td>
                          <td className="py-4 font-marketing-mono text-xs">${Number(proj.estimated_budget || 0).toLocaleString()}</td>
                          <td className="py-4">
                            <select
                              value={proj.status || ''}
                              onChange={e => handleUpdateProjectStatus(proj.id, e.target.value)}
                              className="bg-marketing-bg border border-marketing-border text-marketing-fg font-marketing-mono text-xs p-1.5 focus:border-marketing-accent outline-none cursor-pointer capitalize"
                            >
                              <option value="planning">planning</option>
                              <option value="in_progress">in progress</option>
                              <option value="review">review</option>
                              <option value="completed">completed</option>
                            </select>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setShowcaseProject(proj)
                                  setShowcaseForm({
                                    isShowcase: proj.is_showcase || false,
                                    showcaseImageUrl: proj.showcase_image_url || '',
                                    showcaseTags: (proj.showcase_tags || []).join(', ')
                                  })
                                  setShowcaseOpen(true)
                                }}
                                className="p-1 hover:text-marketing-accent transition-colors cursor-pointer"
                                title="Showcase Settings"
                              >
                                <Settings size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProject(proj.id)}
                                className="p-1 hover:text-red-400 transition-colors cursor-pointer"
                                title="Delete Project"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CLIENTS TAB */}
          {activeTab === 'clients' && (
            <div className="bg-marketing-bg-raised border border-marketing-border p-6">
              <h3 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-6">Client Accounts</h3>
              <div className="divide-y divide-marketing-border">
                {filteredClients.map(cli => (
                  <div key={cli.id} className="py-4 flex justify-between items-center text-xs md:text-sm">
                    <div>
                      <p className="font-semibold text-marketing-fg">{cli.full_name || 'Client Partner'}</p>
                      <p className="text-marketing-muted font-marketing-mono text-xs mt-0.5">{cli.email}</p>
                    </div>
                    <span className="font-marketing-mono text-[10px] text-marketing-muted bg-marketing-border px-2 py-1">CLIENT</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="bg-marketing-bg-raised border border-marketing-border p-6">
              <h3 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-6">Razorpay Payments Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-marketing-sans text-marketing-muted">
                  <thead>
                    <tr className="border-b border-marketing-border font-marketing-mono text-[10px] uppercase text-marketing-muted/70 tracking-widest pb-3">
                      <th className="pb-3">Payment ID</th>
                      <th className="pb-3">Client Email</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Package Tier</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-marketing-border">
                    {filteredPayments.map(pay => (
                      <tr key={pay.id} className="hover:bg-marketing-bg/45 transition-colors">
                        <td className="py-4 font-marketing-mono text-xs truncate max-w-[120px]" title={pay.razorpay_payment_id || pay.id}>
                          {pay.razorpay_payment_id || 'Pending Receipt'}
                        </td>
                        <td className="py-4 text-xs">{pay.profiles?.email || 'N/A'}</td>
                        <td className="py-4 font-marketing-mono text-xs text-marketing-fg">${Number(pay.amount).toLocaleString()}</td>
                        <td className="py-4 font-semibold text-marketing-fg capitalize">{pay.package_type}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 text-[10px] font-marketing-mono uppercase ${
                            pay.status === 'completed' ? 'bg-marketing-accent/10 text-marketing-accent' : 'bg-marketing-accent/10 text-marketing-accent'
                          }`}>
                            {pay.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INTERNS TAB */}
          {activeTab === 'interns' && (
            <div className="space-y-6">
              {/* Intern Applications */}
              <div className="bg-marketing-bg-raised border border-marketing-border p-6">
                <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4">Pending Career Applications</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm font-marketing-sans text-marketing-muted">
                    <thead>
                      <tr className="border-b border-marketing-border font-marketing-mono text-[10px] uppercase text-marketing-muted/70 tracking-widest pb-3">
                        <th className="pb-3">Applicant</th>
                        <th className="pb-3">Details / Skills</th>
                        <th className="pb-3">Resume</th>
                        <th className="pb-3 text-right">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-marketing-border">
                      {filteredApplications.map(app => (
                        <tr key={app.id} className="hover:bg-marketing-bg/45 transition-colors">
                          <td className="py-4 text-xs">
                            <p className="font-semibold text-marketing-fg">{app.full_name}</p>
                            <p className="text-marketing-muted mt-0.5">{app.email}</p>
                            <p className="text-marketing-muted">{app.phone || 'No phone'}</p>
                          </td>
                          <td className="py-4 text-xs">
                            <p className="text-marketing-fg"><span className="text-marketing-accent font-semibold">Skills:</span> {app.skills || 'None'}</p>
                            <p className="text-marketing-muted"><span className="text-marketing-fg">Techs:</span> {app.technologies || 'None'}</p>
                          </td>
                          <td className="py-4 text-xs">
                            {app.resume_url ? (
                              <button 
                                onClick={() => handleDownloadResume(app.resume_url!)}
                                className="flex items-center gap-1.5 text-marketing-accent hover:underline cursor-pointer"
                              >
                                <Eye size={14} /> View Resume
                              </button>
                            ) : (
                              <span>No File</span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            {app.status === 'pending' ? (
                              <div className="flex gap-2 justify-end">
                                <button 
                                  onClick={() => handleApplicationAction(app.id, 'approved')}
                                  className="p-1.5 bg-marketing-accent/10 hover:bg-marketing-accent/20 text-marketing-accent cursor-pointer text-xs flex items-center gap-1"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleApplicationAction(app.id, 'rejected')}
                                  className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 cursor-pointer text-xs flex items-center gap-1"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : app.status === 'approved' ? (
                              <div className="flex gap-2 justify-end items-center">
                                {interns.some(i => i.email === app.email) ? (
                                  <span className="font-marketing-mono text-[10px] uppercase text-marketing-accent tracking-widest bg-marketing-accent/10 px-2 py-0.5">Registered</span>
                                ) : (
                                  <button
                                    onClick={() => handleInviteIntern(app)}
                                    className="p-1.5 bg-marketing-accent/20 hover:bg-marketing-accent/30 text-marketing-accent cursor-pointer text-[10px] font-semibold flex items-center gap-1"
                                    title="Send Supabase Invite Email"
                                  >
                                    Invite Intern
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="font-marketing-mono text-[10px] uppercase text-red-400 tracking-widest bg-red-500/10 px-2 py-0.5">{app.status}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredApplications.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-marketing-muted">No career applications found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Profiles Pending Onboarding */}
              {interns.filter(profile => !internsList.some(int => int.profile_id === profile.id)).length > 0 && (
                <div className="bg-marketing-bg-raised border border-marketing-border p-6">
                  <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4 flex items-center gap-2">
                    <UserPlus size={16} className="text-marketing-accent" /> Registered Interns Pending Onboarding
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-marketing-sans text-marketing-muted">
                      <thead>
                        <tr className="border-b border-marketing-border font-marketing-mono text-[10px] uppercase text-marketing-muted/70 tracking-widest pb-3">
                          <th className="pb-3">Name</th>
                          <th className="pb-3">Email</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-marketing-border">
                        {interns.filter(profile => !internsList.some(int => int.profile_id === profile.id)).map(profile => (
                          <tr key={profile.id} className="hover:bg-marketing-bg/45 transition-colors">
                            <td className="py-3 text-xs font-semibold text-marketing-fg">{profile.full_name || 'Anonymous Intern'}</td>
                            <td className="py-3 text-xs font-marketing-mono">{profile.email}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => {
                                  setOnboardingProfile({ id: profile.id, name: profile.full_name || '', email: profile.email })
                                  setOnboardOpen(true)
                                }}
                                className="px-3 py-1 bg-marketing-accent text-marketing-accent-ink text-xs hover:bg-marketing-fg transition-colors cursor-pointer"
                              >
                                Onboard Intern
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Active Intern Cohort Roster */}
              <div className="bg-marketing-bg-raised border border-marketing-border p-6">
                <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4">Active Intern Cohort</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm font-marketing-sans text-marketing-muted">
                    <thead>
                      <tr className="border-b border-marketing-border font-marketing-mono text-[10px] uppercase text-marketing-muted/70 tracking-widest pb-3">
                        <th className="pb-3">Intern ID</th>
                        <th className="pb-3">Name & Email</th>
                        <th className="pb-3">Department</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Dates (Start - End)</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-marketing-border">
                      {filteredCohortInterns.map(int => (
                        <tr key={int.id} className="hover:bg-marketing-bg/45 transition-colors">
                          <td className="py-4 font-marketing-mono text-xs text-marketing-fg font-semibold">{int.intern_id}</td>
                          <td className="py-4 text-xs">
                            <p className="font-semibold text-marketing-fg">{int.profiles?.full_name}</p>
                            <p className="text-marketing-muted font-marketing-mono mt-0.5">{int.profiles?.email}</p>
                          </td>
                          <td className="py-4 text-xs capitalize font-semibold text-marketing-fg">{int.department}</td>
                          <td className="py-4 text-xs">
                            <span className={`px-2 py-0.5 text-[10px] font-marketing-mono uppercase font-semibold ${
                              int.status === 'active' ? 'bg-marketing-accent/10 text-marketing-accent' :
                              int.status === 'completed' ? 'bg-marketing-accent/10 text-marketing-accent' :
                              'bg-red-500/10 text-red-400'
                            }`}>
                              {int.status}
                            </span>
                          </td>
                          <td className="py-4 font-marketing-mono text-xs text-marketing-fg">
                            {int.start_date} {int.end_date ? `to ${int.end_date}` : '(Ongoing)'}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setSelectedIntern(int)
                                  const deptName = int.department === 'engineering' ? 'Software Engineering' :
                                                   int.department === 'design' ? 'UI/UX Design' :
                                                   int.department === 'marketing' ? 'Marketing' :
                                                   int.department === 'operations' ? 'Operations' :
                                                   int.department === 'management' ? 'Management & Operations' : int.department;
                                  setIssuanceForm({
                                    title: 'Certificate of Internship Completion',
                                    description: `For successfully completing their internship as a ${deptName} Intern.`,
                                    validUntil: ''
                                  })
                                  setIssueOpen(true)
                                }}
                                className="px-2 py-1 bg-marketing-bg hover:bg-marketing-border border border-marketing-border-strong text-marketing-fg text-[10px] font-semibold cursor-pointer"
                                title="Issue Certificate"
                              >
                                Issue Cert
                              </button>
                              {int.status === 'active' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateInternStatus(int.id, 'completed')}
                                    className="p-1 bg-marketing-accent/10 hover:bg-marketing-accent/20 text-marketing-accent cursor-pointer"
                                    title="Complete Internship"
                                  >
                                    <CheckCircle2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateInternStatus(int.id, 'revoked')}
                                    className="p-1 bg-red-500/20 hover:bg-red-500/45 text-red-400 cursor-pointer"
                                    title="Revoke Internship"
                                  >
                                    <UserMinus size={14} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleUpdateInternStatus(int.id, 'archived')}
                                className="p-1 hover:text-red-400 transition-colors cursor-pointer"
                                title="Archive (Soft Delete)"
                              >
                                <Trash2 size={14} />
                              </button>
                              <Link
                                href={`/intern/${int.intern_id}`}
                                target="_blank"
                                className="p-1 hover:text-marketing-accent transition-colors flex items-center justify-center text-marketing-muted"
                                title="View Public Profile"
                              >
                                <ExternalLink size={14} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredCohortInterns.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-marketing-muted">No interns in the cohort match the query.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Project Contributor Assignments Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                {/* Contributor Assignment Form */}
                <div className="bg-marketing-bg-raised border border-marketing-border p-6 lg:col-span-1">
                  <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ClipboardList size={16} className="text-marketing-accent" /> Assign Project Contributor
                  </h4>
                  <form onSubmit={handleAssignContributor} className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Select Project</label>
                      <select
                        required
                        value={contributorForm.projectId}
                        onChange={e => setContributorForm({ ...contributorForm, projectId: e.target.value })}
                        className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 outline-none focus:border-marketing-accent cursor-pointer w-full"
                      >
                        <option value="">Select Project</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Select Intern</label>
                      <select
                        required
                        value={contributorForm.internId}
                        onChange={e => setContributorForm({ ...contributorForm, internId: e.target.value })}
                        className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 outline-none focus:border-marketing-accent cursor-pointer w-full"
                      >
                        <option value="">Select Onboarded Intern</option>
                        {internsList.map(i => (
                          <option key={i.id} value={i.id}>{i.profiles?.full_name} ({i.intern_id})</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Attribution Role</label>
                      <select
                        value={contributorForm.role}
                        onChange={e => setContributorForm({ ...contributorForm, role: e.target.value as any })}
                        className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 outline-none focus:border-marketing-accent cursor-pointer w-full"
                      >
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="lead">Lead</option>
                        <option value="reviewer">Reviewer</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Contribution Summary</label>
                      <textarea
                        placeholder="Brief summary of their contributions (e.g. Developed the entire auth backend...)"
                        value={contributorForm.contributionSummary}
                        onChange={e => setContributorForm({ ...contributorForm, contributionSummary: e.target.value })}
                        className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 outline-none focus:border-marketing-accent w-full h-20 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Start Date</label>
                        <input
                          type="date"
                          value={contributorForm.startDate}
                          onChange={e => setContributorForm({ ...contributorForm, startDate: e.target.value })}
                          className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2 focus:border-marketing-accent outline-none w-full"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">End Date</label>
                        <input
                          type="date"
                          value={contributorForm.endDate}
                          onChange={e => setContributorForm({ ...contributorForm, endDate: e.target.value })}
                          className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2 focus:border-marketing-accent outline-none w-full"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingContributor}
                      className="w-full bg-marketing-accent text-marketing-accent-ink py-2.5 hover:bg-marketing-fg transition-colors font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submittingContributor ? <Loader className="animate-spin" size={14} /> : <Plus size={14} />}
                      Assign Contributor
                    </button>
                  </form>
                </div>

                {/* Assignment List */}
                <div className="bg-marketing-bg-raised border border-marketing-border p-6 lg:col-span-2">
                  <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4">Active Project Attributions</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-marketing-sans text-marketing-muted">
                      <thead>
                        <tr className="border-b border-marketing-border font-marketing-mono text-[10px] uppercase text-marketing-muted/70 tracking-widest pb-3">
                          <th className="pb-3">Project</th>
                          <th className="pb-3">Contributor</th>
                          <th className="pb-3">Role</th>
                          <th className="pb-3">Dates</th>
                          <th className="pb-3 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-marketing-border">
                        {contributorsList.map(c => (
                          <tr key={c.id} className="hover:bg-marketing-bg/45 transition-colors">
                            <td className="py-3 text-xs font-semibold text-marketing-fg">{c.projects?.title}</td>
                            <td className="py-3 text-xs">
                              <p className="font-semibold text-marketing-fg">{c.interns?.profiles?.full_name}</p>
                              <p className="text-[10px] text-marketing-muted font-marketing-mono">{c.interns?.intern_id}</p>
                            </td>
                            <td className="py-3 text-xs">
                              <span className="bg-marketing-border px-2 py-0.5 text-[10px] font-marketing-mono capitalize text-marketing-fg">{c.role}</span>
                            </td>
                            <td className="py-3 text-xs font-marketing-mono">{c.start_date || 'N/A'} {c.end_date ? `to ${c.end_date}` : ''}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleRemoveContributor(c.id)}
                                className="p-1 hover:text-red-400 transition-colors cursor-pointer"
                                title="Remove Contributor"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {contributorsList.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-marketing-muted">No contributor attributions assigned yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Audit Log Panel */}
              <div className="bg-marketing-bg-raised border border-marketing-border p-6">
                <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Shield size={16} className="text-marketing-accent" /> Admin Security Audit Trail
                </h4>
                <div className="overflow-y-auto max-h-72 divide-y divide-marketing-border">
                  {auditLogsList.map(log => (
                    <div key={log.id} className="py-3 flex flex-col md:flex-row md:justify-between md:items-center text-xs gap-1 md:gap-4 hover:bg-marketing-bg/30 px-2 transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-marketing-mono text-[10px] font-semibold text-marketing-accent uppercase bg-marketing-accent/10 px-1.5 py-0.5">
                            {log.action}
                          </span>
                          <span className="text-[10px] text-marketing-muted font-marketing-mono">
                            Target: {log.target_type} ({log.target_id?.slice(0, 8)})
                          </span>
                        </div>
                        <p className="text-marketing-muted text-[11px]">
                          Actor: <span className="text-marketing-fg font-semibold">{log.profiles?.full_name || log.profiles?.email || 'System'}</span>
                        </p>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <pre className="text-[10px] text-marketing-muted font-marketing-mono bg-black/40 p-1.5 border border-marketing-border max-w-xl overflow-x-auto mt-1">
                            {JSON.stringify(log.details)}
                          </pre>
                        )}
                      </div>
                      <span className="text-[10px] text-marketing-muted/70 font-marketing-mono shrink-0">
                        {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  ))}
                  {auditLogsList.length === 0 && (
                    <div className="py-8 text-center text-marketing-muted text-xs font-marketing-mono">No audit logs found.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CERTIFICATES TAB */}
          {activeTab === 'certificates' && (
            <div className="bg-marketing-bg-raised border border-marketing-border p-6">
              <h3 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-6">Verification Certificates Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-marketing-sans text-marketing-muted">
                  <thead>
                    <tr className="border-b border-marketing-border font-marketing-mono text-[10px] uppercase text-marketing-muted/70 tracking-widest pb-3">
                      <th className="pb-3">Certificate ID</th>
                      <th className="pb-3">Intern Cohort</th>
                      <th className="pb-3">Certificate Title</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Issued / Valid Until</th>
                      <th className="pb-3 text-right">Verification Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-marketing-border">
                    {filteredCertificates.map(cert => (
                      <tr key={cert.id} className="hover:bg-marketing-bg/45 transition-colors">
                        <td className="py-4 font-marketing-mono text-xs text-marketing-fg font-semibold">{cert.certificate_id}</td>
                        <td className="py-4 text-xs">
                          <p className="font-semibold text-marketing-fg">{cert.interns?.profiles?.full_name}</p>
                          <p className="text-[10px] text-marketing-muted font-marketing-mono">{cert.interns?.intern_id}</p>
                        </td>
                        <td className="py-4 text-xs font-semibold text-marketing-fg">{cert.title}</td>
                        <td className="py-4 text-xs">
                          <span className={`px-2 py-0.5 text-[10px] font-marketing-mono uppercase font-semibold ${
                            cert.status === 'active' ? 'bg-marketing-accent/10 text-marketing-accent' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {cert.status}
                          </span>
                        </td>
                        <td className="py-4 font-marketing-mono text-xs text-marketing-fg">
                          <p>Issued: {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : 'N/A'}</p>
                          {cert.valid_until && <p className="text-marketing-muted">Expires: {new Date(cert.valid_until).toLocaleDateString()}</p>}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            {cert.qr_code_url && (
                              <a
                                href={cert.qr_code_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-marketing-bg hover:bg-marketing-border border border-marketing-border-strong text-marketing-fg text-[10px] font-semibold cursor-pointer"
                                title="View QR Code"
                              >
                                View QR
                              </a>
                            )}
                            <Link
                              href={`/verify/${cert.certificate_id}`}
                              target="_blank"
                              className="p-1 hover:text-marketing-accent transition-colors flex items-center justify-center text-marketing-muted"
                              title="Verify Certificate link"
                            >
                              <ExternalLink size={15} />
                            </Link>
                            {cert.status === 'active' && (
                              <button
                                onClick={() => {
                                  setSelectedCert(cert)
                                  setRevocationReason('')
                                  setRevokeOpen(true)
                                }}
                                className="p-1 bg-red-500/20 hover:bg-red-500/45 text-red-400 cursor-pointer"
                                title="Revoke Certificate"
                              >
                                <ShieldAlert size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCertificates.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-marketing-muted">No certificates match search criteria.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CAREERS TAB */}
          {activeTab === 'careers' && (
            <div className="space-y-6">
              {/* Provision New Job Posting */}
              <div className="bg-marketing-bg-raised border border-marketing-border p-6">
                <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4">Create New Job Posting</h4>
                <form onSubmit={handleCreateJobPosting} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Job Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. AI Engineering Intern"
                        required
                        value={newJob.title}
                        onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                        className="bg-marketing-bg border border-marketing-border p-3 text-xs outline-none focus:border-marketing-accent text-marketing-fg w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Track / Department</label>
                      <select 
                        value={newJob.track}
                        onChange={e => setNewJob({ ...newJob, track: e.target.value })}
                        className="bg-marketing-bg border border-marketing-border p-3 text-xs outline-none focus:border-marketing-accent text-marketing-fg cursor-pointer w-full"
                      >
                        <option value="Full Stack">Full Stack</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Management">Management</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Requirements / Skills (comma-separated)</label>
                      <input 
                        type="text" 
                        placeholder="TypeScript, SQL, Project Management"
                        value={newJob.requirements}
                        onChange={e => setNewJob({ ...newJob, requirements: e.target.value })}
                        className="bg-marketing-bg border border-marketing-border p-3 text-xs outline-none focus:border-marketing-accent text-marketing-fg w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Job Description</label>
                    <textarea 
                      placeholder="Enter detailed job description..."
                      required
                      value={newJob.description}
                      onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                      className="bg-marketing-bg border border-marketing-border p-3 text-xs outline-none focus:border-marketing-accent text-marketing-fg w-full h-24 resize-none"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={creatingJob}
                      className="bg-marketing-accent text-marketing-accent-ink px-6 py-2.5 hover:bg-marketing-fg transition-colors flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
                    >
                      {creatingJob ? <Loader className="animate-spin" size={14} /> : <Plus size={14} />}
                      Create Job Posting
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Job Postings List */}
              <div className="bg-marketing-bg-raised border border-marketing-border p-6">
                <h4 className="font-marketing-mono text-xs font-semibold text-marketing-fg uppercase tracking-widest mb-4">Job Postings Ledger</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm font-marketing-sans text-marketing-muted">
                    <thead>
                      <tr className="border-b border-marketing-border font-marketing-mono text-[10px] uppercase text-marketing-muted/70 tracking-widest pb-3">
                        <th className="pb-3">Title</th>
                        <th className="pb-3">Track</th>
                        <th className="pb-3">Skills / Requirements</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Created At</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-marketing-border">
                      {jobPostings.map(job => (
                        <tr key={job.id} className="hover:bg-marketing-bg/45 transition-colors">
                          <td className="py-4 font-semibold text-marketing-fg text-xs">{job.title}</td>
                          <td className="py-4 text-xs font-semibold text-marketing-accent">{job.track}</td>
                          <td className="py-4 text-xs">
                            <div className="flex flex-wrap gap-1">
                              {job.requirements?.map((req, idx) => (
                                <span key={idx} className="bg-marketing-border px-2 py-0.5 text-[10px] text-marketing-muted">{req}</span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 text-xs">
                            <span className={`px-2.5 py-0.5 text-[10px] font-marketing-mono uppercase font-semibold border ${
                              job.status === 'open' 
                                ? 'bg-marketing-accent/10 text-marketing-accent border-green-500/20' 
                                : 'bg-marketing-border text-marketing-muted border-marketing-border-strong'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="py-4 font-marketing-mono text-[10px] text-marketing-muted">
                            {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleToggleJobStatus(job.id, job.status)}
                                className="px-2 py-1 bg-marketing-bg hover:bg-marketing-border border border-marketing-border-strong text-marketing-fg text-[10px] font-semibold cursor-pointer"
                                title="Toggle Status"
                              >
                                {job.status === 'open' ? 'Close Posting' : 'Open Posting'}
                              </button>
                              <button
                                onClick={() => handleDeleteJobPosting(job.id)}
                                className="p-1 hover:text-red-400 transition-colors cursor-pointer text-marketing-muted"
                                title="Delete Posting"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {jobPostings.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-marketing-muted">No job postings found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- DIALOG MODALS LAYER --- */}

      {/* 1. Onboarding Form Dialog */}
      {onboardOpen && onboardingProfile && (
        <div className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-marketing-bg-raised border border-marketing-border max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-marketing-border pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-marketing-fg uppercase tracking-wider">Onboard Intern Record</h3>
                <p className="text-[10px] text-marketing-muted font-marketing-mono">Profile: {onboardingProfile.email}</p>
              </div>
              <button 
                onClick={() => { setOnboardOpen(false); setOnboardingProfile(null); }} 
                className="text-marketing-muted hover:text-marketing-fg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleOnboardIntern} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Department</label>
                <select
                  value={onboardingForm.department}
                  onChange={e => setOnboardingForm({ ...onboardingForm, department: e.target.value })}
                  className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 outline-none focus:border-marketing-accent cursor-pointer w-full"
                >
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="operations">Operations</option>
                  <option value="management">Management</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Start Date</label>
                <input
                  type="date"
                  required
                  value={onboardingForm.startDate}
                  onChange={e => setOnboardingForm({ ...onboardingForm, startDate: e.target.value })}
                  className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 focus:border-marketing-accent outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Short Biography</label>
                <textarea
                  placeholder="Tell us about this intern..."
                  value={onboardingForm.bio}
                  onChange={e => setOnboardingForm({ ...onboardingForm, bio: e.target.value })}
                  className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 outline-none focus:border-marketing-accent w-full h-20 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Skills (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Next.js, Figma"
                  value={onboardingForm.skills}
                  onChange={e => setOnboardingForm({ ...onboardingForm, skills: e.target.value })}
                  className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 focus:border-marketing-accent outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">GitHub Profile URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={onboardingForm.githubUrl}
                  onChange={e => setOnboardingForm({ ...onboardingForm, githubUrl: e.target.value })}
                  className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 focus:border-marketing-accent outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={onboardingForm.linkedinUrl}
                  onChange={e => setOnboardingForm({ ...onboardingForm, linkedinUrl: e.target.value })}
                  className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 focus:border-marketing-accent outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Portfolio URL</label>
                <input
                  type="url"
                  placeholder="https://myportfolio.com"
                  value={onboardingForm.portfolioUrl}
                  onChange={e => setOnboardingForm({ ...onboardingForm, portfolioUrl: e.target.value })}
                  className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 focus:border-marketing-accent outline-none w-full"
                />
              </div>

              <button
                type="submit"
                disabled={submittingOnboard}
                className="w-full bg-marketing-accent text-marketing-accent-ink py-3 hover:bg-marketing-fg transition-colors font-bold text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {submittingOnboard ? <Loader className="animate-spin" size={14} /> : <UserCheck size={14} />}
                Confirm Onboarding
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Certificate Issuance Modal */}
      {issueOpen && selectedIntern && (
        <div className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-marketing-bg-raised border border-marketing-border max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-marketing-border pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-marketing-fg uppercase tracking-wider">Issue Verification Certificate</h3>
                <p className="text-[10px] text-marketing-muted font-marketing-mono">Recipient: {selectedIntern.profiles?.full_name} ({selectedIntern.intern_id})</p>
              </div>
              <button 
                onClick={() => { setIssueOpen(false); setSelectedIntern(null); }} 
                className="text-marketing-muted hover:text-marketing-fg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleIssueCertificate} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Certificate Title</label>
                <input
                  type="text"
                  required
                  value={issuanceForm.title}
                  onChange={e => setIssuanceForm({ ...issuanceForm, title: e.target.value })}
                  className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 focus:border-marketing-accent outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Description / Achievement Summary</label>
                <textarea
                  placeholder="Detail what achievements this certificate acknowledges..."
                  value={issuanceForm.description}
                  onChange={e => setIssuanceForm({ ...issuanceForm, description: e.target.value })}
                  className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 outline-none focus:border-marketing-accent w-full h-24 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Validity Limit (Optional Expiration)</label>
                <input
                  type="date"
                  value={issuanceForm.validUntil}
                  onChange={e => setIssuanceForm({ ...issuanceForm, validUntil: e.target.value })}
                  className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 focus:border-marketing-accent outline-none w-full"
                />
              </div>

              <button
                type="submit"
                disabled={submittingIssue}
                className="w-full bg-marketing-accent text-marketing-accent-ink py-3 hover:bg-marketing-fg transition-colors font-bold text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {submittingIssue ? <Loader className="animate-spin" size={14} /> : <Award size={14} />}
                Generate & Publish Certificate
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Certificate Revocation Modal */}
      {revokeOpen && selectedCert && (
        <div className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-marketing-bg-raised border border-marketing-border max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-marketing-border pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Revoke Certificate</h3>
                <p className="text-[10px] text-marketing-muted font-marketing-mono">ID: {selectedCert.certificate_id}</p>
              </div>
              <button 
                onClick={() => { setRevokeOpen(false); setSelectedCert(null); }} 
                className="text-marketing-muted hover:text-marketing-fg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleRevokeCertificate} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Reason for Revocation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Intern did not meet cohort requirements / disciplinary action"
                  value={revocationReason}
                  onChange={e => setRevocationReason(e.target.value)}
                  className="bg-marketing-bg border border-red-500/30 text-marketing-fg text-xs p-2.5 focus:border-red-500 outline-none w-full"
                />
              </div>

              <div className="bg-red-500/10 border border-red-500/20 p-3 text-[11px] text-red-400 flex items-start gap-2">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <p>
                  <strong>Warning:</strong> Revocation is a soft-delete status update but will immediately invalidate the certificate public verify page. This action cannot be easily undone.
                </p>
              </div>

              <button
                type="submit"
                disabled={submittingRevoke}
                className="w-full bg-red-500 text-white hover:bg-red-600 py-3 transition-colors font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {submittingRevoke ? <Loader className="animate-spin" size={14} /> : <ShieldAlert size={14} />}
                Confirm Certificate Revocation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Showcase Settings Modal */}
      {showcaseOpen && showcaseProject && (
        <div className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-marketing-bg-raised border border-marketing-border max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-marketing-border pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-marketing-fg uppercase tracking-wider">Public Showcase Settings</h3>
                <p className="text-[10px] text-marketing-muted font-marketing-mono">Project: {showcaseProject.title}</p>
              </div>
              <button 
                onClick={() => { setShowcaseOpen(false); setShowcaseProject(null); }} 
                className="text-marketing-muted hover:text-marketing-fg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveShowcase} className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isShowcaseCheckbox"
                  checked={showcaseForm.isShowcase}
                  onChange={e => setShowcaseForm({ ...showcaseForm, isShowcase: e.target.checked })}
                  className="bg-marketing-bg border border-marketing-border outline-none focus:ring-marketing-accent w-4 h-4 cursor-pointer text-marketing-accent"
                />
                <label htmlFor="isShowcaseCheckbox" className="font-semibold text-xs text-marketing-fg cursor-pointer">
                  Feature in Public Portfolio Showcase
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Showcase Image URL</label>
                <input
                  type="url"
                  placeholder="https://mybucket.supabase.co/storage/v1/object/public/showcase/img.jpg"
                  value={showcaseForm.showcaseImageUrl}
                  onChange={e => setShowcaseForm({ ...showcaseForm, showcaseImageUrl: e.target.value })}
                  className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 focus:border-marketing-accent outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-marketing-mono text-[10px] text-marketing-muted uppercase">Showcase Tech Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Next.js, Tailwind CSS, Supabase, PostgreSQL"
                  value={showcaseForm.showcaseTags}
                  onChange={e => setShowcaseForm({ ...showcaseForm, showcaseTags: e.target.value })}
                  className="bg-marketing-bg border border-marketing-border text-marketing-fg text-xs p-2.5 focus:border-marketing-accent outline-none w-full"
                />
              </div>

              <button
                type="submit"
                disabled={submittingShowcase}
                className="w-full bg-marketing-accent text-marketing-accent-ink py-3 hover:bg-marketing-fg transition-colors font-bold text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {submittingShowcase ? <Loader className="animate-spin" size={14} /> : <Settings size={14} />}
                Save Showcase Configuration
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

