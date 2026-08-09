import type { Metadata } from 'next'
import AuthShell from '@/components/marketing/AuthShell'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset password',
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ResetPasswordForm />
    </AuthShell>
  )
}
