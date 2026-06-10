import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-on-surface p-margin-mobile md:p-margin-desktop font-body-md bg-[#0B0B0B]">
      <main className="w-full max-w-md relative z-10">
        {/* Brand / Logo Area */}
        <div className="text-center mb-10">
          <Link href="/" className="hover:opacity-95 inline-block">
            <img src="/weblogo.svg" alt="KaiketsuTech Logo" className="h-12 w-auto mx-auto" />
          </Link>
        </div>

        <ResetPasswordForm />

        <div className="mt-12 text-center flex items-center justify-center space-x-4 opacity-40">
          <span className="w-12 h-[1px] bg-[#333333]"></span>
          <span className="font-mono-sm text-xs text-on-surface-variant uppercase tracking-widest">Secure Auth Connection</span>
          <span className="w-12 h-[1px] bg-[#333333]"></span>
        </div>
      </main>
    </div>
  )
}
