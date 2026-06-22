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
    let channel: any = null

    async function setupNotifications() {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user || !active) return

      // Fetch existing notifications
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

      // Subscribe to Realtime postgres_changes
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
    <header className="w-full sticky top-0 z-40 bg-surface/85 backdrop-blur-md border-b border-outline-variant/35 flex justify-between items-center px-gutter py-4">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="md:hidden text-on-surface-variant hover:text-primary transition-all p-2 rounded-full cursor-pointer flex items-center justify-center"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        <h2 className="font-headline-lg text-xl md:text-2xl text-on-surface font-bold tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size={16} />
          <input 
            className="bg-surface-container-high border border-outline-variant/40 text-on-surface text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all placeholder:text-on-surface-variant/40" 
            placeholder={placeholder} 
            type="text"
            value={searchValue}
            onChange={e => onSearchChange?.(e.target.value)}
          />
        </div>
        
        {/* Notification Bell Button & Dropdown Container */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/40 transition-all p-2 rounded-full cursor-pointer relative flex items-center justify-center active:scale-95 ${isOpen ? 'text-primary bg-surface-container-highest/40' : ''}`}
            title="Notifications"
          >
            <Bell size={20} className="transition-transform duration-200 hover:rotate-12" />
            {hasUnread && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
              </span>
            )}
          </button>

          {isOpen && (
            <>
              {/* Overlay Backdrop to dismiss popover when clicking outside */}
              <div 
                className="fixed inset-0 z-40 cursor-default" 
                onClick={() => setIsOpen(false)}
              />
              
              {/* Notification Popover Box */}
              <div className="absolute right-0 top-full mt-3 w-80 md:w-96 rounded-xl border border-outline-variant/35 bg-surface-container-high/95 backdrop-blur-md shadow-2xl z-50 py-3 text-left animate-in fade-in slide-in-from-top-3 duration-200 ease-out origin-top-right">
                {/* Header */}
                <div className="flex items-center justify-between px-4 pb-2.5 border-b border-outline-variant/25">
                  <span className="text-xs font-bold text-on-surface font-headline-lg">Notifications</span>
                  {hasUnread && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] text-primary hover:text-primary-container font-mono-sm uppercase cursor-pointer transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                {/* Notification List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/15">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markAsRead(n.id)}
                        className={`group p-3.5 flex gap-3 cursor-pointer transition-all relative hover:bg-surface-container-highest/60 ${!n.read ? 'bg-primary/5' : ''}`}
                      >
                        {/* Left edge accent for unread */}
                        {!n.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary-container rounded-r" />
                        )}
                        
                        {/* Dynamic Notification Type Icon */}
                        <div className="mt-0.5 shrink-0">
                          {n.type === 'success' && <CheckCircle2 size={15} className="text-[#4ade80]" />}
                          {n.type === 'warning' && <AlertTriangle size={15} className="text-amber-400" />}
                          {n.type === 'info' && <Info size={15} className="text-sky-400" />}
                        </div>
                        
                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <p className={`text-[11px] truncate leading-tight ${!n.read ? 'font-bold text-on-surface' : 'font-semibold text-on-surface-variant/80'}`}>
                              {n.title}
                            </p>
                            <span className="text-[9px] text-on-surface-variant/50 font-mono-sm shrink-0">{formatRelativeTime(n.created_at)}</span>
                          </div>
                          <p className="text-[10.5px] text-on-surface-variant/80 leading-relaxed mt-1 break-words">
                            {n.description}
                          </p>
                        </div>

                        {/* Action Dismiss Button */}
                        <button 
                          onClick={(e) => deleteNotification(n.id, e)}
                          className="opacity-0 group-hover:opacity-100 hover:text-error text-on-surface-variant/40 transition-all p-0.5 shrink-0 self-center cursor-pointer"
                          title="Dismiss"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-on-surface-variant/60 font-mono-sm">
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
