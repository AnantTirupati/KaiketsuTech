'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react'
import { signInWithEmail, signInWithGoogle } from '@/lib/auth'
import { useToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase/client'

const inputClass =
  'w-full border border-marketing-border bg-marketing-bg px-4 py-3 text-sm text-marketing-fg placeholder:text-marketing-muted-dim/50 focus:border-marketing-accent focus:outline-none'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast('Please enter both email and password.', 'warning')
      return
    }

    setLoading(true)

    try {
      const data = await signInWithEmail(email, password)
      toast('Logged in successfully.', 'success')

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      const role = profile?.role || 'client'
      router.push(`/dashboard/${role}`)
      router.refresh()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Invalid email or password.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle('client')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Google Sign In failed.', 'error')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[440px] border border-marketing-border bg-marketing-bg-raised p-8">
      <div className="mb-8">
        <h2 className="mb-2 font-marketing-sans text-2xl font-bold text-marketing-fg">Sign in</h2>
        <p className="text-sm text-marketing-muted">Enter your credentials to continue to the platform.</p>
      </div>

      <form onSubmit={handleSignIn} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-marketing-fg" htmlFor="email">
            <Mail size={16} className="text-marketing-muted-dim" />
            Work email
          </label>
          <input
            className={inputClass}
            id="email"
            type="email"
            placeholder="example@gmail.com"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-marketing-fg" htmlFor="password">
              <Lock size={16} className="text-marketing-muted-dim" />
              Password
            </label>
            <Link className="font-marketing-mono text-xs text-marketing-accent hover:underline" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <input
            className={inputClass}
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 bg-marketing-accent px-6 py-3 text-sm font-semibold text-marketing-accent-ink transition-colors hover:bg-marketing-fg disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin" size={18} /> : 'Sign in'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
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
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.72 17.58V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"></path>
            <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.58C14.74 18.24 13.48 18.66 12 18.66C9.14 18.66 6.71 16.73 5.84 14.14H2.17V16.99C3.99 20.59 7.69 23 12 23Z" fill="#34A853"></path>
            <path d="M5.84 14.14C5.62 13.48 5.49 12.76 5.49 12C5.49 11.24 5.62 10.52 5.84 9.86V7.01H2.17C1.42 8.5 1 10.2 1 12C1 13.8 1.42 15.5 2.17 16.99L5.84 14.14Z" fill="#FBBC05"></path>
            <path d="M12 5.34C13.62 5.34 15.07 5.9 16.21 6.99L19.36 3.84C17.46 2.06 14.97 1 12 1C7.69 1 3.99 3.41 2.17 7.01L5.84 9.86C6.71 7.27 9.14 5.34 12 5.34Z" fill="#EA4335"></path>
          </svg>
        )}
        Continue with Google
      </button>

      <p className="mt-8 text-center text-sm text-marketing-muted">
        Don&rsquo;t have an account?{' '}
        <Link className="text-marketing-accent hover:underline" href="/register">
          Create account
        </Link>
      </p>
    </div>
  )
}
