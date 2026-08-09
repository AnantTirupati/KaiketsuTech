'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const TYPE_STYLES: Record<ToastType, string> = {
  success: 'border-marketing-accent/40 text-marketing-accent',
  error: 'border-red-500/40 text-red-400',
  warning: 'border-amber-500/40 text-amber-400',
  info: 'border-marketing-border-strong text-marketing-fg',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration }])
    setTimeout(() => removeToast(id), duration)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-full max-w-sm flex-col gap-2 font-marketing-sans">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`pointer-events-auto flex items-start gap-3 border bg-marketing-bg-raised/95 p-4 shadow-xl backdrop-blur-md ${TYPE_STYLES[t.type]}`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {t.type === 'success' && <CheckCircle size={18} />}
                {t.type === 'error' && <AlertCircle size={18} />}
                {t.type === 'warning' && <AlertCircle size={18} />}
                {t.type === 'info' && <Info size={18} />}
              </div>
              <div className="flex-1 text-sm font-medium text-marketing-fg">
                {t.message}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-marketing-muted-dim transition-colors hover:text-marketing-fg cursor-pointer"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
