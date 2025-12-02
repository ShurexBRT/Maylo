// src/features/saved/api.ts
import { supabase } from "@/lib/supabase";
import type { Company } from "@/features/results/api";

type FavoriteSelectRaw = {
  user_id: string;
  company_id: string;
  created_at: string;
  company?: Company | Company[] | null;
};

export async function requireUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("[requireUser] auth error:", error.message);
  }

  if (!data?.user) {
    // Bitno: poruka "Not authenticated" se koristi u useFavorites retry logici
    throw new Error("Not authenticated");
  }

  return data.user;
}

export async function fetchFavorites(): Promise<Company[]> {
  const user = await requireUser();

  const { data, error } = await supabase
    .from("favorites")
    .select("user_id, company_id, created_at, company:companies(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchFavorites] error:", error.message);
    throw error;
  }

  const rows = (data ?? []) as FavoriteSelectRaw[];

  return rows
    .map((r) => {
      const c = Array.isArray(r.company)
        ? r.company[0]
        : r.company ?? null;
      return c;
    })
    .filter((c): c is Company => Boolean(c));
}

export async function toggleFavorite(
  companyId: string
): Promise<{ liked: boolean }> {
  const user = await requireUser();

  const { data: existing, error: e1 } = await supabase
    .from("favorites")
    .select("company_id")
    .eq("user_id", user.id)
    .eq("company_id", companyId)
    .maybeSingle();

  if (e1) {
    console.error("[toggleFavorite] select error:", e1.message);
    throw e1;
  }

  // već postoji → brišemo
  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("company_id", companyId);

    if (error) {
      console.error("[toggleFavorite] delete error:", error.message);
      throw error;
    }

    return { liked: false };
  }

  // ne postoji → ubacujemo
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, company_id: companyId });

  if (error) {
    console.error("[toggleFavorite] insert error:", error.message);
    throw error;
  }

  return { liked: true };
}
