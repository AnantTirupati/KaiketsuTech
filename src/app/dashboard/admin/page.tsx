'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import TopAppBar from '@/components/shared/TopAppBar'
import { 
  DollarSign, Briefcase, Percent, TrendingUp, PlusCircle, 
  Award, CheckCircle2, ArrowRight, UserCheck, Trash2, 
  UserMinus, Users, Check, X, ShieldAlert, Loader, Eye, Plus, Layers, LogOut
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'projects' | 'clients' | 'payments' | 'interns'>('overview')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // System Entities State
  const [leads, setLeads] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [interns, setInterns] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])

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
    category: 'Frontend' as 'Frontend' | 'Backend' | 'Design Sys' | 'Other'
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

      setLeads(leadData || [])
      setProjects(projData || [])
      setClients(clientData || [])
      setPayments(payData || [])
      setInterns(internData || [])
      setApplications(appData || [])

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

    setLeads(leadData || [])
    setProjects(projData || [])
    setPayments(payData || [])
    setApplications(appData || [])
    setInterns(internData || [])
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
    } catch (err: any) {
      toast(err.message || 'Action failed.', 'error')
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
    } catch (err: any) {
      toast(err.message || 'Failed to create project.', 'error')
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
      } catch (err: any) {
        toast('Failed to delete project.', 'error')
      }
    }
  }

  // Project Status Update
  const handleUpdateProjectStatus = async (projId: string, nextStatus: any) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: nextStatus })
        .eq('id', projId)

      if (error) throw error
      toast('Project status updated.', 'success')
      reloadData()
    } catch (err: any) {
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
    } catch (err: any) {
      toast(err.message || 'Failed to assign task.', 'error')
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
    } catch (err: any) {
      toast(err.message || 'Action failed.', 'error')
    }
  }

  const handleInviteIntern = async (application: any) => {
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
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Failed to send invitation. Please verify SUPABASE_SERVICE_ROLE_KEY configuration.', 'error')
    }
  }

  const handleDownloadResume = async (resumePath: string) => {
    try {
      const { data, error } = await supabase.storage.from('resumes').createSignedUrl(resumePath, 60)
      if (error) throw error
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      }
    } catch (err: any) {
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
    } catch (err: any) {
      toast('Failed to update intern rating.', 'error')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#0B0B0B]">
        <Loader className="animate-spin text-primary" size={36} />
      </div>
    )
  }

  // Analytics helper metrics
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0)
  const activeProjectsCount = projects.filter(p => p.status !== 'completed').length

  return (
    <div className="bg-[#0B0B0B] text-on-surface antialiased min-h-screen flex font-body-md overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="bg-surface-container-low w-64 h-screen border-r border-[#222] flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="p-6 border-b border-[#222]">
            <img src="/weblogo.svg" alt="Kaiketsu Logo" className="h-10 w-auto" />
            <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest mt-2 font-bold font-black">Admin Console</p>
          </div>
          <nav className="px-4 py-6 space-y-1">
            {[
              { id: 'overview', label: 'Analytics Overview', icon: <TrendingUp size={18} /> },
              { id: 'leads', label: 'Requested Leads', icon: <Briefcase size={18} /> },
              { id: 'projects', label: 'Projects & Tasks', icon: <Layers size={18} /> },
              { id: 'clients', label: 'Client Accounts', icon: <Users size={18} /> },
              { id: 'payments', label: 'Payments Ledger', icon: <DollarSign size={18} /> },
              { id: 'interns', label: 'Intern & Careers', icon: <Award size={18} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary-container text-white' 
                    : 'text-on-surface-variant hover:bg-[#1a1a1a] hover:text-on-surface'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-[#222] flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold font-mono-sm text-xs">
              A
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-on-surface truncate">{user?.email}</span>
              <span className="text-[10px] text-on-surface-variant font-mono-sm">Administrator</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-[#111111] hover:bg-[#1a1a1a] border border-[#222] text-on-surface py-2 rounded flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
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
        />

        {/* Scrollable Canvas */}
        <div className="flex-grow overflow-y-auto p-gutter pt-8 max-w-max-width w-full mx-auto space-y-6">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
                <div className="bg-[#111] border border-[#222] rounded-lg p-6 flex flex-col justify-between">
                  <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-[#4ade80] mt-2">${totalRevenue.toLocaleString()}</h3>
                </div>

                <div className="bg-[#111] border border-[#222] rounded-lg p-6 flex flex-col justify-between">
                  <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Active Projects</p>
                  <h3 className="text-3xl font-bold text-on-surface mt-2">{activeProjectsCount}</h3>
                </div>

                <div className="bg-[#111] border border-[#222] rounded-lg p-6 flex flex-col justify-between">
                  <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Registered Clients</p>
                  <h3 className="text-3xl font-bold text-on-surface mt-2">{clients.length}</h3>
                </div>

                <div className="bg-[#111] border border-[#222] rounded-lg p-6 flex flex-col justify-between">
                  <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Active Interns</p>
                  <h3 className="text-3xl font-bold text-on-surface mt-2">{interns.length}</h3>
                </div>
              </div>

              {/* Recent Orders / Quick lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                  <h4 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-4">Pending Requests (Leads)</h4>
                  <div className="divide-y divide-[#222222]">
                    {filteredLeads.filter(l => l.status === 'pending').slice(0, 5).map(lead => (
                      <div key={lead.id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-on-surface">{lead.project_title || 'Untitled Lead'}</p>
                          <p className="text-on-surface-variant mt-0.5">{lead.company_name}</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab('leads')}
                          className="text-primary hover:underline text-[10px] font-mono-sm uppercase"
                        >
                          Review
                        </button>
                      </div>
                    ))}
                    {filteredLeads.filter(l => l.status === 'pending').length === 0 && (
                      <div className="py-4 text-center text-on-surface-variant text-xs font-mono-sm">No pending leads.</div>
                    )}
                  </div>
                </div>

                <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                  <h4 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-4">Live Project Status</h4>
                  <div className="divide-y divide-[#222222]">
                    {filteredProjects.slice(0, 5).map(proj => (
                      <div key={proj.id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-on-surface">{proj.title}</p>
                          <p className="text-on-surface-variant mt-0.5 font-mono-sm text-[10px]">Client: {proj.profiles?.email || 'N/A'}</p>
                        </div>
                        <span className="bg-primary-container/10 text-primary px-2 py-0.5 rounded text-[10px] font-mono-sm capitalize">
                          {proj.status.replace('_', ' ')}
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
            <div className="bg-[#111] border border-[#222] rounded-lg p-6">
              <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-6">Requested Leads</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-body-md text-on-surface-variant">
                  <thead>
                    <tr className="border-b border-[#222] font-mono-sm text-[10px] uppercase text-on-surface-variant/70 tracking-widest pb-3">
                      <th className="pb-3">Lead / Company</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Budget</th>
                      <th className="pb-3">Urgency</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-[#1a1a1a]/45 transition-colors">
                        <td className="py-4">
                          <p className="font-semibold text-on-surface text-xs md:text-sm">{lead.project_title || 'Untitled Request'}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{lead.company_name}</p>
                        </td>
                        <td className="py-4 text-xs">
                          <p className="text-on-surface">{lead.first_name} {lead.last_name}</p>
                          <p className="text-on-surface-variant">{lead.work_email}</p>
                        </td>
                        <td className="py-4 font-mono-sm text-xs text-on-surface">${Number(lead.budget || 0).toLocaleString()}</td>
                        <td className="py-4 font-mono-sm text-xs capitalize">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            lead.priority === 'critical' || lead.priority === 'high' ? 'bg-error-container/20 text-error' : 'bg-[#222] text-on-surface-variant'
                          }`}>
                            {lead.priority || 'medium'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {lead.status === 'pending' ? (
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleLeadAction(lead.id, 'approved')}
                                className="p-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded cursor-pointer"
                                title="Approve & Create Project"
                              >
                                <Check size={16} />
                              </button>
                              <button 
                                onClick={() => handleLeadAction(lead.id, 'rejected')}
                                className="p-1 bg-error-container/20 hover:bg-error-container/40 text-error rounded cursor-pointer"
                                title="Reject Lead"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono-sm text-[10px] uppercase text-on-surface-variant/70 tracking-widest">{lead.status}</span>
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
              <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                <h4 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-4">Provision New Project</h4>
                <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input 
                    type="text" 
                    placeholder="Project Title"
                    required
                    value={newProject.title}
                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                    className="bg-[#0B0B0B] border border-[#222] rounded p-3 text-xs outline-none focus:border-primary text-on-surface"
                  />
                  <input 
                    type="text" 
                    placeholder="Project Description"
                    value={newProject.description}
                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                    className="bg-[#0B0B0B] border border-[#222] rounded p-3 text-xs outline-none focus:border-primary text-on-surface"
                  />
                  <select 
                    value={newProject.clientId}
                    onChange={e => setNewProject({ ...newProject, clientId: e.target.value })}
                    className="bg-[#0B0B0B] border border-[#222] rounded p-3 text-xs outline-none focus:border-primary text-on-surface cursor-pointer"
                  >
                    <option value="">Select Client Account</option>
                    {clients.map(cli => (
                      <option key={cli.id} value={cli.id}>{cli.email}</option>
                    ))}
                  </select>
                  <button 
                    type="submit" 
                    disabled={creatingProject}
                    className="bg-primary-container text-white py-3 rounded hover:bg-[#d8600d] transition-colors flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
                  >
                    {creatingProject ? <Loader className="animate-spin" size={14} /> : <Plus size={14} />}
                    Create Project
                  </button>
                </form>
              </div>

              {/* Task Assigner Panel (Assign Interns) */}
              <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                <h4 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-4">Assign Task to Intern</h4>
                <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select 
                    value={newTask.projectId}
                    onChange={e => setNewTask({ ...newTask, projectId: e.target.value })}
                    className="bg-[#0B0B0B] border border-[#222] rounded p-3 text-xs outline-none focus:border-primary text-on-surface cursor-pointer"
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                  <select 
                    value={newTask.internId}
                    onChange={e => setNewTask({ ...newTask, internId: e.target.value })}
                    className="bg-[#0B0B0B] border border-[#222] rounded p-3 text-xs outline-none focus:border-primary text-on-surface cursor-pointer"
                  >
                    <option value="">Select Intern</option>
                    {interns.map(i => (
                      <option key={i.id} value={i.id}>{i.full_name || i.email}</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Task Title (e.g. API Integration)"
                    required
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    className="bg-[#0B0B0B] border border-[#222] rounded p-3 text-xs outline-none focus:border-primary text-on-surface"
                  />
                  <button 
                    type="submit" 
                    disabled={creatingTask}
                    className="bg-primary-container text-white py-3 rounded hover:bg-[#d8600d] transition-colors flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
                  >
                    {creatingTask ? <Loader className="animate-spin" size={14} /> : <UserCheck size={14} />}
                    Assign Task
                  </button>
                </form>
              </div>

              {/* Projects Table */}
              <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                <h4 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-4">Managed Projects</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm font-body-md text-on-surface-variant">
                    <thead>
                      <tr className="border-b border-[#222] font-mono-sm text-[10px] uppercase text-on-surface-variant/70 tracking-widest pb-3">
                        <th className="pb-3">Project</th>
                        <th className="pb-3">Client Email</th>
                        <th className="pb-3">Budget</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {filteredProjects.map(proj => (
                        <tr key={proj.id} className="hover:bg-[#1a1a1a]/45 transition-colors">
                          <td className="py-4 font-semibold text-on-surface">{proj.title}</td>
                          <td className="py-4 text-xs">{proj.profiles?.email || 'No client assigned'}</td>
                          <td className="py-4 font-mono-sm text-xs">${Number(proj.estimated_budget || 0).toLocaleString()}</td>
                          <td className="py-4">
                            <select
                              value={proj.status}
                              onChange={e => handleUpdateProjectStatus(proj.id, e.target.value)}
                              className="bg-[#0B0B0B] border border-[#222] text-on-surface font-mono-sm text-xs rounded p-1.5 focus:border-primary outline-none cursor-pointer capitalize"
                            >
                              <option value="planning">planning</option>
                              <option value="in_progress">in progress</option>
                              <option value="review">review</option>
                              <option value="completed">completed</option>
                            </select>
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-1 hover:text-error transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 size={16} />
                            </button>
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
            <div className="bg-[#111] border border-[#222] rounded-lg p-6">
              <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-6">Client Accounts</h3>
              <div className="divide-y divide-[#222222]">
                {filteredClients.map(cli => (
                  <div key={cli.id} className="py-4 flex justify-between items-center text-xs md:text-sm">
                    <div>
                      <p className="font-semibold text-on-surface">{cli.full_name || 'Client Partner'}</p>
                      <p className="text-on-surface-variant font-mono-sm text-xs mt-0.5">{cli.email}</p>
                    </div>
                    <span className="font-mono-sm text-[10px] text-on-surface-variant bg-[#222] px-2 py-1 rounded">CLIENT</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="bg-[#111] border border-[#222] rounded-lg p-6">
              <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-6">Razorpay Payments Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-body-md text-on-surface-variant">
                  <thead>
                    <tr className="border-b border-[#222] font-mono-sm text-[10px] uppercase text-on-surface-variant/70 tracking-widest pb-3">
                      <th className="pb-3">Payment ID</th>
                      <th className="pb-3">Client Email</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Package Tier</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {filteredPayments.map(pay => (
                      <tr key={pay.id} className="hover:bg-[#1a1a1a]/45 transition-colors">
                        <td className="py-4 font-mono-sm text-xs truncate max-w-[120px]" title={pay.razorpay_payment_id || pay.id}>
                          {pay.razorpay_payment_id || 'Pending Receipt'}
                        </td>
                        <td className="py-4 text-xs">{pay.profiles?.email || 'N/A'}</td>
                        <td className="py-4 font-mono-sm text-xs text-on-surface">${Number(pay.amount).toLocaleString()}</td>
                        <td className="py-4 font-semibold text-on-surface capitalize">{pay.package_type}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono-sm uppercase ${
                            pay.status === 'completed' ? 'bg-green-500/10 text-[#4ade80]' : 'bg-primary-container/10 text-primary'
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
              <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                <h4 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-4">Pending Career Applications</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm font-body-md text-on-surface-variant">
                    <thead>
                      <tr className="border-b border-[#222] font-mono-sm text-[10px] uppercase text-on-surface-variant/70 tracking-widest pb-3">
                        <th className="pb-3">Applicant</th>
                        <th className="pb-3">Details / Skills</th>
                        <th className="pb-3">Resume</th>
                        <th className="pb-3 text-right">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {filteredApplications.map(app => (
                        <tr key={app.id} className="hover:bg-[#1a1a1a]/45 transition-colors">
                          <td className="py-4 text-xs">
                            <p className="font-semibold text-on-surface">{app.full_name}</p>
                            <p className="text-on-surface-variant mt-0.5">{app.email}</p>
                            <p className="text-on-surface-variant">{app.phone || 'No phone'}</p>
                          </td>
                          <td className="py-4 text-xs">
                            <p className="text-on-surface"><span className="text-primary font-semibold">Skills:</span> {app.skills || 'None'}</p>
                            <p className="text-on-surface-variant"><span className="text-on-surface">Techs:</span> {app.technologies || 'None'}</p>
                          </td>
                          <td className="py-4 text-xs">
                            {app.resume_url ? (
                              <button 
                                onClick={() => handleDownloadResume(app.resume_url)}
                                className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer"
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
                                  className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded cursor-pointer text-xs flex items-center gap-1"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleApplicationAction(app.id, 'rejected')}
                                  className="p-1.5 bg-error-container/20 hover:bg-error-container/40 text-error rounded cursor-pointer text-xs flex items-center gap-1"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : app.status === 'approved' ? (
                              <div className="flex gap-2 justify-end items-center">
                                {interns.some(i => i.email === app.email) ? (
                                  <span className="font-mono-sm text-[10px] uppercase text-[#4ade80] tracking-widest bg-green-500/10 px-2 py-0.5 rounded">Registered</span>
                                ) : (
                                  <button
                                    onClick={() => handleInviteIntern(app)}
                                    className="p-1.5 bg-primary-container/20 hover:bg-primary-container/30 text-primary-container rounded cursor-pointer text-[10px] font-semibold flex items-center gap-1"
                                    title="Send Supabase Invite Email"
                                  >
                                    Invite Intern
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="font-mono-sm text-[10px] uppercase text-error tracking-widest bg-error-container/10 px-2 py-0.5 rounded">{app.status}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredApplications.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-on-surface-variant">No career applications found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Roster of active interns */}
              <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                <h4 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-4">Active Intern Cohort</h4>
                <div className="divide-y divide-[#222222]">
                  {filteredInterns.map(int => (
                    <div key={int.id} className="py-4 flex justify-between items-center text-xs md:text-sm">
                      <div>
                        <p className="font-semibold text-on-surface">{int.full_name || 'Cohort Intern'}</p>
                        <p className="text-on-surface-variant font-mono-sm text-xs mt-0.5">{int.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-sm text-[10px] text-on-surface-variant/80 uppercase">Rating:</span>
                          <select
                            value={int.rating || 5.0}
                            onChange={e => handleUpdateInternRating(int.id, parseFloat(e.target.value))}
                            className="bg-[#0B0B0B] border border-[#222] text-on-surface font-mono-sm text-xs rounded p-1 focus:border-primary outline-none cursor-pointer"
                          >
                            {[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 4.8, 5.0].map(val => (
                              <option key={val} value={val}>{val.toFixed(1)}</option>
                            ))}
                          </select>
                        </div>
                        <span className="font-mono-sm text-[10px] text-primary bg-[#2a1b12] px-2.5 py-1 rounded">ENGINEERING COHORT</span>
                      </div>
                    </div>
                  ))}
                  {filteredInterns.length === 0 && (
                    <div className="py-8 text-center text-on-surface-variant text-xs font-mono-sm">No interns currently in cohort. Approve an application to upgrade role.</div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
