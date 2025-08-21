// src/features/reviews/WriteReviewPage.tsx
import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import StarRatingInput from '@/components/StarRatingInput'
import { useUI } from '@/lib/store'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateReview } from './useCreateReview'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const schema = z.object({
  rating: z.number().min(1, 'Please select rating').max(5),
  comment: z.string().max(2000).optional(),
  visit_date: z.string().optional(), // ISO yyyy-mm-dd
})

type FormValues = z.infer<typeof schema>

export default function WriteReviewPage() {
  const nav = useNavigate()
  const { id } = useParams<{ id: string }>() // company id iz rute
  const { drawerOpen, setDrawer } = useUI()
  const create = useCreateReview()

  // Guard: ako nije ulogovan → login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        nav('/login')
      }
    })
  }, [nav])

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, comment: '', visit_date: '' },
  })

  const rating = watch('rating')

  const onSubmit = async (values: FormValues) => {
    if (!id) return
    try {
      await create.mutateAsync({
        company_id: id,
        rating: values.rating,
        comment: values.comment,
        visit_date: values.visit_date || null,
      })
      // nakon uspeha — nazad na profil firme
      nav(`/profile/${id}`)
    } catch (err) {
      console.error(err)
      alert('Failed to submit review. Please try again.')
    }
  }

  return (
    <div onClick={() => drawerOpen && setDrawer(false)}>
      <Header />
      <Drawer />

      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-2">Write a review</h1>
        <p className="text-slate-600 mb-6">
          Share your experience to help others choose better.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <StarRatingInput
              value={rating}
              onChange={(n) => setValue('rating', n, { shouldValidate: true })}
            />
            {errors.rating && <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-1">Comment (optional)</label>
            <textarea
              className="w-full h-32 border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What did you like? What could be improved?"
              onChange={(e) => setValue('comment', e.target.value)}
            />
            {errors.comment && <p className="text-red-600 text-sm mt-1">{errors.comment.message}</p>}
          </div>

          {/* Visit date */}
          <div>
            <label className="block text-sm font-medium mb-1">Visit date (optional)</label>
            <input
              type="date"
              className="border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setValue('visit_date', e.target.value)}
            />
            {errors.visit_date && <p className="text-red-600 text-sm mt-1">{errors.visit_date.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || create.isPending}
              className="btn-primary disabled:opacity-60"
            >
              {create.isPending ? 'Submitting…' : 'Submit review'}
            </button>
            <Link to={id ? `/profile/${id}` : '/'} className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  )
}
