import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchFavorites, toggleFavorite } from './api'

export function useFavorites() {
  const qc = useQueryClient()
  const list = useQuery({ queryKey: ['favorites'], queryFn: fetchFavorites })
  const mut = useMutation({
    mutationFn: toggleFavorite,
    onMutate: async (companyId) => {
      await qc.cancelQueries({ queryKey: ['favorites'] })
      const prev = qc.getQueryData<any[]>(['favorites']) || []
      const exists = prev?.some(c => c.id === companyId)
      const next = exists ? prev.filter(c => c.id !== companyId) : prev // optimistic
      qc.setQueryData(['favorites'], next)
      return { prev }
    },
    onError: (_err, _vars, ctx) => { if (ctx?.prev) qc.setQueryData(['favorites'], ctx.prev) },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['favorites'] }) }
  })
  return { list, toggle: mut.mutateAsync }
}
