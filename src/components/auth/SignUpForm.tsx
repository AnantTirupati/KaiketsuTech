'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User as UserIcon, Mail, Lock, ArrowRight, Loader } from 'lucide-react'
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth'
import { useToast } from '@/components/ui/Toast'

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
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Google Auth failed.', 'error')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[440px] glass-panel rounded-lg p-8 shadow-2xl relative">
      <form onSubmit={handleSignUp} className="space-y-4">

        {/* Full Name */}
        <div className="space-y-1">
          <label className="block font-label-md text-sm text-on-surface" htmlFor="fullname">Full Name</label>
          <div className="relative">
            <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input 
              className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 pl-10 pr-4 font-body-md text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all outline-none"
              id="fullname" 
              placeholder="Jane Doe" 
              required 
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block font-label-md text-sm text-on-surface" htmlFor="email">Email Address</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input 
              className="w-full bg-[#0B0B0B] border border-[#222] rounded-lg py-3 pl-10 pr-4 font-body-md text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all outline-none"
              id="email" 
              placeholder="jane@example.com" 
              required 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block font-label-md text-sm text-on-surface" htmlFor="password">Password</label>
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

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="block font-label-md text-sm text-on-surface" htmlFor="confirm_password">Confirm Password</label>
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

        {/* Submit Button */}
        <button 
          className="w-full bg-primary-container text-white font-label-md text-sm py-3 rounded-lg hover:bg-opacity-95 transition-colors mt-6 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin" size={18} /> : 'Create Account'}
          <ArrowRight size={18} />
        </button>

        {/* Divider */}
        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-[#222]"></div>
          <span className="flex-shrink-0 mx-4 font-section-label text-[10px] text-on-surface-variant/60 uppercase">OR</span>
          <div className="flex-grow border-t border-[#222]"></div>
        </div>

        {/* Google Auth Button */}
        <button 
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full bg-[#111] border border-[#333] text-on-surface font-label-md text-sm py-3 rounded-lg hover:bg-[#1A1A1A] transition-colors flex justify-center items-center gap-3 cursor-pointer disabled:opacity-50"
          type="button"
        >
          {googleLoading ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
