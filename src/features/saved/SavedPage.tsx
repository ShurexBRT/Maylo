// src/features/saved/SavedPage.tsx

import { useNavigate, Link } from "react-router-dom";
import { useFavorites } from "./useFavorites";
import type { Company } from "@/features/results/api";

export default function SavedPage() {
  const nav = useNavigate();
  const { list, toggle } = useFavorites();

  const openProfile = (id: string) => nav(`/profile/${id}`);

  const onRemove = async (id: string) => {
    try {
      await toggle(id); // toggle će izbaciti iz liste
    } catch (err) {
      const msg = (err as Error)?.message || "";
      if (msg.includes("Not authenticated")) {
        nav("/login");
      } else {
        console.error(err);
      }
    }
  };

  const items = (list.data ?? []) as Company[];
  const isLoading = list.isLoading;
  const isError = list.isError;

  return (
    <main className="mx-auto max-w-3xl p-4">
      {isLoading && (
        <div className="py-12 text-center">Loading…</div>
      )}

      {isError && (
        <div className="py-12 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            Something went wrong
          </h2>
          <p className="text-slate-600">Please try again.</p>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-7xl">📥</div>
          <h2 className="mb-1 text-xl font-semibold">
            No saved services
          </h2>
          <p className="mb-4 text-slate-600">
            You haven&apos;t saved any services yet.
          </p>
          <Link to="/" className="btn-primary">
            Browse services
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-4">
          {items.map((c) => (
            <article key={c.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{c.name}</h3>
                  <div className="text-sm text-slate-600">
                    {c.category}
                    {Array.isArray(c.languages) &&
                    c.languages.length > 0
                      ? ` · ${c.languages.join(", ")}`
                      : ""}
                  </div>
                  <div className="mt-1 text-sm text-slate-700">
                    {c.address ? `${c.address}, ` : ""}
                    {c.city}
                    {c.country ? `, ${c.country}` : ""}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => openProfile(c.id)}
                  >
                    Details
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => onRemove(c.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
