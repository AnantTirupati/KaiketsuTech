'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, Loader } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    let active = true
    async function checkSession() {
      // Check if user is authenticated (session established by clicking invite or reset link)
      // We retry up to 3 times with 500ms intervals to handle occasional session hydration lag
      const maxRetries = 3
      const retryDelay = 500

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        if (!active) return

        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          if (active) {
            setCheckingSession(false)
          }
          return
        }

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
      }

      if (active) {
        toast('No active session found. Please request a new invite or password reset.', 'error')
        router.push('/login')
      }
    }
    checkSession()

    return () => {
      active = false
    }
  }, [supabase, router, toast])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast('Please fill in all fields.', 'warning')
      return
    }

    if (password !== confirmPassword) {
      toast('Passwords do not match.', 'error')
      return
    }

    if (password.length < 6) {
      toast('Password must be at least 6 characters long.', 'warning')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password.trim()
      })

      if (error) throw error

      toast('Password set successfully! Redirecting to dashboard...', 'success')

      // Get user profile to determine redirect destination
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        const role = profile?.role || 'client'
        router.push(`/dashboard/${role}`)
      } else {
        router.push('/login')
      }
    } catch (err: any) {
      console.error('Password update error:', err)
      toast(err.message || 'Failed to update password. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#0B0B0B]">
        <Loader className="animate-spin text-primary" size={36} />
      </div>
    )
  }

  return (
    <div className="bg-[#0B0B0B] text-on-surface min-h-screen flex antialiased overflow-hidden items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-8 shadow-2xl relative overflow-hidden w-full max-w-md">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-50"></div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-headline-lg text-xl md:text-2xl text-on-surface mb-2 font-bold">Set Your Password</h2>
          <p className="font-body-md text-sm text-on-surface-variant">Please choose a password to complete your account setup.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1">
            <label className="block font-label-md text-sm text-on-surface-variant" htmlFor="password">New Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
              <input 
                className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 pl-10 pr-4 font-body-md text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all outline-none"
                id="password" 
                placeholder="••••••••" 
                required 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-label-md text-sm text-on-surface-variant" htmlFor="confirm_password">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
              <input 
                className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 pl-10 pr-4 font-body-md text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all outline-none"
                id="confirm_password" 
                placeholder="••••••••" 
                required 
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            className="w-full bg-primary-container text-white font-label-md text-sm py-3 rounded-lg hover:bg-opacity-95 transition-colors mt-6 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" size={18} /> : 'Complete Setup'}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
