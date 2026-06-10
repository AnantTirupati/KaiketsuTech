'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface SidebarProps {
  userRole: 'admin' | 'client' | 'intern'
  userName: string
  userEmail: string
}

export default function Sidebar({ userRole, userName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Define nav links based on role
  const getNavLinks = () => {
    switch (userRole) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/dashboard/admin', icon: 'dashboard' },
          { name: 'Projects', href: '#', icon: 'account_tree' },
          { name: 'Clients', href: '#', icon: 'groups' },
          { name: 'Interns', href: '#', icon: 'school' },
          { name: 'Analytics', href: '#', icon: 'monitoring' },
          { name: 'Internal Tools', href: '#', icon: 'settings' },
        ]
      case 'intern':
        return [
          { name: 'Dashboard', href: '/dashboard/intern', icon: 'dashboard' },
          { name: 'Projects', href: '#', icon: 'account_tree' },
          { name: 'Allocations', href: '#', icon: 'folder_open' },
          { name: 'Sprint Tasks', href: '#', icon: 'checklist' },
        ]
      case 'client':
      default:
        return [
          { name: 'Dashboard', href: '/dashboard/client', icon: 'dashboard' },
          { name: 'Projects', href: '#', icon: 'account_tree' },
          { name: 'Milestones', href: '#', icon: 'flag' },
          { name: 'Payments & Invoices', href: '#', icon: 'payments' },
        ]
    }
  }

  const navLinks = getNavLinks()

  return (
    <aside className="bg-surface-container-low h-screen w-64 fixed left-0 top-0 border-r border-outline-variant shadow-md flex flex-col z-50">
      {/* Brand Header */}
      <div className="p-stack-md flex items-center gap-stack-sm border-b border-outline-variant/30 pb-stack-lg mb-stack-md">
        <span className="material-symbols-outlined text-primary text-3xl fill-icon">eco</span>
        <div>
          <h1 className="font-headline-lg text-primary text-xl leading-tight tracking-tight">Kaiketsu Portal</h1>
          <p className="font-mono-sm text-mono-sm text-on-surface-variant">Enterprise Console</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-stack-sm flex flex-col gap-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-stack-md p-stack-md m-stack-sm rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface hover:translate-x-1 duration-200'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'fill-icon' : ''}`}>
                {link.icon}
              </span>
              <span className="font-body-md text-body-md">{link.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-stack-md mt-auto border-t border-outline-variant/30 pt-stack-md">
        <Link 
          href="/start-project" 
          className="w-full bg-primary-container text-white font-label-md text-label-md py-3 rounded-lg hover:bg-opacity-95 transition-colors mb-stack-md flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Request
        </Link>
        <div className="flex flex-col gap-1">
          <Link href="#" className="text-on-surface-variant hover:text-on-surface flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors">
            <span className="material-symbols-outlined text-[20px]">help</span>
            Help
          </Link>
          <button 
            onClick={handleSignOut}
            className="text-on-surface-variant hover:text-error flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign Out
          </button>
        </div>

        {/* User Profile Snippet */}
        <div className="mt-stack-md flex items-center gap-3 p-2 rounded-lg bg-surface-container-highest/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary uppercase font-bold text-sm">
            {userName ? userName.charAt(0) : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-on-surface truncate">{userName || 'Kaiketsu User'}</p>
            <p className="text-xs text-on-surface-variant truncate uppercase tracking-wider font-mono-sm text-[9px]">{userRole}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
