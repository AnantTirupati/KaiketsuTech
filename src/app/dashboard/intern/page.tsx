'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import TopAppBar from '@/components/shared/TopAppBar'
import { 
  CheckSquare, AlertTriangle, Play, CheckCircle2, 
  Award, Calendar, FolderOpen, Upload, Download, Trash, 
  Send, Loader, MessageSquare, Layers, FileText, BarChart2, LogOut
} from 'lucide-react'

interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  category: 'Frontend' | 'Backend' | 'Design Sys' | 'Other'
  due_date?: string
}

export default function InternDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'deliverables' | 'performance' | 'messages'>('overview')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Deliverables file upload state
  const [deliverables, setDeliverables] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  // Messaging State
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('')

  // Reset search query on tab change to prevent stale filters carryover
  useEffect(() => {
    setSearchQuery('')
  }, [activeTab])

  // Filtered lists based on search query
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

  const defaultTasks: Task[] = [
    { id: '1', title: 'Refactor navigation component for mobile', status: 'todo', category: 'Frontend' },
    { id: '2', title: 'Update user auth endpoints', status: 'todo', category: 'Backend' },
    { id: '3', title: 'Implement dark mode tokens in Tailwind config', status: 'in_progress', category: 'Design Sys' },
    { id: '4', title: 'Setup local development environment', status: 'done', category: 'Other' },
  ]

  useEffect(() => {
    async function loadData() {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)

      // Fetch logged-in user profile
      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()
      setProfile(profData || null)

      // Fetch allocated projects (simulated or joined via tasks/profiles)
      // Since interns don't own projects but work on them, we select all projects
      const { data: pData } = await supabase
        .from('projects')
        .select('*')
      setProjects(pData || [])
      if (pData && pData.length > 0) {
        setSelectedProject(pData[0])
      }

      // Fetch intern tasks
      const { data: tData } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', currentUser.id)
      
      if (tData && tData.length > 0) {
        setTasks(tData as Task[])
      } else {
        setTasks(defaultTasks)
      }

      setLoading(false)
    }

    loadData()
  }, [supabase, router])

  // Poll for messages when selectedProject changes
  useEffect(() => {
    if (!selectedProject) return

    let intervalId: any

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
        .eq('project_id', selectedProject.id)
        .order('created_at', { ascending: true })

      setMessages(data || [])
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    fetchMessages()
    intervalId = setInterval(fetchMessages, 4000)

    return () => clearInterval(intervalId)
  }, [selectedProject, supabase])

  // Load deliverables from storage bucket
  useEffect(() => {
    if (activeTab === 'deliverables' && user) {
      loadDeliverables()
    }
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
      } catch (err: any) {
        toast(err.message || 'File upload failed.', 'error')
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
      } catch (err: any) {
        toast(err.message || 'Failed to delete file.', 'error')
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
      } catch (err: any) {
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
    } catch (err: any) {
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

  const tasksTodo = tasks.filter(t => t.status === 'todo').length
  const tasksInProgress = tasks.filter(t => t.status === 'in_progress').length
  const tasksDone = tasks.filter(t => t.status === 'done').length

  const totalTasks = tasks.length
  const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length
  const deadlineRatio = totalTasks > 0 ? Math.round(((totalTasks - overdueTasks) / totalTasks) * 100) : 100

  const filteredTasksTodo = filteredTasks.filter(t => t.status === 'todo').length
  const filteredTasksInProgress = filteredTasks.filter(t => t.status === 'in_progress').length
  const filteredTasksDone = filteredTasks.filter(t => t.status === 'done').length

  return (
    <div className="bg-[#0B0B0B] text-on-surface antialiased min-h-screen flex font-body-md overflow-hidden">
      {/* SideNavBar */}
      <aside className="bg-surface-container-low w-64 h-screen border-r border-[#222] flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="p-6 border-b border-[#222]">
            <img src="/weblogo.svg" alt="Kaiketsu Logo" className="h-10 w-auto" />
            <p className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest mt-2 font-bold">Intern Workspace</p>
          </div>
          <nav className="px-4 py-6 space-y-1">
            {[
              { id: 'overview', label: 'Kanban Sprint Board', icon: <CheckSquare size={18} /> },
              { id: 'projects', label: 'Allocated Projects', icon: <Layers size={18} /> },
              { id: 'deliverables', label: 'Upload Deliverables', icon: <Upload size={18} /> },
              { id: 'performance', label: 'Metrics & Rating', icon: <BarChart2 size={18} /> },
              { id: 'messages', label: 'Channel Comms', icon: <MessageSquare size={18} /> }
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
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-on-surface truncate">{user?.email}</span>
              <span className="text-[10px] text-on-surface-variant font-mono-sm">Technical Intern</span>
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

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopAppBar 
          title={activeTab === 'overview' ? 'Kanban Sprint Board' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
          placeholder="Search tasks..." 
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto p-gutter pt-8 max-w-max-width w-full mx-auto space-y-6">

          {/* OVERVIEW / KANBAN TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick stats row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div className="bg-[#111] border border-[#222] rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Award className="text-primary" size={80} />
                  </div>
                  <div>
                    <h4 className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Sprint Performance</h4>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-on-surface">94</span>
                      <span className="font-mono-sm text-xs text-primary">+2.4%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111] border border-[#222] rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Calendar className="text-primary" size={80} />
                  </div>
                  <div>
                    <h4 className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Upcoming Milestones</h4>
                    <div className="mt-4 flex items-center gap-2 text-xs">
                      <span className="font-semibold text-on-surface">Security Audit Sign-off</span>
                      <span className="text-primary font-mono-sm">• Oct 24</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111] border border-[#222] rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <FolderOpen className="text-primary" size={80} />
                  </div>
                  <div>
                    <h4 className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Active Allocations</h4>
                    <div className="mt-4 text-xs">
                      <span className="font-semibold text-on-surface">{projects.length} Active Projects</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-12">
                {/* To Do Column */}
                <div className="bg-[#111111] border border-[#222222] rounded p-3">
                  <h5 className="font-mono-sm text-xs text-on-surface-variant uppercase tracking-wider mb-3 flex justify-between font-bold">
                    To Do <span className="bg-[#222222] px-2 rounded">{filteredTasksTodo}</span>
                  </h5>
                  <div className="space-y-2">
                    {filteredTasks.filter(t => t.status === 'todo').map((task) => (
                      <div key={task.id} className="bg-[#1a1a1a] p-3 rounded border border-[#333333] hover:border-[#555] transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-mono-sm px-2 py-0.5 rounded bg-[#2a1b12] text-primary">{task.category}</span>
                          <button 
                            onClick={() => moveTask(task.id, 'in_progress')}
                            className="text-xs text-primary hover:underline transition-colors cursor-pointer flex items-center gap-0.5"
                          >
                            Start <Play size={10} className="fill-icon" />
                          </button>
                        </div>
                        <p className="font-body-md text-sm text-on-surface">{task.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="bg-[#111111] border border-[#222222] rounded p-3 relative">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-primary-container"></div>
                  <h5 className="font-mono-sm text-xs text-on-surface-variant uppercase tracking-wider mb-3 flex justify-between font-bold">
                    In Progress <span className="bg-[#222222] px-2 rounded text-primary">{filteredTasksInProgress}</span>
                  </h5>
                  <div className="space-y-2">
                    {filteredTasks.filter(t => t.status === 'in_progress').map((task) => (
                      <div key={task.id} className="bg-[#1a1a1a] p-3 rounded border border-primary-container/30 shadow-[0_0_15px_rgba(249,115,22,0.05)] hover:border-primary transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-mono-sm px-2 py-0.5 rounded bg-[#2a1b12] text-primary">{task.category}</span>
                          <button 
                            onClick={() => moveTask(task.id, 'done')}
                            className="text-xs text-[#4ade80] hover:underline transition-colors cursor-pointer flex items-center gap-0.5"
                          >
                            Complete <CheckSquare size={10} />
                          </button>
                        </div>
                        <p className="font-body-md text-sm text-on-surface">{task.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Done Column */}
                <div className="bg-[#111111] border border-[#222222] rounded p-3 opacity-70">
                  <h5 className="font-mono-sm text-xs text-on-surface-variant uppercase tracking-wider mb-3 flex justify-between font-bold">
                    Done <span className="bg-[#222222] px-2 rounded">{filteredTasksDone}</span>
                  </h5>
                  <div className="space-y-2">
                    {filteredTasks.filter(t => t.status === 'done').map((task) => (
                      <div key={task.id} className="bg-[#1a1a1a] p-3 rounded border border-[#333333]">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-mono-sm px-2 py-0.5 rounded bg-[#222] text-on-surface-variant">{task.category}</span>
                          <CheckCircle2 size={12} className="text-[#4ade80]" />
                        </div>
                        <p className="font-body-md text-sm text-on-surface-variant line-through">{task.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="bg-[#111] border border-[#222] rounded-lg p-6">
              <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest mb-6">Assigned Projects</h3>
              <div className="divide-y divide-[#222222]">
                {filteredProjects.map(proj => (
                  <div key={proj.id} className="py-4 hover:bg-[#1a1a1a]/20 px-2 rounded transition-colors flex items-center justify-between">
                    <div>
                      <h4 className="font-body-md font-semibold text-on-surface text-sm">{proj.title}</h4>
                      <p className="font-mono-sm text-xs text-on-surface-variant mt-1 capitalize">Status: {proj.status.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono-sm text-[10px] text-on-surface-variant block uppercase">TIMELINE</span>
                      <span className="text-xs text-on-surface">{proj.timeline_start || 'Pending'} — {proj.timeline_end || 'Pending'}</span>
                    </div>
                  </div>
                ))}
                {filteredProjects.length === 0 && (
                  <div className="py-8 text-center text-on-surface-variant text-sm">No allocated projects found.</div>
                )}
              </div>
            </div>
          )}

          {/* DELIVERABLES TAB */}
          {activeTab === 'deliverables' && (
            <div className="bg-[#111] border border-[#222] rounded-lg p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
                <div>
                  <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest">Deliverable Code / Artifact Submission</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Upload code bundles, blueprints, or design deliverables for Admin review.</p>
                </div>
                <div className="relative">
                  <button className="bg-primary-container text-white py-3 px-6 rounded hover:bg-[#d8600d] transition-colors flex items-center gap-2 cursor-pointer font-bold text-xs shadow-md">
                    <Upload size={16} />
                    Upload Deliverable
                    <input 
                      type="file" 
                      onChange={handleDeliverableUpload} 
                      disabled={uploading}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </button>
                </div>
              </div>

              {uploading && (
                <div className="flex items-center gap-2 text-xs text-primary font-mono-sm">
                  <Loader className="animate-spin" size={16} />
                  Uploading payload to deliverables workspace...
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDeliverables.map((file, i) => (
                  <div key={i} className="bg-[#1a1a1a] border border-[#222] p-4 rounded-lg flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 truncate">
                      <FileText className="text-primary shrink-0" size={24} />
                      <div className="truncate">
                        <p className="text-sm font-semibold text-on-surface truncate">{file.name}</p>
                        <p className="text-[10px] font-mono-sm text-on-surface-variant">{(file.metadata?.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleDeliverableDownload(file.name)}
                        className="p-2 bg-[#222] border border-[#333] hover:border-primary/50 rounded hover:text-primary transition-all cursor-pointer"
                        title="Download"
                      >
                        <Download size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeliverableDelete(file.name)}
                        className="p-2 bg-[#222] border border-[#333] hover:border-error/50 rounded hover:text-error transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredDeliverables.length === 0 && (
                  <div className="col-span-2 py-8 text-center text-on-surface-variant text-sm border border-dashed border-[#222] rounded-lg">
                    No deliverables uploaded yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="bg-[#111] border border-[#222] p-6 rounded-lg text-center">
                <CheckSquare size={36} className="text-primary mx-auto mb-3" />
                <h4 className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Tasks Completed</h4>
                <p className="text-3xl font-bold mt-2">{tasksDone}</p>
              </div>
              <div className="bg-[#111] border border-[#222] p-6 rounded-lg text-center">
                <Calendar size={36} className="text-primary mx-auto mb-3" />
                <h4 className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Deadline Met Ratio</h4>
                <p className="text-3xl font-bold mt-2">{deadlineRatio}%</p>
              </div>
              <div className="bg-[#111] border border-[#222] p-6 rounded-lg text-center">
                <Award size={36} className="text-primary mx-auto mb-3" />
                <h4 className="font-mono-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Performance Rating</h4>
                <p className="text-3xl font-bold mt-2">
                  {(profile?.rating ? Number(profile.rating).toFixed(1) : '5.0')} <span className="text-xs text-on-surface-variant">/ 5.0</span>
                </p>
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="bg-[#111] border border-[#222] rounded-lg h-[500px] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-[#222] bg-[#1a1a1a] flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-widest">Squad Channels Comms</h3>
                  {selectedProject ? (
                    <p className="text-[11px] font-mono-sm text-primary mt-0.5">Project: {selectedProject.title}</p>
                  ) : (
                    <p className="text-[11px] font-mono-sm text-on-surface-variant mt-0.5">Select a project to chat</p>
                  )}
                </div>
                {projects.length > 1 && (
                  <select 
                    value={selectedProject?.id || ''} 
                    onChange={e => setSelectedProject(projects.find(p => p.id === e.target.value))}
                    className="bg-[#0B0B0B] border border-[#333] text-on-surface font-mono-sm text-xs rounded p-2 focus:border-primary outline-none cursor-pointer"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                )}
              </div>

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
                          ? 'bg-primary-container text-white rounded-br-none' 
                          : 'bg-[#1a1a1a] border border-[#222] text-on-surface rounded-bl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  )
                })}
                {filteredMessages.length === 0 && (
                  <div className="h-full flex items-center justify-center text-on-surface-variant text-xs font-mono-sm">
                    No messaging history. Send a text below to initiate contact.
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

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

        </div>
      </main>
    </div>
  )
}
