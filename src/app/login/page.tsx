import type { Metadata } from 'next'
import AuthShell from '@/components/marketing/AuthShell'
import SignInForm from '@/components/auth/SignInForm'

export const metadata: Metadata = {
  title: 'Sign in',
}

export default function LoginPage() {
  return (
    <AuthShell eyebrow="Enterprise access">
      <SignInForm />
    </AuthShell>
  )
}
