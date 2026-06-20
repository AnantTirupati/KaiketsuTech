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
      await resetPasswordForEmail(email)
      toast('Password reset link sent! Please check your email inbox.', 'success')
      setEmail('')
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Failed to send reset link.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg p-8 shadow-2xl relative overflow-hidden w-full max-w-md">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-50"></div>
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-headline-lg text-xl md:text-2xl text-on-surface mb-2 font-bold">Reset Your Password</h2>
        <p className="font-body-md text-sm text-on-surface-variant">Enter your email to receive a secure reset link.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleReset} className="space-y-6">
        <div>
          <label className="block font-label-md text-sm text-on-surface-variant mb-2" htmlFor="email">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
              <Mail size={18} />
            </div>
            <input 
              className="block w-full pl-10 pr-3 py-3 bg-[#0B0B0B] border border-[#222222] rounded text-on-surface font-body-md text-sm focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all duration-200 outline-none placeholder-on-surface-variant/50"
              id="email" 
              placeholder="hello@kaiketsutech.online" 
              required 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button 
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded bg-primary-container text-white font-label-md text-sm uppercase tracking-wider hover:bg-opacity-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" size={18} /> : 'Send Reset Link'}
          </button>
        </div>
      </form>

      {/* Footer / Back Link */}
      <div className="mt-8 text-center">
        <Link className="inline-flex items-center font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors group" href="/login">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Return to Login
        </Link>
      </div>
    </div>
  )
}
