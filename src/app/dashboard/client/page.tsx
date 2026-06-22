'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import TopAppBar from '@/components/shared/TopAppBar'
import { 
  Rocket, Activity, CreditCard, Layers, Calendar, 
  MessageSquare, Terminal, Upload, Download, Trash, 
  Send, Loader, FileText, Plus, LogOut, ChevronRight, Home, X
} from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database.types'
import { User } from '@supabase/supabase-js'

interface ClientFile {
  name: string
  id: string | null
  updated_at?: string | null
  created_at?: string | null
  last_accessed_at?: string | null
  metadata?: {
    size?: number
    mimetype?: string
    cacheControl?: string
  } | null
}

interface MessageWithSender {
  id: string
  content: string
  file_url: string | null
  file_name: string | null
  created_at: string | null
  sender_id: string | null
  profiles: {
    full_name: string | null
    role: string | null
  } | null
}

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'files' | 'messages' | 'payments'>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Database['public']['Tables']['projects']['Row'][]>([])
  const [payments, setPayments] = useState<Database['public']['Tables']['payments']['Row'][]>([])
  const [loading, setLoading] = useState(true)

  // File Management State
  const [files, setFiles] = useState<ClientFile[]>([])
  const [uploadingFile, setUploadingFile] = useState(false)

  // Messaging State
  const [selectedProject, setSelectedProject] = useState<Database['public']['Tables']['projects']['Row'] | null>(null)
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('')

  // Reset search query on tab change to prevent stale filters carryover
  useEffect(() => {
    setSearchQuery('')
  }, [activeTab])

  // Filtered lists based on search query
  const filteredProjects = projects.filter(proj => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (proj.title || '').toLowerCase().includes(term) ||
      (proj.description || '').toLowerCase().includes(term) ||
      (proj.status || '').toLowerCase().includes(term)
    )
  })

  const filteredFiles = files.filter(file => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (file.name || '').toLowerCase().includes(term)
  })

  const filteredMessages = messages.filter(msg => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (msg.content || '').toLowerCase().includes(term) ||
      (msg.profiles?.full_name || '').toLowerCase().includes(term) ||
      (msg.profiles?.role || '').toLowerCase().includes(term)
    )
  })

  const filteredPayments = payments.filter(pay => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (pay.razorpay_payment_id || '').toLowerCase().includes(term) ||
      (pay.package_type || '').toLowerCase().includes(term) ||
      (pay.status || '').toLowerCase().includes(term)
    )
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)

      // Fetch projects
      const { data: pData } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', currentUser.id)
      setProjects(pData || [])
      if (pData && pData.length > 0) {
        setSelectedProject(pData[0])
      }

      // Fetch payments
      const { data: payData } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', currentUser.id)
      setPayments(payData || [])

      setLoading(false)
    }

    loadData()
  }, [supabase, router])

  // Poll for messages when selectedProject changes or on interval
  useEffect(() => {
    if (!selectedProject) return

    const projectId = selectedProject.id
    let intervalId: ReturnType<typeof setInterval>

    async function fetchMessages() {
      const { data } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          file_url,
          file_name,
          created_at,
          sender_id,
          profiles (
            full_name,
            role
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      setMessages((data as unknown as MessageWithSender[]) || [])
      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    fetchMessages()
    intervalId = setInterval(fetchMessages, 4000) // Poll every 4 seconds

    return () => clearInterval(intervalId)
  }, [selectedProject, supabase])

  // Load project files when client visits the Files tab
  useEffect(() => {
    if (activeTab === 'files' && user) {
      loadFiles()
    }
  }, [activeTab, user])

  const loadFiles = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase.storage.from('project-files').list(user.id)
      if (error) throw error
      setFiles(data || [])
    } catch (err) {
      console.error('Error listing files:', err)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && user) {
      setUploadingFile(true)
      const file = e.target.files[0]
      const path = `${user.id}/${file.name}`

      try {
        const { error } = await supabase.storage.from('project-files').upload(path, file, {
          upsert: true
        })
        if (error) throw error
        toast('File uploaded successfully.', 'success')
        loadFiles()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'File upload failed.'
        toast(message, 'error')
      } finally {
        setUploadingFile(false)
      }
    }
  }

  const handleFileDelete = async (name: string) => {
    if (user) {
      try {
        const { error } = await supabase.storage.from('project-files').remove([`${user.id}/${name}`])
        if (error) throw error
        toast('File deleted successfully.', 'success')
        loadFiles()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete file.'
        toast(message, 'error')
      }
    }
  }

  const handleFileDownload = async (name: string) => {
    if (user) {
      try {
        const { data, error } = await supabase.storage.from('project-files').createSignedUrl(`${user.id}/${name}`, 60)
        if (error) throw error
        if (data?.signedUrl) {
          window.open(data.signedUrl, '_blank')
        }
      } catch (err) {
        toast('Failed to download file.', 'error')
      }
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedProject || !user) return

    setSendingMessage(true)
    try {
      // 1. Check if conversation exists for the project, if not, create one
      let { data: conv } = await supabase
        .from('conversations')
        .select('id')
        .eq('project_id', selectedProject.id)
        .maybeSingle()

      if (!conv) {
        const { data: newConv, error: convErr } = await supabase
          .from('conversations')
          .insert({ project_id: selectedProject.id })
          .select()
          .single()
        
        if (convErr) throw convErr
        conv = newConv
      }

      // 2. Insert message linked to conversation and project
      const { error } = await supabase
        .from('messages')
        .insert({
          project_id: selectedProject.id,
          conversation_id: conv.id,
          sender_id: user.id,
          content: newMessage.trim()
        })

      if (error) throw error
      setNewMessage('')
    } catch (err) {
      toast('Failed to send message.', 'error')
    } finally {
      setSendingMessage(false)
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

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="bg-[#0B0B0B] text-on-surface antialiased min-h-screen flex font-body-md overflow-hidden relative">
      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`bg-surface-container-low w-64 h-screen border-r border-[#222] flex flex-col justify-between shrink-0 transition-transform duration-300 z-50
        fixed inset-y-0 left-0 md:static md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="p-6 border-b border-[#222]">
            <div className="flex items-center justify-between">
              <Link href="/" className="block hover:opacity-85 transition-opacity">
                <img src="/weblogo.svg" alt="Kaiketsu Logo" className="h-10 w-auto" />
              </Link>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-on-surface-variant hover:text-primary transition-all p-2 rounded-full cursor-pointer flex items-center justify-center"
                aria-label="Close Sidebar"
              >
                <X size={18} />
              </button>
            </div>
            <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest mt-2 font-bold">Client Workspace</p>
          </div>
          <div className="p-4">
            <Link 
              href="/request-project" 
              onClick={() => setSidebarOpen(false)}
              className="w-full bg-primary-container text-white py-3 rounded-lg hover:bg-[#d8600d] transition-colors flex items-center justify-center gap-2 cursor-pointer font-bold text-xs shadow-md"
            >
              <Plus size={16} />
              Request Project
            </Link>
          </div>
          <nav className="px-4 py-2 space-y-1">
            {(
              [
                { id: 'overview', label: 'Overview', icon: <Activity size={18} /> },
                { id: 'projects', label: 'Projects', icon: <Layers size={18} /> },
                { id: 'files', label: 'Files Space', icon: <Upload size={18} /> },
                { id: 'messages', label: 'Comms / Chat', icon: <MessageSquare size={18} /> },
                { id: 'payments', label: 'Invoices & Ledger', icon: <CreditCard size={18} /> }
              ] as const
            ).map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSidebarOpen(false)
                }}
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
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-on-surface truncate">{user?.email}</span>
              <span className="text-[10px] text-on-surface-variant font-mono-sm">Client Partner</span>
            </div>
          </div>
          <Link 
            href="/"
            className="w-full bg-[#111111] hover:bg-[#1a1a1a] border border-[#222] text-on-surface py-2 rounded flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <Home size={14} />
            Go to Home
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full bg-[#111111] hover:bg-[#1a1a1a] border border-[#222] text-on-surface py-2 rounded flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopAppBar 
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
          placeholder="Search workspace..." 
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Dashboard Canvas Scrollable */}
        <div className="flex-1 overflow-y-auto p-gutter pt-8 max-w-max-width w-full mx-auto space-y-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Summary Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div className="bg-[#111] border border-[#222] rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Layers className="text-primary" size={80} />
                  </div>
                  <div>
                    <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Allocated Projects</p>
                    <h3 className="text-4xl font-bold text-on-surface mt-2">{projects.length}</h3>
                  </div>
                  <div className="mt-8 text-xs text-on-surface-variant font-mono-sm">
                    {projects.length > 0 ? 'Active Engineering Squads' : 'No Projects Initialized'}
                  </div>
                </div>

                <div className="bg-[#111] border border-[#222] rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <CreditCard className="text-primary" size={80} />
                  </div>
                  <div>
                    <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Outstanding Balance</p>
                    <h3 className="text-4xl font-bold text-on-surface mt-2">${totalPending.toLocaleString()}</h3>
                  </div>
                  <div className="mt-8 text-xs text-on-surface-variant font-mono-sm">
                    {payments.filter(p => p.status === 'pending').length} Invoices Awaiting Payment
                  </div>
                </div>

                <div className="bg-surface-container-high border border-outline-variant rounded-lg p-6 flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-3 text-primary">
                    <Rocket size={24} />
                  </div>
                  <h4 className="font-headline-lg text-base font-semibold text-on-surface mb-1">Launch Project</h4>
                  <p className="font-body-md text-xs text-on-surface-variant mb-4 max-w-[200px]">Submit engineering specs to begin.</p>
                  <Link href="/request-project" className="bg-primary-container text-white px-5 py-2 rounded-full font-label-md text-xs hover:bg-[#d8600d] transition-all cursor-pointer font-bold">
                    Create Request
                  </Link>
                </div>
              </div>

              {/* Quick Projects View */}
              <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                <h4 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-4">Active Engagements</h4>
                <div className="divide-y divide-[#222222]">
                  {filteredProjects.map(proj => (
                    <div key={proj.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h5 className="font-body-md font-semibold text-on-surface text-sm">{proj.title}</h5>
                        <p className="font-mono-sm text-xs text-on-surface-variant mt-1 capitalize">Status: {(proj.status || '').replace('_', ' ')}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="font-mono-sm text-xs text-on-surface-variant block">BUDGET</span>
                          <span className="font-semibold text-on-surface text-sm">${Number(proj.estimated_budget).toLocaleString()}</span>
                        </div>
                        <ChevronRight className="text-on-surface-variant/40 hidden md:block" size={18} />
                      </div>
                    </div>
                  ))}
                  {filteredProjects.length === 0 && (
                    <div className="py-8 text-center text-on-surface-variant text-sm">
                      No projects currently active. Initiate a project advance via the <Link href="/pricing" className="text-primary hover:underline">Pricing Page</Link> to get started.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="bg-[#111] border border-[#222] rounded-lg p-6">
              <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-6">All Projects</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-body-md text-on-surface-variant">
                  <thead>
                    <tr className="border-b border-[#222] font-mono-sm text-[10px] uppercase text-on-surface-variant/70 tracking-widest pb-3">
                      <th className="pb-3">Project Title</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Estimated Budget</th>
                      <th className="pb-3">Timeline Start</th>
                      <th className="pb-3">Timeline End</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {filteredProjects.map(proj => (
                      <tr key={proj.id} className="hover:bg-[#1a1a1a]/50 transition-colors">
                        <td className="py-4 font-semibold text-on-surface">{proj.title}</td>
                        <td className="py-4 capitalize">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono-sm ${
                            proj.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-primary-container/10 text-primary'
                          }`}>
                            {(proj.status || '').replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 font-mono-sm">${Number(proj.estimated_budget).toLocaleString()}</td>
                        <td className="py-4 font-mono-sm">{proj.timeline_start || 'Pending'}</td>
                        <td className="py-4 font-mono-sm">{proj.timeline_end || 'Pending'}</td>
                      </tr>
                    ))}
                    {filteredProjects.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-on-surface-variant">No projects found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FILES TAB */}
          {activeTab === 'files' && (
            <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
                <div>
                  <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest">Client Document space</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Upload technical requirements, design files, or contracts.</p>
                </div>
                <div className="relative">
                  <button className="bg-primary-container text-white py-3 px-6 rounded hover:bg-[#d8600d] transition-colors flex items-center gap-2 cursor-pointer font-bold text-xs shadow-md">
                    <Upload size={16} />
                    Upload File
                    <input 
                      type="file" 
                      onChange={handleFileUpload} 
                      disabled={uploadingFile}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </button>
                </div>
              </div>

              {uploadingFile && (
                <div className="flex items-center gap-2 text-xs text-primary font-mono-sm">
                  <Loader className="animate-spin" size={16} />
                  Uploading secure payload...
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFiles.map((file, i) => (
                  <div key={i} className="bg-[#1a1a1a] border border-[#222] p-4 rounded-lg flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 truncate">
                      <FileText className="text-primary shrink-0" size={24} />
                      <div className="truncate">
                        <p className="text-sm font-semibold text-on-surface truncate">{file.name}</p>
                        <p className="text-[10px] font-mono-sm text-on-surface-variant">{((file.metadata?.size || 0) / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleFileDownload(file.name)}
                        className="p-2 bg-[#222] border border-[#333] hover:border-primary/50 rounded hover:text-primary transition-all cursor-pointer"
                        title="Download"
                      >
                        <Download size={14} />
                      </button>
                      <button 
                        onClick={() => handleFileDelete(file.name)}
                        className="p-2 bg-[#222] border border-[#333] hover:border-error/50 rounded hover:text-error transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredFiles.length === 0 && (
                  <div className="col-span-2 py-8 text-center text-on-surface-variant text-sm border border-dashed border-[#222] rounded-lg">
                    No files uploaded yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="bg-[#111] border border-[#222] rounded-lg h-[550px] flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-[#222] bg-[#1a1a1a] flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest">Engineering Comms Channel</h3>
                  {selectedProject ? (
                    <p className="text-[11px] font-mono-sm text-primary mt-0.5">Project: {selectedProject.title}</p>
                  ) : (
                    <p className="text-[11px] font-mono-sm text-on-surface-variant mt-0.5">Select a project to chat</p>
                  )}
                </div>
                {projects.length > 1 && (
                  <select 
                    value={selectedProject?.id || ''} 
                    onChange={e => setSelectedProject(projects.find(p => p.id === e.target.value) || null)}
                    className="bg-[#0B0B0B] border border-[#333] text-on-surface font-mono-sm text-xs rounded p-2 focus:border-primary outline-none cursor-pointer"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0c0c0c]">
                {filteredMessages.map((msg, i) => {
                  const isOwn = msg.sender_id === user?.id
                  return (
                    <div key={i} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                      <span className="font-mono-sm text-[9px] text-on-surface-variant/80 uppercase mb-1">
                        {msg.profiles?.full_name || 'System'} ({msg.profiles?.role || 'user'})
                      </span>
                      <div className={`max-w-[70%] rounded-lg p-3 text-xs leading-relaxed ${
                        isOwn 
                          ? 'bg-primary-container text-white shadow-[0_2px_8px_rgba(249,115,22,0.15)] rounded-br-none' 
                          : 'bg-[#1a1a1a] border border-[#222] text-on-surface rounded-bl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  )
                })}
                {filteredMessages.length === 0 && (
                  <div className="h-full flex items-center justify-center text-on-surface-variant text-xs font-mono-sm">
                    No communications recorded yet. Type below to message administrators.
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#222] bg-[#1a1a1a] flex gap-2 shrink-0">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  disabled={!selectedProject || sendingMessage}
                  placeholder={selectedProject ? "Type technical response..." : "Select project first..."}
                  className="flex-1 bg-[#0B0B0B] border border-[#333] focus:border-primary rounded px-4 py-3 text-xs outline-none text-on-surface"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendingMessage}
                  className="bg-primary-container text-white px-4 py-3 rounded hover:bg-[#d8600d] transition-colors flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {sendingMessage ? <Loader className="animate-spin" size={14} /> : <Send size={14} />}
                </button>
              </form>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Payment Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                  <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Total Disbursed (USD)</p>
                  <h3 className="text-4xl font-bold text-[#4ade80] mt-2">${totalPaid.toLocaleString()}</h3>
                </div>
                <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                  <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Total Invoiced (USD)</p>
                  <h3 className="text-4xl font-bold text-on-surface mt-2">${(totalPaid + totalPending).toLocaleString()}</h3>
                </div>
              </div>

              {/* Transactions list */}
              <div className="bg-[#111] border border-[#222] rounded-lg p-6">
                <h4 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-4">Transaction Ledger</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm font-body-md text-on-surface-variant">
                    <thead>
                      <tr className="border-b border-[#222] font-mono-sm text-[10px] uppercase text-on-surface-variant/70 tracking-widest pb-3">
                        <th className="pb-3">Payment ID</th>
                        <th className="pb-3">Package Tier</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {filteredPayments.map(pay => (
                        <tr key={pay.id} className="hover:bg-[#1a1a1a]/50 transition-colors">
                          <td className="py-4 font-mono-sm text-xs truncate max-w-[120px]" title={pay.razorpay_payment_id || pay.id}>
                            {pay.razorpay_payment_id || 'Pending Receipt'}
                          </td>
                          <td className="py-4 capitalize font-semibold text-on-surface">{pay.package_type || 'Custom Retainer'}</td>
                          <td className="py-4 font-mono-sm text-on-surface">${Number(pay.amount).toLocaleString()}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono-sm uppercase ${
                              pay.status === 'completed' 
                                ? 'bg-green-500/10 text-[#4ade80]' 
                                : pay.status === 'failed' 
                                  ? 'bg-error-container/20 text-error' 
                                  : 'bg-primary-container/10 text-primary'
                            }`}>
                              {pay.status}
                            </span>
                          </td>
                          <td className="py-4 font-mono-sm text-xs">
                            {pay.created_at ? new Date(pay.created_at).toLocaleDateString() : 'Pending'}
                          </td>
                        </tr>
                      ))}
                      {filteredPayments.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-on-surface-variant">No transaction entries found.</td>
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
    </div>
  )
}
