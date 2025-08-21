import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import { fetchFavorites, toggleFavorite } from './api'
import type { Company } from '@/features/results/api'

export function useFavorites() {
  const qc = useQueryClient()

  // Lista omiljenih (Company[])
  const list: UseQueryResult<Company[], Error> = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
    // Ako user nije ulogovan, nećemo spamovati greškama
    retry: (count, err) => !(err instanceof Error && err.message.includes('Not authenticated')) && count < 2
  })

  // Toggle sa optimističkim updatom
  const toggle = useMutation({
    mutationFn: (companyId: string) => toggleFavorite(companyId),
    onMutate: async (companyId: string) => {
      await qc.cancelQueries({ queryKey: ['favorites'] })
      const prev = qc.getQueryData<Company[]>(['favorites']) || []
      const exists = prev.some((c) => c.id === companyId)
      const next = exists ? prev.filter((c) => c.id !== companyId) : prev // (insert ne znamo puni obj ovde)
      qc.setQueryData<Company[]>(['favorites'], next)
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['favorites'], ctx.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  return { list, toggle: toggle.mutateAsync }
}

/** Helper: brza provera da li je ID u favoritima */
export function useFavoriteIds(): Set<string> {
  const { list } = useFavorites()
  const ids = new Set((list.data ?? []).map((c) => c.id))
  return ids
}
