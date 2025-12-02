// src/features/auth/hooks.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";

import {
  signupEmail,
  loginEmail,
  loginOAuth,
  logout,
  sendPasswordReset,
  updatePassword,
  getCurrentUser,
  type SignupInput,
} from "./api";

/** Trenutni auth user (ili null ako nije ulogovan). */
export function useAuthUser() {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  }) as UseQueryResult<Awaited<ReturnType<typeof getCurrentUser>>, Error>;
}

/** Email + password signup (ako ga koristiš pored magic link flow-a). */
export function useSignup() {
  const qc = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof signupEmail>>,
    Error,
    SignupInput
  >({
    mutationFn: (payload) => signupEmail(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
}

/** Login sa email + password. */
export function useLogin() {
  const qc = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof loginEmail>>,
    Error,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }) => loginEmail(email, password),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
}

/** OAuth login (Google / Apple / Facebook). */
export function useOAuth() {
  return useMutation<
    Awaited<ReturnType<typeof loginOAuth>>,
    Error,
    "google" | "apple" | "facebook"
  >({
    mutationFn: (provider) => loginOAuth(provider),
  });
}

/** Logout + čišćenje auth cache-a. */
export function useLogout() {
  const qc = useQueryClient();

  return useMutation<Awaited<ReturnType<typeof logout>>, Error, void>({
    mutationFn: () => logout(),
    onSuccess: () => {
      // odmah srušimo authUser state
      qc.setQueryData(["authUser"], null);
      // i invalidiramo ostalo što zavisi od auth-a
      qc.invalidateQueries();
    },
  });
}

/** Slanje password reset maila. */
export function useForgotPassword() {
  return useMutation<
    Awaited<ReturnType<typeof sendPasswordReset>>,
    Error,
    string
  >({
    mutationFn: (email: string) => sendPasswordReset(email),
  });
}

/** Postavljanje nove lozinke nakon reset tokena. */
export function useResetPassword() {
  return useMutation<
    Awaited<ReturnType<typeof updatePassword>>,
    Error,
    string
  >({
    mutationFn: (newPassword: string) => updatePassword(newPassword),
  });
}
