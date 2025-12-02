// src/features/saved/useFavorites.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useMemo } from "react";

import { fetchFavorites, toggleFavorite } from "./api";
import type { Company } from "@/features/results/api";

export function useFavorites() {
  const qc = useQueryClient();

  // Lista omiljenih (Company[])
  const list: UseQueryResult<Company[], Error> = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    // Ako user nije ulogovan, nećemo spamovati greškama
    retry: (count, err) => {
      if (err instanceof Error && err.message.includes("Not authenticated")) {
        return false;
      }
      return count < 2;
    },
  });

  // Toggle sa optimističkim updatom
  const toggle = useMutation({
    mutationFn: (companyId: string) => toggleFavorite(companyId),
    onMutate: async (companyId: string) => {
      await qc.cancelQueries({ queryKey: ["favorites"] });

      const prev = qc.getQueryData<Company[]>(["favorites"]) ?? [];
      const exists = prev.some((c) => c.id === companyId);
      // Kad dodajemo, nemamo ceo Company objekat – oslanjamo se na invalidation posle
      const next = exists
        ? prev.filter((c) => c.id !== companyId)
        : prev;

      qc.setQueryData<Company[]>(["favorites"], next);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData<Company[]>(["favorites"], ctx.prev);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return { list, toggle: toggle.mutateAsync };
}

/** Helper: brza provera da li je ID u favoritima */
export function useFavoriteIds(): Set<string> {
  const { list } = useFavorites();

  const ids = useMemo(
    () => new Set((list.data ?? []).map((c) => c.id)),
    [list.data]
  );

  return ids;
}
