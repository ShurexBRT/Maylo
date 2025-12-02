// src/features/auth/api.ts
import { supabase } from "@/lib/supabase";

export type SignupInput = {
  email: string;
  password: string;
  full_name?: string;
  role?: "user" | "provider";
};

export async function signupEmail(input: SignupInput) {
  const email = input.email.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        full_name: input.full_name ?? "",
        // čuvamo i rolu u user_metadata ako postoji
        ...(input.role ? { role: input.role } : {}),
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("[signupEmail] signUp error:", error.message);
    throw error;
  }

  // nakon potvrde mejla, DB trigger handle_new_user pravi profil (role default 'user')
  // ako je env takav da je user odmah ulogovan (local dev / auto-confirm),
  // možemo ručno da ispeglamo rolu u profiles.
  if (input.role && data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: input.role })
      .eq("id", data.user.id);

    if (profileError) {
      console.error(
        "[signupEmail] update profile role error:",
        profileError.message
      );
      // ne bacamo dalje – signup je uspeo, samo role update nije
    }
  }

  return data;
}

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

  // redirect se dešava odmah, ali vraćamo data radi potpisanog tipa
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[logout] error:", error.message);
    throw error;
  }
}

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

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("[getCurrentUser] error:", error.message);
    return null;
  }

  return data.user ?? null;
}
