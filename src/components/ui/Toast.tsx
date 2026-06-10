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
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`p-4 rounded-lg shadow-xl border flex items-start gap-3 pointer-events-auto bg-surface-container/90 backdrop-blur-md ${
                t.type === 'success' ? 'border-[#4ade80]/30 text-[#4ade80]' :
                t.type === 'error' ? 'border-error/30 text-error' :
                t.type === 'warning' ? 'border-secondary/30 text-secondary' :
                'border-outline-variant/30 text-on-surface'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {t.type === 'success' && <CheckCircle size={18} />}
                {t.type === 'error' && <AlertCircle size={18} />}
                {t.type === 'warning' && <AlertCircle size={18} />}
                {t.type === 'info' && <Info size={18} />}
              </div>
              <div className="flex-1 text-sm font-medium text-on-surface">
                {t.message}
              </div>
              <button 
                onClick={() => removeToast(t.id)} 
                className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
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
