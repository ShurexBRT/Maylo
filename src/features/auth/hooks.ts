import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  signupEmail, loginEmail, loginOAuth, logout,
  sendPasswordReset, updatePassword, getCurrentUser,
  type SignupInput
} from './api'

export function useAuthUser() {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: getCurrentUser,
    staleTime: 60_000,
  })
}

export function useSignup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SignupInput) => signupEmail(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['authUser'] }),
  })
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginEmail(email, password),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['authUser'] }),
  })
}

export function useOAuth() {
  return useMutation({
    mutationFn: (provider: 'google' | 'apple' | 'facebook') => loginOAuth(provider),
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      qc.removeQueries({ queryKey: ['authUser'] })
      qc.invalidateQueries()
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => sendPasswordReset(email),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (newPassword: string) => updatePassword(newPassword),
  })
}
