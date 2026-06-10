'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast('Please enter both email and password.', 'warning')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast('Logged in successfully.', 'success')

      // Check role to redirect to correct dashboard
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      const role = profile?.role || 'client'
      router.push(`/dashboard/${role}`)
      router.refresh()
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
      const redirectTo = `${window.location.origin}/auth/callback`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      })
      if (error) throw error
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Google Sign In failed.', 'error')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex antialiased overflow-hidden">
      {/* Left Split: Visual Canvas */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-margin-desktop bg-surface-container-lowest">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        
        <header className="relative z-10 flex items-center gap-3">
          <img src="/weblogo.svg" alt="KaiketsuTech Logo" className="h-12 w-auto" />
        </header>

        <div className="relative z-10 max-w-xl pb-12">
          <div className="font-section-label text-section-label text-primary mb-stack-md uppercase tracking-widest">Enterprise Access</div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-md leading-tight">
            Solve.<br/>
            Design.<br/>
            <span className="text-primary-container">Elevate.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
            Precision engineering for modern enterprises. Sign in to access your high-performance workspace and bespoke solutions.
          </p>
        </div>
      </div>

      {/* Right Split: Login Canvas */}
      <div className="w-full lg:w-[45%] h-full min-h-screen overflow-y-auto flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-surface-container-lowest relative z-20">
        <div className="w-full max-w-[440px] glass-panel rounded-lg p-8 shadow-2xl relative">
          <div className="mb-stack-lg">
            <h2 className="font-headline-xl text-2xl md:text-3xl text-on-surface mb-2 font-bold">Sign In</h2>
            <p className="font-body-md text-sm text-on-surface-variant">Enter your credentials to continue to the platform.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="font-label-md text-sm text-on-surface flex items-center gap-2" htmlFor="email">
                <Mail size={18} className="text-on-surface-variant" />
                Work Email
              </label>
              <input 
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-lg text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                id="email" 
                type="email" 
                placeholder="you@company.com" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-sm text-on-surface flex items-center gap-2" htmlFor="password">
                  <Lock size={18} className="text-on-surface-variant" />
                  Password
                </label>
                <Link 
                  className="font-label-md text-xs text-primary hover:text-primary-container transition-colors" 
                  href="/auth/reset-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <input 
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-lg text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {/* Primary Action */}
            <button 
              className="w-full bg-primary-container hover:bg-[#d8600d] text-white font-label-md text-sm py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] cursor-pointer disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" size={18} /> : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 mb-6 flex items-center">
            <div className="flex-grow border-t border-outline-variant/50"></div>
            <span className="mx-4 font-mono-sm text-xs text-on-surface-variant uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-outline-variant/50"></div>
          </div>

          {/* Google Sign In */}
          <button 
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full bg-surface hover:bg-surface-container-high border border-outline-variant text-on-surface font-label-md text-sm py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            type="button"
          >
            {googleLoading ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.72 17.58V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"></path>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.58C14.74 18.24 13.48 18.66 12 18.66C9.14 18.66 6.71 16.73 5.84 14.14H2.17V16.99C3.99 20.59 7.69 23 12 23Z" fill="#34A853"></path>
                <path d="M5.84 14.14C5.62 13.48 5.49 12.76 5.49 12C5.49 11.24 5.62 10.52 5.84 9.86V7.01H2.17C1.42 8.5 1 10.2 1 12C1 13.8 1.42 15.5 2.17 16.99L5.84 14.14Z" fill="#FBBC05"></path>
                <path d="M12 5.34C13.62 5.34 15.07 5.9 16.21 6.99L19.36 3.84C17.46 2.06 14.97 1 12 1C7.69 1 3.99 3.41 2.17 7.01L5.84 9.86C6.71 7.27 9.14 5.34 12 5.34Z" fill="#EA4335"></path>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Bottom Link */}
          <p className="mt-8 text-center font-body-md text-sm text-on-surface-variant">
            Don't have an account? 
            <Link className="font-label-md text-sm text-primary hover:text-primary-container transition-colors ml-1 underline" href="/auth/signup">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
