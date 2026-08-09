'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, Loader } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import AuthShell from '@/components/marketing/AuthShell'

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Password update error:', err)
      toast(err.message || 'Failed to update password. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-marketing-bg">
        <Loader className="animate-spin text-marketing-accent" size={32} />
      </div>
    )
  }

  return (
    <AuthShell>
      <div className="w-full max-w-md border border-marketing-border bg-marketing-bg-raised p-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 font-marketing-sans text-xl font-bold text-marketing-fg md:text-2xl">Set your password</h2>
          <p className="text-sm text-marketing-muted">Please choose a password to complete your account setup.</p>
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="block text-sm text-marketing-fg" htmlFor="password">New password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-marketing-muted-dim" />
              <input
                className="w-full border border-marketing-border bg-marketing-bg py-3 pl-10 pr-4 text-sm text-marketing-fg placeholder:text-marketing-muted-dim/50 focus:border-marketing-accent focus:outline-none"
                id="password"
                placeholder="••••••••"
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-sm text-marketing-fg" htmlFor="confirm_password">Confirm password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-marketing-muted-dim" />
              <input
                className="w-full border border-marketing-border bg-marketing-bg py-3 pl-10 pr-4 text-sm text-marketing-fg placeholder:text-marketing-muted-dim/50 focus:border-marketing-accent focus:outline-none"
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
            className="mt-2 flex w-full items-center justify-center gap-2 bg-marketing-accent px-6 py-3 text-sm font-semibold text-marketing-accent-ink transition-colors hover:bg-marketing-fg disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" size={18} /> : 'Complete setup'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </AuthShell>
  )
}
