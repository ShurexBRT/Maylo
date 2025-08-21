import { supabase } from '@/lib/supabase'

export type Company = {
  id: string
  name: string
  category: string
  country: string
  city: string
  address?: string | null
  email?: string | null
  phone?: string | null
  languages?: string[] | null
  rating_avg?: number | null
  rating_count?: number | null
}

export type CompaniesPage = {
  items: Company[]
  count: number
  nextPage: number | null
}

export type CompaniesFilters = {
  branch?: string
  country?: string
  city?: string
  page?: number
  pageSize?: number
}

export async function fetchCompanies(
  { branch, country, city, page = 0, pageSize = 20 }: CompaniesFilters
): Promise<CompaniesPage> {
  // Tipizovan upit i paginacija
  let q = supabase
    .from('companies')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (branch)  q = q.eq('category', branch)
  if (country) q = q.eq('country', country)
  if (city)    q = q.eq('city', city)

  const from = page * pageSize
  const to   = from + pageSize - 1

  const { data, error, count } = await q.range(from, to)
  if (error) throw error

  const total = count ?? 0
  const hasMore = to + 1 < total
  return {
    items: (data ?? []) as Company[],
    count: total,
    nextPage: hasMore ? page + 1 : null,
  }
}
