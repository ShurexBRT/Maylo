// src/features/search/api.ts
import { supabase } from "@/lib/supabase";

export type Branch = string;
export type Country = string;
export type City = string;

export type PopularBranch = { name: string; count: number };

type CompanyRow = {
  category: string | null;
  country: string | null;
  city: string | null;
};

/** Distinct grane/branše iz companies (ili prepravi na posebnu tabelu ako je imaš) */
export async function fetchBranches(): Promise<Branch[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("category")
    .not("category", "is", null);

  if (error) throw error;

  const rows = (data ?? []) as CompanyRow[];

  const set = new Set<string>(
    rows.map((r) => String(r.category))
  );

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Distinct zemlje iz companies */
export async function fetchCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("country")
    .not("country", "is", null);

  if (error) throw error;

  const rows = (data ?? []) as CompanyRow[];

  const set = new Set<string>(
    rows.map((r) => String(r.country))
  );

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Distinct gradovi za izabranu zemlju */
export async function fetchCitiesByCountry(country: Country): Promise[City[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("city")
    .eq("country", country)
    .not("city", "is", null);

  if (error) throw error;

  const rows = (data ?? []) as CompanyRow[];

  const set = new Set<string>(
    rows.map((r) => String(r.city))
  );

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Vraća top N kategorija po broju firmi (jednostavna agregacija na klijentu). */
export async function fetchPopularBranches(limit = 6): Promise<PopularBranch[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("category")
    .not("category", "is", null);

  if (error) throw error;

  const rows = (data ?? []) as CompanyRow[];

  const counts = new Map<string, number>();

  for (const row of rows) {
    const key = String(row.category);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
