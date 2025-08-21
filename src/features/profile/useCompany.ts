import { useQuery } from '@tanstack/react-query'
import { fetchCompanyById } from './api'

export function useCompany(id?: string) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => {
      if (!id) throw new Error('Missing company id')
      return fetchCompanyById(id)
    },
    enabled: !!id,
  })
}
