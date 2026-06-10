'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import TopAppBar from '@/components/shared/TopAppBar'
import { CheckSquare, AlertTriangle, Play, CheckCircle2, Award, Calendar, FolderOpen } from 'lucide-react'

interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  category: 'Frontend' | 'Backend' | 'Design Sys' | 'Other'
}

export default function InternDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  const defaultTasks: Task[] = [
    { id: '1', title: 'Refactor navigation component for mobile', status: 'todo', category: 'Frontend' },
    { id: '2', title: 'Update user auth endpoints', status: 'todo', category: 'Backend' },
    { id: '3', title: 'Implement dark mode tokens in Tailwind config', status: 'in_progress', category: 'Design Sys' },
    { id: '4', title: 'Setup local development environment', status: 'done', category: 'Other' },
  ]

  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('assigned_to', user.id)

          if (error) throw error
          if (data && data.length > 0) {
            setTasks(data as Task[])
          } else {
            setTasks(defaultTasks)
          }
        } else {
          setTasks(defaultTasks)
        }
      } catch (err) {
        console.error('Error fetching intern tasks:', err)
        setTasks(defaultTasks)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [supabase])

  const moveTask = async (taskId: string, nextStatus: 'todo' | 'in_progress' | 'done') => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t))
    toast(`Moving task status to ${nextStatus}`, 'info')

    try {
      // Try to update in DB if task has UUID (i.e. is real)
      if (taskId.length > 5) {
        const { error } = await supabase
          .from('tasks')
          .update({ status: nextStatus })
          .eq('id', taskId)

        if (error) throw error
      }
      toast('Task status updated.', 'success')
    } catch (err) {
      console.error('Failed to update task in DB:', err)
    }
  }

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-grid-pattern">
      <TopAppBar title="Dashboard" placeholder="Search tasks, projects..." />

      {/* Canvas */}
      <div className="flex-grow overflow-y-auto p-gutter pt-8 max-w-max-width w-full mx-auto flex flex-col gap-gutter">
        
        {/* Welcome Section */}
        <div className="mb-4">
          <p className="font-section-label text-[10px] text-primary tracking-widest uppercase mb-2">Intern Workspace</p>
          <h3 className="font-display-lg text-2xl md:text-3xl text-on-surface font-bold">Welcome back, Intern.</h3>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Performance Score */}
          <div className="glass-panel rounded-lg p-6 flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Award className="text-primary" size={80} />
            </div>
            <div>
              <h4 className="font-label-md text-xs text-on-surface-variant flex items-center gap-2 font-bold uppercase">
                Performance Score
              </h4>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display-lg text-4xl font-bold text-on-surface">94</span>
                <span className="font-mono-sm text-xs text-primary">+2.4%</span>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="glass-panel rounded-lg p-6 flex flex-col min-h-[160px]">
            <h4 className="font-label-md text-xs text-on-surface-variant flex items-center gap-2 font-bold uppercase mb-4">
              <Calendar size={16} /> Upcoming Deadlines
            </h4>
            <ul className="space-y-3 flex-1">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-[#222222] flex flex-col items-center justify-center border border-[#333333]">
                  <span className="font-mono-sm text-[8px] text-on-surface-variant uppercase">Oct</span>
                  <span className="font-label-md text-xs text-on-surface leading-none">12</span>
                </div>
                <div>
                  <p className="font-label-md text-sm text-on-surface">API Integration Doc</p>
                  <p className="font-mono-sm text-[10px] text-error flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span> 14:00 (Urgent)</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Active Allocations */}
          <div className="glass-panel rounded-lg p-6 flex flex-col min-h-[160px]">
            <h4 className="font-label-md text-xs text-on-surface-variant flex items-center gap-2 mb-4 font-bold uppercase">
              <FolderOpen size={16} /> Active Allocations
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="font-label-md text-xs text-on-surface">Project Titan (Frontend)</span>
                  <span className="font-mono-sm text-xs text-primary">75%</span>
                </div>
                <div className="w-full bg-[#222222] h-1 rounded-full overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Sprint Tasks Kanban */}
        <div className="glass-panel rounded-lg p-6 mb-24">
          <div className="flex justify-between items-center mb-6 border-b border-[#222222] pb-4">
            <h4 className="font-headline-lg text-lg text-on-surface flex items-center gap-2 font-bold">
              Current Sprint Tasks
            </h4>
          </div>

          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* To Do Column */}
              <div className="bg-[#111111] border border-[#222222] rounded p-3">
                <h5 className="font-mono-sm text-xs text-on-surface-variant uppercase tracking-wider mb-3 flex justify-between font-bold">
                  To Do <span className="bg-[#222222] px-2 rounded">{tasks.filter(t => t.status === 'todo').length}</span>
                </h5>
                <div className="space-y-2">
                  {tasks.filter(t => t.status === 'todo').map((task) => (
                    <div key={task.id} className="bg-[#1a1a1a] p-3 rounded border border-[#333333] hover:border-[#555] transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-mono-sm px-2 py-0.5 rounded bg-[#2a1b12] text-primary">{task.category}</span>
                        <button 
                          onClick={() => moveTask(task.id, 'in_progress')}
                          className="text-xs text-primary-container hover:text-primary transition-colors cursor-pointer flex items-center gap-0.5"
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
                  In Progress <span className="bg-[#222222] px-2 rounded text-primary">{tasks.filter(t => t.status === 'in_progress').length}</span>
                </h5>
                <div className="space-y-2">
                  {tasks.filter(t => t.status === 'in_progress').map((task) => (
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
                  Done <span className="bg-[#222222] px-2 rounded">{tasks.filter(t => t.status === 'done').length}</span>
                </h5>
                <div className="space-y-2">
                  {tasks.filter(t => t.status === 'done').map((task) => (
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
          )}
        </div>

      </div>
    </main>
  )
}
