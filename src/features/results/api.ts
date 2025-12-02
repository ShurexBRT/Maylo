// src/features/results/api.ts
import { supabase } from "@/lib/supabase";

export type Company = {
  id: string;
  name: string;
  category: string;
  country: string;
  city: string;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  languages?: string[] | null;
  rating_avg?: number | null;
  rating_count?: number | null;
  created_at?: string;
};

export type CompaniesPage = {
  items: Company[];
  count: number;
  nextPage: number | null;
};

export type CompaniesFilters = {
  branch?: string;
  country?: string;
  city?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchCompanies(
  { branch, country, city, page = 0, pageSize = 20 }: CompaniesFilters
): Promise<CompaniesPage> {
  // mala normalizacija filtara
  const normBranch = branch?.trim() || undefined;
  const normCountry = country?.trim() || undefined;
  const normCity = city?.trim() || undefined;

  let q = supabase
    .from("companies")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (normBranch) q = q.eq("category", normBranch);
  if (normCountry) q = q.eq("country", normCountry);
  if (normCity) q = q.eq("city", normCity);

  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await q.range(from, to);

  if (error) {
    console.error("[fetchCompanies] error:", error.message);
    throw error;
  }
  

  const total = count ?? 0;
  const hasMore = to + 1 < total;

  return {
    items: (data ?? []) as Company[],
    count: total,
    nextPage: hasMore ? page + 1 : null,
  };
}
