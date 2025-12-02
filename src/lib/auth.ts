// src/lib/auth.ts
import { supabase } from "@/lib/supabase";
import { disableGuest } from "@/lib/guest";

export async function signOut() {
  // očisti guest state (ako ga ima)
  try {
    disableGuest();
  } catch (err) {
    console.error("[signOut] disableGuest error:", err);
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[signOut] Supabase signOut error:", error.message);
    }
  } catch (err) {
    console.error("[signOut] Supabase signOut exception:", err);
  }
}

export async function signOutTo(path = "/welcome") {
  await signOut();

  if (typeof window !== "undefined") {
    // hard redirect (stabilnije u PWA i posle auth promene)
    window.location.href = path;
  } else {
    console.warn("[signOutTo] window is undefined, cannot redirect to:", path);
  }
}
