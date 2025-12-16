// src/features/reviews/hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createReview, fetchReviews, type CreateReviewInput } from './api'

export function useReviews(companyId?: string) {
  return useQuery({
    queryKey: ['reviews', companyId],
    queryFn: () => fetchReviews(companyId!),
    enabled: Boolean(companyId),
    staleTime: 30_000,
  })
}

export function useCreateReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateReviewInput) => createReview(payload),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ['company', vars.company_id] })
      qc.invalidateQueries({ queryKey: ['companies'] })
      qc.invalidateQueries({ queryKey: ['reviews', vars.company_id] })
    },
  })
}
