'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User as UserIcon, Mail, Lock, ArrowRight, Loader } from 'lucide-react'
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth'
import { useToast } from '@/components/ui/Toast'

const inputClass =
  'w-full border border-marketing-border bg-marketing-bg py-3 pl-10 pr-4 text-sm text-marketing-fg placeholder:text-marketing-muted-dim/50 focus:border-marketing-accent focus:outline-none'

export default function SignUpForm() {
  const role = 'client'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !email || !password || !confirmPassword) {
      toast('Please fill in all fields.', 'warning')
      return
    }

    if (password !== confirmPassword) {
      toast('Passwords do not match.', 'error')
      return
    }

    if (password.length < 6) {
      toast('Password should be at least 6 characters long.', 'warning')
      return
    }

    setLoading(true)

    try {
      await signUpWithEmail(email, password, fullName, role)
      toast('Registration successful! Please check your email or log in directly.', 'success')
      router.push('/login')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Registration failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle(role)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Google Auth failed.', 'error')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[440px] border border-marketing-border bg-marketing-bg-raised p-8">
      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm text-marketing-fg" htmlFor="fullname">Full name</label>
          <div className="relative">
            <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-marketing-muted-dim" />
            <input
              className={inputClass}
              id="fullname"
              placeholder="Your name"
              required
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="block text-sm text-marketing-fg" htmlFor="email">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-marketing-muted-dim" />
            <input
              className={inputClass}
              id="email"
              placeholder="example@gmail.com"
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="block text-sm text-marketing-fg" htmlFor="password">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-marketing-muted-dim" />
            <input
              className={inputClass}
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
              className={inputClass}
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
          {loading ? <Loader className="animate-spin" size={18} /> : 'Create account'}
          {!loading && <ArrowRight size={16} />}
        </button>

        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-grow bg-marketing-border" />
          <span className="font-marketing-mono text-xs uppercase tracking-wider text-marketing-muted-dim">Or</span>
          <div className="h-px flex-grow bg-marketing-border" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-3 border border-marketing-border px-6 py-3 text-sm text-marketing-fg transition-colors hover:border-marketing-accent disabled:opacity-50"
          type="button"
        >
          {googleLoading ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
          )}
          Continue with Google
        </button>
      </form>
    </div>
  )
}
