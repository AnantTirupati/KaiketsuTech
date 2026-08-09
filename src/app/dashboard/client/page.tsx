'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import TopAppBar from '@/components/shared/TopAppBar'
import {
  Rocket, Activity, CreditCard, Layers, MessageSquare, Upload, Download, Trash,
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

  const [files, setFiles] = useState<ClientFile[]>([])
  const [uploadingFile, setUploadingFile] = useState(false)

  const [selectedProject, setSelectedProject] = useState<Database['public']['Tables']['projects']['Row'] | null>(null)
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()

  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setSearchQuery('')
  }, [activeTab])

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

      const { data: pData } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', currentUser.id)
      setProjects(pData || [])
      if (pData && pData.length > 0) {
        setSelectedProject(pData[0])
      }

      const { data: payData } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', currentUser.id)
      setPayments(payData || [])

      setLoading(false)
    }

    loadData()
  }, [supabase, router])

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
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    fetchMessages()
    intervalId = setInterval(fetchMessages, 4000)

    return () => clearInterval(intervalId)
  }, [selectedProject, supabase])

  useEffect(() => {
    if (activeTab === 'files' && user) {
      loadFiles()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      } catch {
        toast('Failed to download file.', 'error')
      }
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedProject || !user) return

    setSendingMessage(true)
    try {
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
    } catch {
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
      <div className="flex h-screen items-center justify-center bg-marketing-bg">
        <Loader className="animate-spin text-marketing-accent" size={36} />
      </div>
    )
  }

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="relative flex h-screen min-h-screen overflow-hidden bg-marketing-bg font-marketing-sans text-marketing-fg antialiased">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`z-50 flex h-screen w-64 shrink-0 flex-col justify-between border-r border-marketing-border bg-marketing-bg-raised transition-transform duration-300
        fixed inset-y-0 left-0 md:static md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="border-b border-marketing-border p-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="block font-marketing-mono text-sm font-bold tracking-tight text-marketing-fg transition-colors hover:text-marketing-accent">
                KAIKETSU<span className="text-marketing-accent">_</span>TECH
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex cursor-pointer items-center justify-center p-2 text-marketing-muted-dim transition-colors hover:text-marketing-accent md:hidden"
                aria-label="Close Sidebar"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-muted-dim">Client Workspace</p>
          </div>
          <div className="p-4">
            <Link
              href="/request-project"
              onClick={() => setSidebarOpen(false)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 bg-marketing-accent py-3 text-xs font-bold text-marketing-accent-ink transition-colors hover:bg-marketing-fg"
            >
              <Plus size={16} />
              Request Project
            </Link>
          </div>
          <nav className="space-y-1 px-4 py-2">
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
                className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-marketing-accent text-marketing-accent-ink'
                    : 'text-marketing-muted-dim hover:bg-marketing-bg hover:text-marketing-fg'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3 border-t border-marketing-border p-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center bg-marketing-accent/10 font-marketing-mono text-xs font-bold text-marketing-accent">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate text-xs font-semibold text-marketing-fg">{user?.email}</span>
              <span className="font-marketing-mono text-[10px] text-marketing-muted-dim">Client Partner</span>
            </div>
          </div>
          <Link
            href="/"
            className="flex w-full cursor-pointer items-center justify-center gap-2 border border-marketing-border py-2 text-xs font-semibold text-marketing-fg transition-colors hover:border-marketing-accent"
          >
            <Home size={14} />
            Go to Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center justify-center gap-2 border border-marketing-border py-2 text-xs font-semibold text-marketing-fg transition-colors hover:border-marketing-accent"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex h-screen flex-1 flex-col overflow-hidden">
        <TopAppBar
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          placeholder="Search workspace..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="mx-auto w-full max-w-6xl flex-1 space-y-6 overflow-y-auto p-6 pt-8">

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="relative flex flex-col justify-between overflow-hidden border border-marketing-border bg-marketing-bg-raised p-6">
                  <div>
                    <p className="font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-muted-dim">Allocated Projects</p>
                    <h3 className="mt-2 text-4xl font-bold text-marketing-fg">{projects.length}</h3>
                  </div>
                  <div className="mt-8 font-marketing-mono text-xs text-marketing-muted-dim">
                    {projects.length > 0 ? 'Active Engineering Squads' : 'No Projects Initialized'}
                  </div>
                </div>

                <div className="relative flex flex-col justify-between overflow-hidden border border-marketing-border bg-marketing-bg-raised p-6">
                  <div>
                    <p className="font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-muted-dim">Outstanding Balance</p>
                    <h3 className="mt-2 text-4xl font-bold text-marketing-fg">${totalPending.toLocaleString()}</h3>
                  </div>
                  <div className="mt-8 font-marketing-mono text-xs text-marketing-muted-dim">
                    {payments.filter(p => p.status === 'pending').length} Invoices Awaiting Payment
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border border-marketing-border bg-marketing-bg-raised p-6 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center border border-marketing-border text-marketing-accent">
                    <Rocket size={24} />
                  </div>
                  <h4 className="mb-1 font-marketing-sans text-base font-semibold text-marketing-fg">Launch Project</h4>
                  <p className="mb-4 max-w-[200px] text-xs text-marketing-muted">Submit engineering specs to begin.</p>
                  <Link href="/request-project" className="cursor-pointer bg-marketing-accent px-5 py-2 text-xs font-bold text-marketing-accent-ink transition-colors hover:bg-marketing-fg">
                    Create Request
                  </Link>
                </div>
              </div>

              <div className="border border-marketing-border bg-marketing-bg-raised p-6">
                <h4 className="mb-4 font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">Active Engagements</h4>
                <div className="divide-y divide-marketing-border">
                  {filteredProjects.map(proj => (
                    <div key={proj.id} className="flex flex-col justify-between gap-4 py-4 md:flex-row md:items-center">
                      <div>
                        <h5 className="text-sm font-semibold text-marketing-fg">{proj.title}</h5>
                        <p className="mt-1 font-marketing-mono text-xs capitalize text-marketing-muted-dim">Status: {(proj.status || '').replace('_', ' ')}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="block font-marketing-mono text-xs text-marketing-muted-dim">BUDGET</span>
                          <span className="text-sm font-semibold text-marketing-fg">${Number(proj.estimated_budget).toLocaleString()}</span>
                        </div>
                        <ChevronRight className="hidden text-marketing-muted-dim md:block" size={18} />
                      </div>
                    </div>
                  ))}
                  {filteredProjects.length === 0 && (
                    <div className="py-8 text-center text-sm text-marketing-muted">
                      No projects currently active. Initiate a project advance via the <Link href="/pricing" className="text-marketing-accent hover:underline">Pricing Page</Link> to get started.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="border border-marketing-border bg-marketing-bg-raised p-6">
              <h3 className="mb-6 font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">All Projects</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-marketing-muted">
                  <thead>
                    <tr className="border-b border-marketing-border font-marketing-mono text-[10px] uppercase tracking-widest text-marketing-muted-dim">
                      <th className="pb-3">Project Title</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Estimated Budget</th>
                      <th className="pb-3">Timeline Start</th>
                      <th className="pb-3">Timeline End</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-marketing-border">
                    {filteredProjects.map(proj => (
                      <tr key={proj.id} className="transition-colors hover:bg-marketing-bg">
                        <td className="py-4 font-semibold text-marketing-fg">{proj.title}</td>
                        <td className="py-4 capitalize">
                          <span className={`px-2 py-0.5 font-marketing-mono text-[10px] ${
                            proj.status === 'completed' ? 'bg-marketing-accent/10 text-marketing-accent' : 'bg-marketing-bg text-marketing-fg'
                          }`}>
                            {(proj.status || '').replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 font-marketing-mono">${Number(proj.estimated_budget).toLocaleString()}</td>
                        <td className="py-4 font-marketing-mono">{proj.timeline_start || 'Pending'}</td>
                        <td className="py-4 font-marketing-mono">{proj.timeline_end || 'Pending'}</td>
                      </tr>
                    ))}
                    {filteredProjects.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-marketing-muted">No projects found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6 border border-marketing-border bg-marketing-bg-raised p-6">
              <div className="flex flex-col justify-between gap-4 border-b border-marketing-border pb-6 md:flex-row md:items-center">
                <div>
                  <h3 className="font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">Client Document space</h3>
                  <p className="mt-1 text-xs text-marketing-muted">Upload technical requirements, design files, or contracts.</p>
                </div>
                <div className="relative">
                  <button className="flex cursor-pointer items-center gap-2 bg-marketing-accent px-6 py-3 text-xs font-bold text-marketing-accent-ink transition-colors hover:bg-marketing-fg">
                    <Upload size={16} />
                    Upload File
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </button>
                </div>
              </div>

              {uploadingFile && (
                <div className="flex items-center gap-2 font-marketing-mono text-xs text-marketing-accent">
                  <Loader className="animate-spin" size={16} />
                  Uploading secure payload...
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 border border-marketing-border bg-marketing-bg p-4">
                    <div className="flex items-center gap-3 truncate">
                      <FileText className="shrink-0 text-marketing-accent" size={24} />
                      <div className="truncate">
                        <p className="truncate text-sm font-semibold text-marketing-fg">{file.name}</p>
                        <p className="font-marketing-mono text-[10px] text-marketing-muted-dim">{((file.metadata?.size || 0) / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => handleFileDownload(file.name)}
                        className="cursor-pointer border border-marketing-border p-2 transition-colors hover:border-marketing-accent hover:text-marketing-accent"
                        title="Download"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => handleFileDelete(file.name)}
                        className="cursor-pointer border border-marketing-border p-2 transition-colors hover:border-red-500/50 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredFiles.length === 0 && (
                  <div className="col-span-2 border border-dashed border-marketing-border py-8 text-center text-sm text-marketing-muted">
                    No files uploaded yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="flex h-[550px] flex-col overflow-hidden border border-marketing-border bg-marketing-bg-raised">
              <div className="flex shrink-0 items-center justify-between border-b border-marketing-border bg-marketing-bg p-4">
                <div>
                  <h3 className="font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">Engineering Comms Channel</h3>
                  {selectedProject ? (
                    <p className="mt-0.5 font-marketing-mono text-[11px] text-marketing-accent">Project: {selectedProject.title}</p>
                  ) : (
                    <p className="mt-0.5 font-marketing-mono text-[11px] text-marketing-muted-dim">Select a project to chat</p>
                  )}
                </div>
                {projects.length > 1 && (
                  <select
                    value={selectedProject?.id || ''}
                    onChange={e => setSelectedProject(projects.find(p => p.id === e.target.value) || null)}
                    className="cursor-pointer border border-marketing-border bg-marketing-bg p-2 font-marketing-mono text-xs text-marketing-fg outline-none focus:border-marketing-accent"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-marketing-bg p-4">
                {filteredMessages.map((msg, i) => {
                  const isOwn = msg.sender_id === user?.id
                  return (
                    <div key={i} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                      <span className="mb-1 font-marketing-mono text-[9px] uppercase text-marketing-muted-dim">
                        {msg.profiles?.full_name || 'System'} ({msg.profiles?.role || 'user'})
                      </span>
                      <div className={`max-w-[70%] p-3 text-xs leading-relaxed ${
                        isOwn
                          ? 'bg-marketing-accent text-marketing-accent-ink'
                          : 'border border-marketing-border bg-marketing-bg-raised text-marketing-fg'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  )
                })}
                {filteredMessages.length === 0 && (
                  <div className="flex h-full items-center justify-center font-marketing-mono text-xs text-marketing-muted-dim">
                    No communications recorded yet. Type below to message administrators.
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="flex shrink-0 gap-2 border-t border-marketing-border bg-marketing-bg p-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  disabled={!selectedProject || sendingMessage}
                  placeholder={selectedProject ? "Type technical response..." : "Select project first..."}
                  className="flex-1 border border-marketing-border bg-marketing-bg-raised px-4 py-3 text-xs text-marketing-fg outline-none focus:border-marketing-accent"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendingMessage}
                  className="flex shrink-0 cursor-pointer items-center justify-center bg-marketing-accent px-4 py-3 text-marketing-accent-ink transition-colors hover:bg-marketing-fg disabled:opacity-50"
                >
                  {sendingMessage ? <Loader className="animate-spin" size={14} /> : <Send size={14} />}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="border border-marketing-border bg-marketing-bg-raised p-6">
                  <p className="font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-muted-dim">Total Disbursed (USD)</p>
                  <h3 className="mt-2 text-4xl font-bold text-marketing-accent">${totalPaid.toLocaleString()}</h3>
                </div>
                <div className="border border-marketing-border bg-marketing-bg-raised p-6">
                  <p className="font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-muted-dim">Total Invoiced (USD)</p>
                  <h3 className="mt-2 text-4xl font-bold text-marketing-fg">${(totalPaid + totalPending).toLocaleString()}</h3>
                </div>
              </div>

              <div className="border border-marketing-border bg-marketing-bg-raised p-6">
                <h4 className="mb-4 font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">Transaction Ledger</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-marketing-muted">
                    <thead>
                      <tr className="border-b border-marketing-border font-marketing-mono text-[10px] uppercase tracking-widest text-marketing-muted-dim">
                        <th className="pb-3">Payment ID</th>
                        <th className="pb-3">Package Tier</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-marketing-border">
                      {filteredPayments.map(pay => (
                        <tr key={pay.id} className="transition-colors hover:bg-marketing-bg">
                          <td className="max-w-[120px] truncate py-4 font-marketing-mono text-xs" title={pay.razorpay_payment_id || pay.id}>
                            {pay.razorpay_payment_id || 'Pending Receipt'}
                          </td>
                          <td className="py-4 font-semibold capitalize text-marketing-fg">{pay.package_type || 'Custom Retainer'}</td>
                          <td className="py-4 font-marketing-mono text-marketing-fg">${Number(pay.amount).toLocaleString()}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 font-marketing-mono text-[9px] uppercase ${
                              pay.status === 'completed'
                                ? 'bg-marketing-accent/10 text-marketing-accent'
                                : pay.status === 'failed'
                                  ? 'bg-red-500/10 text-red-400'
                                  : 'bg-marketing-bg text-marketing-fg'
                            }`}>
                              {pay.status}
                            </span>
                          </td>
                          <td className="py-4 font-marketing-mono text-xs">
                            {pay.created_at ? new Date(pay.created_at).toLocaleDateString() : 'Pending'}
                          </td>
                        </tr>
                      ))}
                      {filteredPayments.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-marketing-muted">No transaction entries found.</td>
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
