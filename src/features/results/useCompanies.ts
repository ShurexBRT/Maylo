// src/features/results/useCompanies.ts
import {
  useInfiniteQuery,
  type InfiniteData,
} from "@tanstack/react-query";

import {
  fetchCompanies,
  type CompaniesFilters,
  type CompaniesPage,
} from "./api";

export function useCompanies(
  filters: Omit<CompaniesFilters, "page" | "pageSize">
) {
  return useInfiniteQuery<
    CompaniesPage,
    Error,
    InfiniteData<CompaniesPage>,
    [string, typeof filters],
    number
  >({
    queryKey: ["companies", filters],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchCompanies({
        ...filters,
        page: pageParam,
        pageSize: 20,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.nextPage ?? undefined,

    staleTime: 60_000,
refetchOnWindowFocus: false,

  });
}
