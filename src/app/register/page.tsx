import type { Metadata } from 'next'
import AuthShell from '@/components/marketing/AuthShell'
import SignUpForm from '@/components/auth/SignUpForm'

export const metadata: Metadata = {
  title: 'Create account',
}

export default function RegisterPage() {
  return (
    <AuthShell eyebrow="Create an account to continue">
      <SignUpForm />
    </AuthShell>
  )
}
