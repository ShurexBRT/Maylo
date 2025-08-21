import { supabase } from '@/lib/supabase'

export type SignupInput = {
  email: string
  password: string
  full_name?: string
  role?: 'user' | 'provider'
}

export async function signupEmail(input: SignupInput) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { full_name: input.full_name ?? '' }, // upiše se u raw_user_meta_data
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error

  // nakon potvrde mejla, naš trigger handle_new_user pravi profil (role default 'user')
  if (input.role && data.user) {
    // ako je odmah ulogovan (npr. local dev sa auto confirm), postavi rolu
    await supabase.from('profiles').update({ role: input.role }).eq('id', data.user.id)
  }

  return data
}

export async function loginEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function loginOAuth(provider: 'google' | 'apple' | 'facebook') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
  if (error) throw error
  return data // redirect se dešava odmah
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function sendPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
  return data
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  return data
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}
