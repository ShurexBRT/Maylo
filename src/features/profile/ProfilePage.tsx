// src/features/profile/ProfilePage.tsx

import Rating from "@/components/Rating";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCompany } from "./useCompany";
import { useFavorites, useFavoriteIds } from "@/features/saved/useFavorites";

export default function ProfilePage() {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();

  const q = useCompany(id || null);

  const { toggle } = useFavorites();
  const favoriteIds = useFavoriteIds();

  const liked = q.data ? favoriteIds.has(q.data.id) : false;

  const onToggleFav = async () => {
    if (!id) return;
    try {
      await toggle(id);
    } catch (err) {
      const msg = (err as Error)?.message || "";
      if (msg.includes("Not authenticated")) {
        nav("/login");
      } else {
        console.error(err);
      }
    }
  };

  const onCall = () => {
    if (!q.data?.phone) return;
    window.location.href = `tel:${q.data.phone}`;
  };

  const onEmail = () => {
    if (!q.data?.email) return;
    window.location.href = `mailto:${q.data.email}`;
  };

  const onMaps = () => {
    if (!q.data) return;
    const address = [
      q.data.address,
      q.data.city,
      q.data.country,
    ]
      .filter(Boolean)
      .join(", ");
    if (!address) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    window.open(url, "_blank");
  };

  if (!id) {
    return (
      <main className="mx-auto max-w-4xl p-4">
        <div className="py-12 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            Missing company ID
          </h2>
          <Link to="/results" className="btn-primary">
            Back to results
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-4">
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

      {!q.isLoading && !q.isError && !q.data && (
        <div className="py-12 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            Company not found
          </h2>
          <Link to="/results" className="btn-primary">
            Back to results
          </Link>
        </div>
      )}

      {q.data && (
        <article className="card overflow-hidden">
          {/* Vizuel/placeholder */}
          <div className="p-4">
            <div className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50" />
          </div>

          {/* Header: ime + srce */}
          <div className="flex items-start justify-between gap-4 px-4">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold">
                {q.data.name}
              </h1>
              <div className="text-slate-600">
                {q.data.category}
              </div>
            </div>
            <button
              aria-label={
                liked ? "Remove from favorites" : "Save to favorites"
              }
              className={`text-2xl transition-transform hover:scale-110 ${
                liked ? "text-red-500" : "text-slate-400"
              }`}
              onClick={onToggleFav}
              title={
                liked ? "Remove from favorites" : "Save to favorites"
              }
            >
              ♥
            </button>
          </div>

          {/* Rating + jezici */}
          <div className="mt-2 px-4">
            <Rating
              value={q.data.rating_avg}
              count={q.data.rating_count ?? 0}
            />
            {Array.isArray(q.data.languages) &&
              q.data.languages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {q.data.languages.map((l) => (
                    <span key={l} className="pill">
                      {l}
                    </span>
                  ))}
                </div>
              )}
          </div>

          {/* Adresa */}
          <div className="mt-3 px-4 text-slate-700">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>
                {q.data.address ? `${q.data.address}, ` : ""}
                {q.data.city}
                {q.data.country ? `, ${q.data.country}` : ""}
              </span>
            </div>
          </div>

          {/* CTA dugmići + Write review */}
          <div className="flex flex-wrap items-center gap-4 px-4 py-4">
            <button
              onClick={onCall}
              className="text-blue-600 transition-transform hover:scale-110"
              aria-label="Call"
            >
              📞 Call
            </button>
            <button
              onClick={onEmail}
              className="text-blue-600 transition-transform hover:scale-110"
              aria-label="Email"
            >
              ✉️ Email
            </button>
            <button
              onClick={onMaps}
              className="text-blue-600 transition-transform hover:scale-110"
              aria-label="Open in maps"
            >
              🗺️ Open in maps
            </button>

            <div className="flex-1" />

            <Link
              to={`/write-review/${q.data.id}`}
              className="btn-primary"
            >
              Write a review
            </Link>
          </div>
        </article>
      )}
    </main>
  );
}
