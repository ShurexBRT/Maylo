// src/features/reviews/WriteReviewPage.tsx
import { useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useCreateReview } from './hooks'
import { supabase } from '@/lib/supabase'
import '@/styles/globals.css'

function Stars({ value, onPick }: { value: number; onPick: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPick(n)}
          className="text-2xl leading-none"
          aria-label={`Rate ${n}`}
        >
          <span className={n <= value ? 'text-amber-400' : 'text-gray-300'}>★</span>
        </button>
      ))}
    </div>
  )
}

export default function WriteReviewPage() {
  const { id } = useParams()
  const companyId = id ?? ''
  const nav = useNavigate()
  const create = useCreateReview()

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(() => companyId && rating >= 1 && rating <= 5, [companyId, rating])

  async function onSubmit() {
    setError(null)

    // guard: mora user
    const { data } = await supabase.auth.getUser()
    if (!data?.user) {
      nav(`/login?next=/reviews/write/${companyId}`)
      return
    }

    if (!canSubmit) {
      setError('Pick a rating (1–5).')
      return
    }

    try {
      await create.mutateAsync({
        company_id: companyId,
        rating,
        comment: comment.trim() ? comment.trim() : undefined,
      })
      nav(`/profile/${companyId}`, { replace: true })
    } catch (e: any) {
      setError(e?.message ?? 'Failed to submit review.')
    }
  }

  if (!companyId) {
    return (
      <main className="max-w-xl mx-auto p-6">
        <div className="card p-4">Missing company id.</div>
      </main>
    )
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Write a review</h1>

      <div className="bg-white rounded-xl border shadow-sm p-5">
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-2">Your rating</p>
          <Stars value={rating} onPick={setRating} />
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">Your review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className="w-full resize-y rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="Share a few details about your experience…"
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold px-4 py-2 hover:bg-blue-700 transition disabled:opacity-60"
            disabled={create.isPending}
            onClick={onSubmit}
          >
            {create.isPending ? 'Submitting…' : 'Submit'}
          </button>

          <Link
            to={`/profile/${companyId}`}
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </div>
    </main>
  )
}
