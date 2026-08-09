'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, Loader } from 'lucide-react'
import { resetPasswordForEmail } from '@/lib/auth'
import { useToast } from '@/components/ui/Toast'

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast('Please enter your email address.', 'warning')
      return
    }

    setLoading(true)

    try {
      const checkRes = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (!checkRes.ok) {
        throw new Error('Failed to verify account. Please try again.')
      }

      const { exists } = await checkRes.json()

      if (!exists) {
        toast('No account with this email exists. Please sign up first.', 'error')
        setLoading(false)
        return
      }

      await resetPasswordForEmail(email)
      toast('Password reset link sent! Please check your email inbox.', 'success')
      setEmail('')
    } catch (err: unknown) {
      console.error(err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset link.'
      toast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md border border-marketing-border bg-marketing-bg-raised p-8">
      <div className="mb-8 text-center">
        <h2 className="mb-2 font-marketing-sans text-xl font-bold text-marketing-fg md:text-2xl">Reset your password</h2>
        <p className="text-sm text-marketing-muted">Enter your email to receive a secure reset link.</p>
      </div>

      <form onSubmit={handleReset} className="flex flex-col gap-6">
        <div>
          <label className="mb-2 block text-sm text-marketing-fg" htmlFor="email">Email address</label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-marketing-muted-dim" />
            <input
              className="w-full border border-marketing-border bg-marketing-bg py-3 pl-10 pr-3 text-sm text-marketing-fg placeholder:text-marketing-muted-dim/50 focus:border-marketing-accent focus:outline-none"
              id="email"
              placeholder="hello@kaiketsutech.online"
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 bg-marketing-accent px-4 py-3 font-marketing-mono text-xs font-bold uppercase tracking-wider text-marketing-accent-ink transition-colors hover:bg-marketing-fg disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin" size={18} /> : 'Send reset link'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link
          className="group inline-flex items-center gap-2 text-sm text-marketing-muted-dim transition-colors hover:text-marketing-accent"
          href="/login"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Return to login
        </Link>
      </div>
    </div>
  )
}
