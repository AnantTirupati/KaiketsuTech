'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import TopAppBar from '@/components/shared/TopAppBar'
import {
  CheckSquare, Play, CheckCircle2,
  Award, Calendar, FolderOpen, Upload, Download, Trash,
  Send, Loader, MessageSquare, Layers, FileText, BarChart2, LogOut, Home, X, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database.types'
import { User } from '@supabase/supabase-js'

interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  category: 'Frontend' | 'Backend' | 'Design Sys' | 'Management' | 'Operations' | 'Other'
  due_date?: string
}

interface DeliverableFile {
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

export default function InternDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'deliverables' | 'performance' | 'messages'>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null)
  const [internId, setInternId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Database['public']['Tables']['projects']['Row'][]>([])
  const [upcomingMilestones, setUpcomingMilestones] = useState<Database['public']['Tables']['milestones']['Row'][]>([])
  const [loading, setLoading] = useState(true)

  const [deliverables, setDeliverables] = useState<DeliverableFile[]>([])
  const [uploading, setUploading] = useState(false)

  const [selectedProject, setSelectedProject] = useState<Database['public']['Tables']['projects']['Row'] | null>(null)
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setSearchQuery('')
  }, [activeTab])

  const filteredTasks = tasks.filter(t => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (t.title || '').toLowerCase().includes(term) ||
      (t.category || '').toLowerCase().includes(term)
    )
  })

  const filteredProjects = projects.filter(proj => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      (proj.title || '').toLowerCase().includes(term) ||
      (proj.description || '').toLowerCase().includes(term) ||
      (proj.status || '').toLowerCase().includes(term)
    )
  })

  const filteredDeliverables = deliverables.filter(file => {
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

  useEffect(() => {
    async function loadData() {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)

      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()
      setProfile(profData || null)

      const { data: internRecord } = await supabase
        .from('interns')
        .select('intern_id')
        .eq('profile_id', currentUser.id)
        .is('deleted_at', null)
        .maybeSingle()
      if (internRecord) {
        setInternId(internRecord.intern_id)
      }

      const { data: pData } = await supabase
        .from('projects')
        .select('*')
      setProjects(pData || [])
      if (pData && pData.length > 0) {
        setSelectedProject(pData[0])
      }

      const { data: tData } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', currentUser.id)

      setTasks((tData as Task[]) || [])

      if (pData && pData.length > 0) {
        const projectIds = pData.map(p => p.id)
        const { data: mData } = await supabase
          .from('milestones')
          .select('*')
          .in('project_id', projectIds)
          .eq('status', 'pending')
          .order('due_date', { ascending: true })
          .limit(3)
        setUpcomingMilestones(mData || [])
      }

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
    if (activeTab === 'deliverables' && user) {
      loadDeliverables()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user])

  const loadDeliverables = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase.storage.from('deliverables').list(user.id)
      if (error) throw error
      setDeliverables(data || [])
    } catch (err) {
      console.error('Error listing deliverables:', err)
    }
  }

  const handleDeliverableUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && user) {
      setUploading(true)
      const file = e.target.files[0]
      const path = `${user.id}/${file.name}`

      try {
        const { error } = await supabase.storage.from('deliverables').upload(path, file, {
          upsert: true
        })
        if (error) throw error
        toast('Deliverable document uploaded successfully.', 'success')
        loadDeliverables()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'File upload failed.'
        toast(message, 'error')
      } finally {
        setUploading(false)
      }
    }
  }

  const handleDeliverableDelete = async (name: string) => {
    if (user) {
      try {
        const { error } = await supabase.storage.from('deliverables').remove([`${user.id}/${name}`])
        if (error) throw error
        toast('Deliverable deleted successfully.', 'success')
        loadDeliverables()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete file.'
        toast(message, 'error')
      }
    }
  }

  const handleDeliverableDownload = async (name: string) => {
    if (user) {
      try {
        const { data, error } = await supabase.storage.from('deliverables').createSignedUrl(`${user.id}/${name}`, 60)
        if (error) throw error
        if (data?.signedUrl) {
          window.open(data.signedUrl, '_blank')
        }
      } catch {
        toast('Failed to download deliverable.', 'error')
      }
    }
  }

  const moveTask = async (taskId: string, nextStatus: 'todo' | 'in_progress' | 'done') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t))
    toast(`Moving task status to ${nextStatus}`, 'info')

    try {
      if (taskId.length > 5) {
        const { error } = await supabase
          .from('tasks')
          .update({ status: nextStatus })
          .eq('id', taskId)

        if (error) throw error
      }
      toast('Task status updated successfully.', 'success')
    } catch (err) {
      console.error('Failed to update task:', err)
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

  const tasksDone = tasks.filter(t => t.status === 'done').length

  const totalTasks = tasks.length
  const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length
  const deadlineRatio = totalTasks > 0 ? Math.round(((totalTasks - overdueTasks) / totalTasks) * 100) : 100

  const filteredTasksTodo = filteredTasks.filter(t => t.status === 'todo').length
  const filteredTasksInProgress = filteredTasks.filter(t => t.status === 'in_progress').length
  const filteredTasksDone = filteredTasks.filter(t => t.status === 'done').length

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
            <p className="mt-2 font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-muted-dim">Intern Workspace</p>
          </div>
          <nav className="space-y-1 px-4 py-6">
            {(
              [
                { id: 'overview', label: 'Kanban Sprint Board', icon: <CheckSquare size={18} /> },
                { id: 'projects', label: 'Allocated Projects', icon: <Layers size={18} /> },
                { id: 'deliverables', label: 'Upload Deliverables', icon: <Upload size={18} /> },
                { id: 'performance', label: 'Metrics & Rating', icon: <BarChart2 size={18} /> },
                { id: 'messages', label: 'Channel Comms', icon: <MessageSquare size={18} /> }
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
              <span className="font-marketing-mono text-[10px] text-marketing-muted-dim">
                {internId || 'Technical Intern'}
              </span>
            </div>
          </div>
          {internId && (
            <a
              href={`/intern/${internId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full cursor-pointer items-center justify-center gap-2 border border-marketing-border py-2 text-xs font-semibold text-marketing-fg transition-colors hover:border-marketing-accent"
            >
              <ExternalLink size={14} className="text-marketing-accent" />
              View Public Profile
            </a>
          )}
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
          title={activeTab === 'overview' ? 'Kanban Sprint Board' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          placeholder="Search tasks..."
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
                    <h4 className="font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-muted-dim">Sprint Performance</h4>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-marketing-fg">
                        {totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0}%
                      </span>
                      <span className="font-marketing-mono text-xs text-marketing-accent">{tasksDone}/{totalTasks} Tasks</span>
                    </div>
                  </div>
                </div>

                <div className="relative flex flex-col justify-between overflow-hidden border border-marketing-border bg-marketing-bg-raised p-6">
                  <div>
                    <h4 className="font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-muted-dim">Upcoming Milestones</h4>
                    {upcomingMilestones.length > 0 ? (
                      <div className="mt-4 flex items-center gap-2 truncate text-xs">
                        <span className="truncate font-semibold text-marketing-fg" title={upcomingMilestones[0].title || ''}>
                          {upcomingMilestones[0].title}
                        </span>
                        <span className="shrink-0 font-marketing-mono text-marketing-accent">
                          • {upcomingMilestones[0].due_date ? new Date(upcomingMilestones[0].due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Date'}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-4 font-marketing-mono text-xs text-marketing-muted-dim">
                        No pending milestones
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative flex flex-col justify-between overflow-hidden border border-marketing-border bg-marketing-bg-raised p-6">
                  <div>
                    <h4 className="font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-muted-dim">Active Allocations</h4>
                    <div className="mt-4 text-xs">
                      <span className="font-semibold text-marketing-fg">{projects.length} Active Projects</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pb-12 sm:grid-cols-3">
                <div className="border border-marketing-border bg-marketing-bg-raised p-3">
                  <h5 className="mb-3 flex justify-between font-marketing-mono text-xs font-bold uppercase tracking-wider text-marketing-muted-dim">
                    To Do <span className="bg-marketing-bg px-2">{filteredTasksTodo}</span>
                  </h5>
                  <div className="space-y-2">
                    {filteredTasks.filter(t => t.status === 'todo').map((task) => (
                      <div key={task.id} className="border border-marketing-border bg-marketing-bg p-3 transition-colors hover:border-marketing-border-strong">
                        <div className="mb-2 flex items-start justify-between">
                          <span className="bg-marketing-accent/10 px-2 py-0.5 font-marketing-mono text-[9px] text-marketing-accent">{task.category}</span>
                          <button
                            onClick={() => moveTask(task.id, 'in_progress')}
                            className="flex cursor-pointer items-center gap-0.5 text-xs text-marketing-accent transition-colors hover:underline"
                          >
                            Start <Play size={10} />
                          </button>
                        </div>
                        <p className="text-sm text-marketing-fg">{task.title}</p>
                      </div>
                    ))}
                    {filteredTasksTodo === 0 && (
                      <div className="border border-dashed border-marketing-border py-8 text-center font-marketing-mono text-xs text-marketing-muted-dim">
                        No tasks in queue
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative border border-marketing-border bg-marketing-bg-raised p-3">
                  <div className="absolute left-0 top-0 h-[2px] w-full bg-marketing-accent"></div>
                  <h5 className="mb-3 flex justify-between font-marketing-mono text-xs font-bold uppercase tracking-wider text-marketing-muted-dim">
                    In Progress <span className="bg-marketing-bg px-2 text-marketing-accent">{filteredTasksInProgress}</span>
                  </h5>
                  <div className="space-y-2">
                    {filteredTasks.filter(t => t.status === 'in_progress').map((task) => (
                      <div key={task.id} className="border border-marketing-accent/30 bg-marketing-bg p-3 transition-colors hover:border-marketing-accent">
                        <div className="mb-2 flex items-start justify-between">
                          <span className="bg-marketing-accent/10 px-2 py-0.5 font-marketing-mono text-[9px] text-marketing-accent">{task.category}</span>
                          <button
                            onClick={() => moveTask(task.id, 'done')}
                            className="flex cursor-pointer items-center gap-0.5 text-xs text-marketing-accent transition-colors hover:underline"
                          >
                            Complete <CheckSquare size={10} />
                          </button>
                        </div>
                        <p className="text-sm text-marketing-fg">{task.title}</p>
                      </div>
                    ))}
                    {filteredTasksInProgress === 0 && (
                      <div className="border border-dashed border-marketing-border py-8 text-center font-marketing-mono text-xs text-marketing-muted-dim">
                        No tasks active
                      </div>
                    )}
                  </div>
                </div>

                <div className="border border-marketing-border bg-marketing-bg-raised p-3 opacity-70">
                  <h5 className="mb-3 flex justify-between font-marketing-mono text-xs font-bold uppercase tracking-wider text-marketing-muted-dim">
                    Done <span className="bg-marketing-bg px-2">{filteredTasksDone}</span>
                  </h5>
                  <div className="space-y-2">
                    {filteredTasks.filter(t => t.status === 'done').map((task) => (
                      <div key={task.id} className="border border-marketing-border bg-marketing-bg p-3">
                        <div className="mb-2 flex items-start justify-between">
                          <span className="bg-marketing-bg-raised px-2 py-0.5 font-marketing-mono text-[9px] text-marketing-muted-dim">{task.category}</span>
                          <CheckCircle2 size={12} className="text-marketing-accent" />
                        </div>
                        <p className="text-sm text-marketing-muted line-through">{task.title}</p>
                      </div>
                    ))}
                    {filteredTasksDone === 0 && (
                      <div className="border border-dashed border-marketing-border py-8 text-center font-marketing-mono text-xs text-marketing-muted-dim">
                        No completed tasks
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="border border-marketing-border bg-marketing-bg-raised p-6">
              <h3 className="mb-6 font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">Assigned Projects</h3>
              <div className="divide-y divide-marketing-border">
                {filteredProjects.map(proj => (
                  <div key={proj.id} className="flex items-center justify-between rounded px-2 py-4 transition-colors hover:bg-marketing-bg">
                    <div>
                      <h4 className="text-sm font-semibold text-marketing-fg">{proj.title}</h4>
                      <p className="mt-1 font-marketing-mono text-xs capitalize text-marketing-muted-dim">Status: {(proj.status || '').replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <span className="block font-marketing-mono text-[10px] uppercase text-marketing-muted-dim">TIMELINE</span>
                      <span className="text-xs text-marketing-fg">{proj.timeline_start || 'Pending'} — {proj.timeline_end || 'Pending'}</span>
                    </div>
                  </div>
                ))}
                {filteredProjects.length === 0 && (
                  <div className="py-8 text-center text-sm text-marketing-muted">No allocated projects found.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'deliverables' && (
            <div className="space-y-6 border border-marketing-border bg-marketing-bg-raised p-6">
              <div className="flex flex-col justify-between gap-4 border-b border-marketing-border pb-6 md:flex-row md:items-center">
                <div>
                  <h3 className="font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">Deliverable Code / Artifact Submission</h3>
                  <p className="mt-1 text-xs text-marketing-muted">Upload code bundles, blueprints, or design deliverables for Admin review.</p>
                </div>
                <div className="relative">
                  <button className="flex cursor-pointer items-center gap-2 bg-marketing-accent px-6 py-3 text-xs font-bold text-marketing-accent-ink transition-colors hover:bg-marketing-fg">
                    <Upload size={16} />
                    Upload Deliverable
                    <input
                      type="file"
                      onChange={handleDeliverableUpload}
                      disabled={uploading}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </button>
                </div>
              </div>

              {uploading && (
                <div className="flex items-center gap-2 font-marketing-mono text-xs text-marketing-accent">
                  <Loader className="animate-spin" size={16} />
                  Uploading payload to deliverables workspace...
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredDeliverables.map((file, i) => (
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
                        onClick={() => handleDeliverableDownload(file.name)}
                        className="cursor-pointer border border-marketing-border p-2 transition-colors hover:border-marketing-accent hover:text-marketing-accent"
                        title="Download"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => handleDeliverableDelete(file.name)}
                        className="cursor-pointer border border-marketing-border p-2 transition-colors hover:border-red-500/50 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredDeliverables.length === 0 && (
                  <div className="col-span-2 border border-dashed border-marketing-border py-8 text-center text-sm text-marketing-muted">
                    No deliverables uploaded yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="border border-marketing-border bg-marketing-bg-raised p-6 text-center">
                <CheckSquare size={36} className="mx-auto mb-3 text-marketing-accent" />
                <h4 className="font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-muted-dim">Tasks Completed</h4>
                <p className="mt-2 text-3xl font-bold text-marketing-fg">{tasksDone}</p>
              </div>
              <div className="border border-marketing-border bg-marketing-bg-raised p-6 text-center">
                <Calendar size={36} className="mx-auto mb-3 text-marketing-accent" />
                <h4 className="font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-muted-dim">Deadline Met Ratio</h4>
                <p className="mt-2 text-3xl font-bold text-marketing-fg">{deadlineRatio}%</p>
              </div>
              <div className="border border-marketing-border bg-marketing-bg-raised p-6 text-center">
                <Award size={36} className="mx-auto mb-3 text-marketing-accent" />
                <h4 className="font-marketing-mono text-[10px] font-bold uppercase tracking-widest text-marketing-muted-dim">Performance Rating</h4>
                <p className="mt-2 text-3xl font-bold text-marketing-fg">
                  {(profile?.rating ? Number(profile.rating).toFixed(1) : '5.0')} <span className="text-xs text-marketing-muted-dim">/ 5.0</span>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="flex h-[500px] flex-col overflow-hidden border border-marketing-border bg-marketing-bg-raised">
              <div className="flex shrink-0 items-center justify-between border-b border-marketing-border bg-marketing-bg p-4">
                <div>
                  <h3 className="font-marketing-mono text-xs font-semibold uppercase tracking-widest text-marketing-muted-dim">Squad Channels Comms</h3>
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
                    No messaging history. Send a text below to initiate contact.
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

        </div>
      </main>
    </div>
  )
}
