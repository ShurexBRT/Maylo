import { supabase } from '@/lib/supabase'

export async function toggleFavorite(companyId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: existing } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .eq('company_id', companyId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase.from('favorites').delete()
      .eq('user_id', user.id).eq('company_id', companyId)
    if (error) throw error
    return { liked: false }
  } else {
    const { error } = await supabase.from('favorites').insert({ user_id: user.id, company_id: companyId })
    if (error) throw error
    return { liked: true }
  }
}

export async function fetchFavorites() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('favorites')
    .select('company_id, companies(*)')
    .eq('user_id', user.id)

  if (error) throw error
  return data?.map(row => row.companies) ?? []
}
