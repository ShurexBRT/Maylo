import { supabase } from '@/lib/supabase'

export type CreateReviewInput = {
  company_id: string
  rating: number
  comment?: string
  visit_date?: string | null
}

export async function createReview(input: CreateReviewInput) {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth?.user) throw new Error('Not authenticated')

  const { error: e1 } = await supabase.from('reviews').insert({
    company_id: input.company_id,
    user_id: auth.user.id,
    rating: input.rating,
    comment: input.comment ?? null,
    visit_date: input.visit_date ?? null,
  })
  if (e1) throw e1

  const { data: all, error: e2 } = await supabase
    .from('reviews')
    .select('rating')
    .eq('company_id', input.company_id)
  if (e2) throw e2

  const ratings = (all ?? []).map((r: any) => Number(r.rating) || 0)
  const count = ratings.length
  const avg = count ? ratings.reduce((a, b) => a + b, 0) / count : 0

  const { error: e3 } = await supabase
    .from('companies')
    .update({ rating_avg: avg, rating_count: count })
    .eq('id', input.company_id)
  if (e3) throw e3

  return { ok: true }
}
