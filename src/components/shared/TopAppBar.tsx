'use client'

import { useState } from 'react'

interface TopAppBarProps {
  title: string
  placeholder?: string
}

export default function TopAppBar({ title, placeholder = 'Search...' }: TopAppBarProps) {
  const [showNotificationGlow, setShowNotificationGlow] = useState(true)

  return (
    <header className="w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant flat flex justify-between items-center px-gutter py-stack-md">
      <div className="flex items-center gap-4">
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input 
            className="bg-surface-container-highest border border-outline-variant text-on-surface text-sm rounded-full pl-9 pr-4 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 w-64 transition-all" 
            placeholder={placeholder} 
            type="text"
          />
        </div>
        <button 
          onClick={() => setShowNotificationGlow(false)}
          className="text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors p-2 rounded-full cursor-pointer active:opacity-70 relative"
        >
          <span className="material-symbols-outlined">notifications</span>
          {showNotificationGlow && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-container rounded-full"></span>
          )}
        </button>
      </div>
    </header>
  )
}
