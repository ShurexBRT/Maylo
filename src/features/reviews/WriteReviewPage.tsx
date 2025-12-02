// src/features/reviews/WriteReviewPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useCreateReview } from "./useCreateReview";

export default function WriteReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const createReview = useCreateReview();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!id) {
    // ako je ruta pogrešna
    return (
      <section className="mx-auto max-w-xl p-4">
        <p className="text-center text-sm text-red-600">
          Missing company id.
        </p>
      </section>
    );
  }

  const onSubmit = async () => {
    setError(null);

    const trimmed = comment.trim();

    if (!rating) {
      setError("Please select a rating.");
      return;
    }
    if (trimmed.length < 10) {
      setError("Please write at least a few words about your experience.");
      return;
    }

    try {
      await createReview.mutateAsync({
        company_id: id,
        rating,
        comment: trimmed,
      });

      // posle uspeha – nazad na profil firme
      navigate(`/profile/${id}`);
    } catch (err) {
      console.error(err);
      setError("Could not submit review. Please try again.");
    }
  };

  const disabled = createReview.isPending;

  return (
    <section className="mx-auto max-w-xl p-4">
      <h1 className="mb-4 text-2xl font-bold text-blue-900">
        Write a review
      </h1>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        {/* Zvezdice */}
        <div className="mb-4 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="text-2xl"
              aria-label={`Rate ${n}`}
            >
              <span
                className={
                  n <= rating ? "text-amber-400" : "text-gray-300"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>

        {/* Komentar */}
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Your review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className="w-full resize-y rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="Share a few details about your experience…"
        />

        {error && (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        )}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onSubmit}
            disabled={disabled}
          >
            {disabled ? "Submitting…" : "Submit"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/profile/${id}`)}
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}
