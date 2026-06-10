import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-on-surface p-margin-mobile md:p-margin-desktop font-body-md bg-[#0B0B0B] pt-24 pb-16">
      <main className="w-full max-w-md relative z-10">
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
