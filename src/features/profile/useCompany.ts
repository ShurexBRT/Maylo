// src/features/profile/useCompany.ts

import { useQuery } from "@tanstack/react-query";
import { fetchCompanyById } from "./api";
import type { Company } from "./api";

export function useCompany(id?: string | null) {
  return useQuery<Company | null, Error>({
    queryKey: ["company", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      return fetchCompanyById(id);
    },
  });
}
