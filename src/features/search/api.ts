import { supabase } from '@/lib/supabase'

export type Branch = string
export type Country = string
export type City = string

/** Distinct grane/branše iz companies */
export async function fetchBranches(): Promise<Branch[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('category')
    .not('category', 'is', null)

  if (error) throw error

  const set = new Set<string>((data ?? []).map((r: any) => String(r.category)))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

/** Distinct zemlje iz companies */
export async function fetchCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('country')
    .not('country', 'is', null)

  if (error) throw error

  const set = new Set<string>((data ?? []).map((r: any) => String(r.country)))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

/** Distinct gradovi za izabranu zemlju */
export async function fetchCitiesByCountry(country: Country): Promise<City[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('city')
    .eq('country', country)
    .not('city', 'is', null)

  if (error) throw error

  const set = new Set<string>((data ?? []).map((r: any) => String(r.city)))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

export type PopularBranch = { name: string; count: number }

/** Top N kategorija po broju firmi (agregacija na klijentu). */
export async function fetchPopularBranches(limit = 6): Promise<PopularBranch[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('category')
    .not('category', 'is', null)

  if (error) throw error

  const counts = new Map<string, number>()
  for (const row of data ?? []) {
    const key = String((row as any).category)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
