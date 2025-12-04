// src/features/auth/api.ts
import { supabase } from "@/lib/supabase";

/* -------------------------------
   TYPES
-------------------------------- */
export type SignupInput = {
  email: string;
  password: string;
  full_name?: string;
  role?: "user" | "provider"; // upisujemo u user_metadata (trigger čita)
};

/* -------------------------------
   SIGN UP – password + metadata
-------------------------------- */
export async function signupEmail(input: SignupInput) {
  const email = input.email.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        full_name: input.full_name ?? "",
        role: input.role ?? "user",   // samo metadata — trigger kasnije kreira profil
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("[signupEmail] signUp error:", error.message);
    throw error;
  }

  // 🚫 Ne diramo profiles! Trigger to radi 100% server-side.

  return data;
}

/* -------------------------------
   LOGIN (email + password)
-------------------------------- */
export async function loginEmail(email: string, password: string) {
  const normalizedEmail = email.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    console.error("[loginEmail] error:", error.message);
    throw error;
  }

  return data;
}

/* -------------------------------
   SOCIAL LOGIN (Google / Apple / Facebook)
-------------------------------- */
export async function loginOAuth(
  provider: "google" | "apple" | "facebook"
) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("[loginOAuth] error:", error.message);
    throw error;
  }

  return data; // redirect se svakako desi
}

/* -------------------------------
   LOGOUT
-------------------------------- */
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[logout] error:", error.message);
    throw error;
  }
}

/* -------------------------------
   PASSWORD RESET – request email
-------------------------------- */
export async function sendPasswordReset(email: string) {
  const normalizedEmail = email.trim();

  const { data, error } = await supabase.auth.resetPasswordForEmail(
    normalizedEmail,
    {
      redirectTo: `${window.location.origin}/reset-password`,
    }
  );

  if (error) {
    console.error("[sendPasswordReset] error:", error.message);
    throw error;
  }

  return data;
}

/* -------------------------------
   PASSWORD UPDATE – after redirect
-------------------------------- */
export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("[updatePassword] error:", error.message);
    throw error;
  }

  return data;
}

/* -------------------------------
   CURRENT USER (client-side check)
-------------------------------- */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("[getCurrentUser] error:", error.message);
    return null;
  }

  return data.user ?? null;
}
