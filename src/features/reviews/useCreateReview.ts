import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createReview } from './api'
import type { CreateReviewInput } from './api'

export function useCreateReview() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateReviewInput) => createReview(payload),

    onSuccess: (_res, vars) => {
      // refresh pojedinačne firme
      qc.invalidateQueries({ queryKey: ['company', vars.company_id] })

      // refresh infinite lista (results page)
      qc.invalidateQueries({ queryKey: ['companies'] })

      // refresh reviews ako postoji posebna queryKey
      qc.invalidateQueries({ queryKey: ['reviews', vars.company_id] })
    },
  })
}
