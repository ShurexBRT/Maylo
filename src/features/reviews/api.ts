import { supabase } from '@/lib/supabase'

export async function createReview(input: {
  company_id: string; rating: number; comment?: string; visit_date?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('reviews').insert({
    company_id: input.company_id,
    user_id: user.id,
    rating: input.rating,
    comment: input.comment ?? null,
    visit_date: input.visit_date ?? null
  })
  if (error) throw error

  // Recalculate aggregate (simple serverless alternative is Supabase function/trigger)
  const { data: stats, error: e2 } = await supabase
    .from('reviews')
    .select('rating', { count: 'exact' })
    .eq('company_id', input.company_id)

  if (!e2 && stats) {
    const ratings = stats.map((r: any) => r.rating)
    const avg = ratings.reduce((a: number, b: number) => a + b, 0) / (ratings.length || 1)
    await supabase.from('companies').update({
      rating_avg: avg, rating_count: ratings.length
    }).eq('id', input.company_id)
  }
}
