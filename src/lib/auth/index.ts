import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  role: 'client' | 'intern'
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  })
  if (error) throw error
  return data
}

export async function signInWithGoogle(role: 'client' | 'intern' = 'client') {
  const redirectTo = `${window.location.origin}/auth/callback?role=${role}`
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  })
  if (error) throw error
}

export async function resetPasswordForEmail(email: string) {
  const redirectTo = `${window.location.origin}/auth/update-password`
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })
  if (error) throw error
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
