// src/features/results/ResultsPage.tsx
import { useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useCompanies } from "./useCompanies";
import { useFavorites, useFavoriteIds } from "@/features/saved/useFavorites";
import type { Company, CompaniesPage } from "./api";

export default function ResultsPage() {
  const nav = useNavigate();

  const [params] = useSearchParams();
  const branch = params.get("branch") || "";
  const country = params.get("country") || "";
  const city = params.get("city") || "";

  // Companies (infinite)
  const q = useCompanies({ branch, country, city });

  const items: Company[] = useMemo(
    () => q.data?.pages.flatMap((p: CompaniesPage) => p.items) ?? [],
    [q.data]
  );

  // Favorites
  const { toggle } = useFavorites();
  const favoriteIds = useFavoriteIds();

  // infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          q.hasNextPage &&
          !q.isFetchingNextPage
        ) {
          q.fetchNextPage();
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [q.hasNextPage, q.isFetchingNextPage, q.fetchNextPage]);

  const openProfile = (id: string) => nav(`/profile/${id}`);
  const onCardClick = (id: string) => () => openProfile(id);
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const onToggleFav = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await toggle(id);
    } catch (err) {
      const message = (err as Error)?.message || "";
      if (message.includes("Not authenticated")) {
        nav("/login");
      } else {
        console.error(err);
      }
    }
  };

  return (
    <main className="mx-auto max-w-5xl p-4">
      {q.isLoading && (
        <div className="py-12 text-center">Loading…</div>
      )}

      {q.isError && (
        <div className="py-12 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            Something went wrong
          </h2>
          <p className="text-slate-600">Please try again.</p>
        </div>
      )}

      {!q.isLoading && !q.isError && items.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-7xl">🤖</div>
          <h2 className="mb-1 text-xl font-semibold">
            No results found
          </h2>
          <p className="mb-4 text-slate-600">Try changing filters</p>
          <Link to="/" className="btn-primary">
            Reset filters
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((c) => {
            const liked = favoriteIds.has(c.id);

            return (
              <article
                key={c.id}
                className="card cursor-pointer overflow-hidden"
                onClick={onCardClick(c.id)}
              >
                <div className="mx-4 mb-3 mt-4">
                  <div className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50" />
                </div>

                <div className="px-4 pb-4">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-base font-semibold">
                      {c.name}
                    </h3>

                    <button
                      aria-label={
                        liked
                          ? "Remove from favorites"
                          : "Save to favorites"
                      }
                      onClick={(e) => onToggleFav(e, c.id)}
                      className={`transition-transform hover:scale-110 ${
                        liked ? "text-red-500" : "text-slate-400"
                      }`}
                      title={
                        liked
                          ? "Remove from favorites"
                          : "Save to favorites"
                      }
                    >
                      ♥
                    </button>
                  </div>

                  <div className="mb-2 text-sm text-slate-600">
                    {c.category}
                    {Array.isArray(c.languages) &&
                    c.languages.length > 0
                      ? ` · ${c.languages.join(", ")}`
                      : null}
                  </div>

                  {Array.isArray(c.languages) &&
                    c.languages.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {c.languages.map((l) => (
                          <span key={l} className="pill">
                            {l}
                          </span>
                        ))}
                      </div>
                    )}

                  <div className="mb-3 flex items-center gap-2 text-slate-700">
                    <span>📍</span>
                    <span>
                      {c.address ? `${c.address}, ` : ""}
                      {c.city}
                      {c.country ? `, ${c.country}` : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={stop}
                      aria-label="Call"
                      className="transition-transform text-blue-600 hover:scale-110"
                    >
                      📞
                    </button>
                    <button
                      onClick={stop}
                      aria-label="Email"
                      className="transition-transform text-blue-600 hover:scale-110"
                    >
                      ✉️
                    </button>
                    <button
                      onClick={stop}
                      aria-label="Open in maps"
                      className="transition-transform text-blue-600 hover:scale-110"
                    >
                      🗺️
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div ref={sentinelRef} className="h-12" />
      {q.isFetchingNextPage && items.length > 0 && (
        <div className="py-6 text-center text-slate-600">
          Loading more…
        </div>
      )}
    </main>
  );
}
