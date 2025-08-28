import { useParams } from 'react-router-dom'
import { useState } from 'react'
import '@/styles/globals.css'

export default function WriteReviewPage() {
  const { id } = useParams()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  return (
    <section className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Write a review</h1>

      <div className="bg-white rounded-xl border shadow-sm p-5">
        {/* Zvezdice */}
        <div className="flex items-center gap-2 mb-4">
          {[1,2,3,4,5].map(n => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className="text-2xl"
              aria-label={`Rate ${n}`}
            >
              <span className={n <= rating ? 'text-amber-400' : 'text-gray-300'}>★</span>
            </button>
          ))}
        </div>

        {/* Komentar */}
        <label className="block text-sm font-medium text-gray-700 mb-1">Your review</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={5}
          className="w-full resize-y rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="Share a few details about your experience…"
        />

        {/* CTA */}
        <div className="mt-4 flex gap-3">
          <button
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold px-4 py-2 hover:bg-blue-700 transition"
            onClick={() => {/* submit logic */}}
          >
            Submit
          </button>
          <a href={`/profile/${id}`} className="inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-gray-50">
            Cancel
          </a>
        </div>
      </div>
    </section>
  )
}
