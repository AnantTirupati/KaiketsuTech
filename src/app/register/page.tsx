import SignUpForm from '@/components/auth/SignUpForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="bg-[#0B0B0B] text-on-surface antialiased min-h-[calc(100vh-80px)] flex items-center justify-center font-body-md relative overflow-hidden pt-24 pb-16">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center">
        <div className="w-[800px] h-[800px] bg-primary-container/5 rounded-full blur-[120px] absolute opacity-50"></div>
      </div>

      {/* Main Content Container */}
      <main className="w-full max-w-[480px] px-margin-mobile md:px-0 z-10 relative">
        <div className="text-center mb-stack-lg">
          <h2 className="font-headline-xl text-2xl md:text-3xl text-on-surface mb-2 font-bold">Create Account</h2>
          <p className="font-body-md text-sm text-on-surface-variant">Create an account to continue to the platform.</p>
        </div>

        <SignUpForm />
      </main>
    </div>
  )
}
