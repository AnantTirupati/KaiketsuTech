'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, CheckCircle2, Info, AlertTriangle, Trash2, Menu } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface TopAppBarProps {
  title: string
  placeholder?: string
  searchValue?: string
  onSearchChange?: (val: string) => void
  onMenuClick?: () => void
}

interface Notification {
  id: string
  title: string
  description: string
  created_at: string
  type: 'success' | 'info' | 'warning'
  read: boolean
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default function TopAppBar({
  title,
  placeholder = 'Search...',
  searchValue = '',
  onSearchChange,
  onMenuClick
}: TopAppBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const supabase = createClient()

  useEffect(() => {
    let active = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any = null

    async function setupNotifications() {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user || !active) return

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notifications:', error)
        return
      }

      if (active) {
        setNotifications((data as unknown as Notification[]) || [])
      }

      channel = supabase
        .channel(`user-notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (!active) return
            if (payload.eventType === 'INSERT') {
              setNotifications(prev => [payload.new as Notification, ...prev])
            } else if (payload.eventType === 'UPDATE') {
              setNotifications(prev => prev.map(n => n.id === payload.new.id ? (payload.new as Notification) : n))
            } else if (payload.eventType === 'DELETE') {
              setNotifications(prev => prev.filter(n => n.id !== payload.old.id))
            }
          }
        )
        .subscribe()
    }

    setupNotifications()

    return () => {
      active = false
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [supabase])

  const hasUnread = notifications.some(n => !n.read)

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
    if (error) console.error('Error marking notification as read:', error)
  }

  const markAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
    if (error) console.error('Error marking all notifications as read:', error)
  }

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(prev => prev.filter(n => n.id !== id))
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
    if (error) console.error('Error deleting notification:', error)
  }

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-marketing-border bg-marketing-bg/85 px-6 py-4 backdrop-blur-md font-marketing-sans">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="flex cursor-pointer items-center justify-center p-2 text-marketing-muted-dim transition-colors hover:text-marketing-accent md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        <h2 className="font-marketing-sans text-xl font-bold tracking-tight text-marketing-fg md:text-2xl">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-marketing-muted-dim" size={16} />
          <input
            className="w-64 border border-marketing-border bg-marketing-bg-raised py-2 pl-10 pr-4 text-sm text-marketing-fg outline-none transition-colors placeholder:text-marketing-muted-dim/60 focus:border-marketing-accent"
            placeholder={placeholder}
            type="text"
            value={searchValue}
            onChange={e => onSearchChange?.(e.target.value)}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative flex cursor-pointer items-center justify-center p-2 text-marketing-muted-dim transition-colors hover:text-marketing-accent ${isOpen ? 'text-marketing-accent' : ''}`}
            title="Notifications"
          >
            <Bell size={20} />
            {hasUnread && (
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-marketing-accent opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-marketing-accent"></span>
              </span>
            )}
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setIsOpen(false)}
              />

              <div className="absolute right-0 top-full z-50 mt-3 w-80 border border-marketing-border bg-marketing-bg-raised py-3 text-left shadow-2xl md:w-96">
                <div className="flex items-center justify-between border-b border-marketing-border px-4 pb-2.5">
                  <span className="font-marketing-sans text-xs font-bold text-marketing-fg">Notifications</span>
                  {hasUnread && (
                    <button
                      onClick={markAllAsRead}
                      className="cursor-pointer font-marketing-mono text-[10px] uppercase text-marketing-accent transition-colors hover:text-marketing-fg"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 divide-y divide-marketing-border overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`group relative flex cursor-pointer gap-3 p-3.5 transition-colors hover:bg-marketing-bg ${!n.read ? 'bg-marketing-accent/5' : ''}`}
                      >
                        {!n.read && (
                          <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-marketing-accent" />
                        )}

                        <div className="mt-0.5 shrink-0">
                          {n.type === 'success' && <CheckCircle2 size={15} className="text-marketing-accent" />}
                          {n.type === 'warning' && <AlertTriangle size={15} className="text-amber-400" />}
                          {n.type === 'info' && <Info size={15} className="text-sky-400" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`truncate text-[11px] leading-tight ${!n.read ? 'font-bold text-marketing-fg' : 'font-semibold text-marketing-muted'}`}>
                              {n.title}
                            </p>
                            <span className="shrink-0 font-marketing-mono text-[9px] text-marketing-muted-dim">{formatRelativeTime(n.created_at)}</span>
                          </div>
                          <p className="mt-1 break-words text-[10.5px] leading-relaxed text-marketing-muted">
                            {n.description}
                          </p>
                        </div>

                        <button
                          onClick={(e) => deleteNotification(n.id, e)}
                          className="shrink-0 cursor-pointer self-center p-0.5 text-marketing-muted-dim opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
                          title="Dismiss"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center font-marketing-mono text-xs text-marketing-muted-dim">
                      No notifications yet
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
