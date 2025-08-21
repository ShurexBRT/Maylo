import {
  useInfiniteQuery,
  type InfiniteData,
} from '@tanstack/react-query'
import {
  fetchCompanies,
  type CompaniesFilters,
  type CompaniesPage,
} from './api'

export function useCompanies(
  filters: Omit<CompaniesFilters, 'page' | 'pageSize'>
) {
  // v5: obavezno proslediti initialPageParam; tip rezultatnog data je InfiniteData<CompaniesPage>
  return useInfiniteQuery<
    CompaniesPage,                 // TQueryFnData
    Error,                         // TError
    InfiniteData<CompaniesPage>,   // TData (what useInfiniteQuery returns)
    [string, typeof filters],      // TQueryKey
    number                         // TPageParam
  >({
    queryKey: ['companies', filters],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchCompanies({ ...filters, page: pageParam, pageSize: 20 }),
    getNextPageParam: (lastPage) =>
      lastPage.nextPage ?? undefined, // undefined = no next page
  })
}
