import { supabase } from '@/lib/supabase'
import type { Company } from '@/features/results/api'

export type CompanyWithStats = Company & {
  // proširi po potrebi (npr. images, description…)
}

export async function fetchCompanyById(id: string): Promise<CompanyWithStats | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return (data as CompanyWithStats) ?? null
}
