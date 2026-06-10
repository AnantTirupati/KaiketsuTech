import SignUpForm from '@/components/auth/SignUpForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="bg-[#0B0B0B] text-on-surface antialiased min-h-screen flex items-center justify-center font-body-md relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center">
        <div className="w-[800px] h-[800px] bg-primary-container/5 rounded-full blur-[120px] absolute opacity-50"></div>
      </div>

      {/* Main Content Container */}
      <main className="w-full max-w-[480px] px-margin-mobile md:px-0 z-10 relative py-12">
        <div className="text-center mb-stack-lg">
          <Link href="/" className="mb-stack-sm hover:opacity-90 inline-block">
            <img src="/weblogo.svg" alt="KaiketsuTech Logo" className="h-12 w-auto mx-auto" />
          </Link>
          <p className="font-body-md text-sm text-on-surface-variant">Create an account to continue</p>
        </div>

        <SignUpForm />
      </main>
    </div>
  )
}
