// src/features/providers/api.ts
import { supabase } from "@/lib/supabase";

export type Company = {
  id: string;
  name: string;
  category: string;
  country: string;
  city: string;
  address: string | null;
  email: string;
  phone: string | null;
  languages: string[];         // << VAŽNO: niz stringova
  owner_user_id: string;
  created_at: string;
  updated_at: string | null;
};

export type CompanyUpsertInput = {
  id?: string;                 // ako postoji -> edit, ako ne -> create
  name: string;
  category: string;
  country: string;
  city: string;
  address?: string | null;
  email: string;
  phone?: string | null;
  languages: string[];         // << ovde takođe niz
};

export async function upsertCompany(input: CompanyUpsertInput) {
  // osiguramo da uvek šaljemo niz (pa makar i prazan)
  const languages = Array.isArray(input.languages)
    ? input.languages
    : (input.languages ? [String(input.languages)] : []);

  const payload = {
    id: input.id ?? undefined,
    name: input.name.trim(),
    category: input.category.trim(),
    country: input.country.trim(),
    city: input.city.trim(),
    address: input.address?.trim() || null,
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    languages,                     // << JS niz, Supabase ga lepo mapira u text[]
  };

  const { data, error } = await supabase
    .from("companies")
    .upsert(payload, { onConflict: "id" })
    .select("id")
    .single();

  if (error) {
    console.error("[upsertCompany] error:", error.message);
    throw error;
  }

  return data as { id: string };
}

// helper za edit stranicu – uzmi firmu gde je owner_user_id = current user
export async function getMyCompany() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null;

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[getMyCompany] error:", error.message);
    throw error;
  }

  return (data as Company) ?? null;
}
