import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createReview } from './api'
import type { CreateReviewInput } from './api'

export function useCreateReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateReviewInput) => createReview(payload),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ['company', vars.company_id] })
      qc.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}
