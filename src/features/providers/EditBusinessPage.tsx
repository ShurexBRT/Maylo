// src/features/provider/EditBusinessPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import '@/styles/globals.css'

type FormState = {
  name: string
  category: string
  country: string
  city: string
  address: string
  phone: string
  email: string
  languages: string // comma separated u UI
}

const STEPS = [
  'Basic info',
  'Location',
  'Contact & languages',
  'Review & save',
] as const

const TOTAL_STEPS = STEPS.length

export default function EditBusinessPage() {
  const nav = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<FormState>({
    name: '',
    category: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    languages: '',
  })

  // ─────────────────────────────────────────────
  // Auth + guard + load company
  // ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    if (!id) {
      setError('Missing company id.')
      setLoading(false)
      return
    }

    ;(async () => {
      setLoading(true)
      setError(null)

      const { data: auth } = await supabase.auth.getUser()
      const user = auth?.user
      if (!user) {
        if (!cancelled) {
          nav('/login?next=/provider/edit/' + id, { replace: true })
        }
        return
      }

      // profile / role
      const { data: profile, error: e1 } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (e1 && !cancelled) {
        setError(e1.message)
        setLoading(false)
        return
      }

      const role = profile?.role ?? 'user'
      if (role !== 'provider' && role !== 'admin') {
        if (!cancelled) {
          setError('Only service providers can edit a business.')
          setLoading(false)
        }
        return
      }

      // učitaj kompaniju
      let query = supabase
        .from('companies')
        .select(
          'id, name, category, country, city, address, phone, email, languages, owner_user_id'
        )
        .eq('id', id)
        .limit(1)

      // provider može da edituje samo svoj biznis; admin bilo koji
      if (role !== 'admin') {
        query = query.eq('owner_user_id', user.id)
      }

      const { data: rows, error: e2 } = await query
      if (e2 && !cancelled) {
        setError(e2.message)
        setLoading(false)
        return
      }

      const company = rows?.[0]
      if (!company && !cancelled) {
        setError('Business not found or you do not have permission.')
        setLoading(false)
        return
      }

      if (!cancelled && company) {
        const langs = Array.isArray(company.languages)
          ? (company.languages as string[]).join(', ')
          : ''

        setForm({
          name: company.name ?? '',
          category: company.category ?? '',
          country: company.country ?? '',
          city: company.city ?? '',
          address: company.address ?? '',
          phone: company.phone ?? '',
          email: company.email ?? '',
          languages: langs,
        })
        setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id, nav])

  // ─────────────────────────────────────────────
  // Validacija po koraku
  // ─────────────────────────────────────────────
  function validateStep(s: number): string | null {
    if (s === 1) {
      if (!form.name.trim()) return 'Please enter your business name.'
      if (!form.category.trim()) return 'Please enter a category/branch.'
      return null
    }

    if (s === 2) {
      if (!form.country.trim()) return 'Country is required.'
      if (!form.city.trim()) return 'City is required.'
      return null
    }

    if (s === 3) {
      if (!form.languages.trim()) return 'Please add at least one language.'
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
        return 'Please enter a valid email or leave it empty.'
      }
      return null
    }

    if (s === 4) {
      if (!form.name.trim() || !form.category.trim() || !form.country.trim() || !form.city.trim()) {
        return 'Some required fields are missing. Please go back and check the steps.'
      }
      if (!form.languages.trim()) {
        return 'Please add at least one language.'
      }
      return null
    }

    return null
  }

  const canGoNext = useMemo(() => !validateStep(step), [step, form])

  // ─────────────────────────────────────────────
  // Update business
  // ─────────────────────────────────────────────
  async function updateBusiness() {
    if (!id) return
    setError(null)
    setSaving(true)

    const { data: auth } = await supabase.auth.getUser()
    const user = auth?.user
    if (!user) {
      nav('/login?next=/provider/edit/' + id, { replace: true })
      return
    }

    // role da odlučimo filter
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const role = profile?.role ?? 'user'

    const langs = form.languages
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    let query = supabase
      .from('companies')
      .update({
        name: form.name.trim(),
        category: form.category.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        address: form.address.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        languages: langs,
      })
      .eq('id', id)

    if (role !== 'admin') {
      query = query.eq('owner_user_id', user.id)
    }

    const { error } = await query

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    // posle sejva možeš ili na profil ili da ostaneš na edit-u
    nav(`/profile/${id}`, { replace: true })
  }

  // ─────────────────────────────────────────────
  // Wizard handlers
  // ─────────────────────────────────────────────
  const onNext = () => {
    const err = validateStep(step)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  }

  const onBack = () => {
    setError(null)
    setStep((s) => Math.max(1, s - 1))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < TOTAL_STEPS) {
      onNext()
      return
    }
    const err = validateStep(step)
    if (err) {
      setError(err)
      return
    }
    await updateBusiness()
  }

  // ─────────────────────────────────────────────
  // UI: stepper
  // ─────────────────────────────────────────────
  const Stepper = () => (
    <ol className="mb-6 flex items-center justify-between text-sm">
      {STEPS.map((label, index) => {
        const sIndex = index + 1
        const active = sIndex === step
        const done = sIndex < step
        return (
          <li key={label} className="flex-1 flex items-center gap-2">
            <div
              className={[
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold border',
                done
                  ? 'bg-blue-600 text-white border-blue-600'
                  : active
                  ? 'bg-blue-50 text-blue-700 border-blue-500'
                  : 'bg-slate-100 text-slate-500 border-slate-300',
              ].join(' ')}
            >
              {sIndex}
            </div>
            <span
              className={[
                'hidden sm:inline text-xs md:text-sm',
                done ? 'text-slate-700' : active ? 'text-slate-900' : 'text-slate-400',
              ].join(' ')}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )

  // ─────────────────────────────────────────────
  // UI: step content (isti kao Onboard, samo koristi form state)
  // ─────────────────────────────────────────────
  const StepBody = () => {
    if (step === 1) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-800">
              Business name <span className="text-red-500">*</span>
            </label>
            <input
              className="field mt-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Nova Hair Studio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800">
              Category / branch <span className="text-red-500">*</span>
            </label>
            <input
              className="field mt-1"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Hairdresser, Lawyer, Dentist…"
            />
            <p className="mt-1 text-xs text-slate-500">
              This is how users will find you in search (e.g. <em>frizer, advokat, lekar…</em>).
            </p>
          </div>
        </div>
      )
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-800">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                className="field mt-1"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="e.g. Germany"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800">
                City <span className="text-red-500">*</span>
              </label>
              <input
                className="field mt-1"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. Berlin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800">Address</label>
            <input
              className="field mt-1"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Street and number (optional)"
            />
          </div>
        </div>
      )
    }

    if (step === 3) {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-800">Contact email</label>
              <input
                className="field mt-1"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contact@yourbusiness.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800">Phone</label>
              <input
                className="field mt-1"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+49 123 456 789"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800">
              Languages you speak <span className="text-red-500">*</span>
            </label>
            <input
              className="field mt-1"
              value={form.languages}
              onChange={(e) => setForm({ ...form, languages: e.target.value })}
              placeholder="e.g. sr, en, de"
            />
            <p className="mt-1 text-xs text-slate-500">
              Separate with commas. This is what powers Maylo’s multilingual search.
            </p>
          </div>
        </div>
      )
    }

    // step 4 – review
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Review your business info and save changes. You can come back and update this anytime.
        </p>

        <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50/60">
          <div className="flex items-start justify-between gap-4 px-4 py-3">
            <dt className="text-sm font-medium text-slate-700">Business name</dt>
            <dd className="text-sm text-slate-900 text-right">{form.name || '—'}</dd>
          </div>

          <div className="flex items-start justify-between gap-4 px-4 py-3">
            <dt className="text-sm font-medium text-slate-700">Category</dt>
            <dd className="text-sm text-slate-900 text-right">{form.category || '—'}</dd>
          </div>

          <div className="flex items-start justify-between gap-4 px-4 py-3">
            <dt className="text-sm font-medium text-slate-700">Location</dt>
            <dd className="text-sm text-slate-900 text-right">
              {form.city || '—'}
              {form.city && form.country ? ', ' : ''}
              {form.country || ''}
              {form.address ? <div className="text-xs text-slate-600">{form.address}</div> : null}
            </dd>
          </div>

          <div className="flex items-start justify-between gap-4 px-4 py-3">
            <dt className="text-sm font-medium text-slate-700">Contact</dt>
            <dd className="text-sm text-slate-900 text-right space-y-1">
              <div>{form.email || '—'}</div>
              <div>{form.phone || '—'}</div>
            </dd>
          </div>

          <div className="flex items-start justify-between gap-4 px-4 py-3">
            <dt className="text-sm font-medium text-slate-700">Languages</dt>
            <dd className="text-sm text-slate-900 text-right">
              {form.languages
                ? form.languages
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .join(', ')
                : '—'}
            </dd>
          </div>
        </dl>
      </div>
    )
  }

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <main className="max-w-xl mx-auto px-4 py-8">
        <p className="text-slate-600">Loading your business…</p>
      </main>
    )
  }

  if (error && !form.name && !form.category) {
    return (
      <main className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-3">Edit your business</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Edit your business</h1>
      <p className="text-sm text-slate-600 mb-6">
        Update your business information so customers always see accurate details.
      </p>

      <Stepper />

      <form onSubmit={onSubmit} className="card p-5 space-y-5">
        <StepBody />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={step === 1 || saving}
            className={`btn-secondary ${step === 1 || saving ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            Back
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Step {step} of {TOTAL_STEPS}
            </span>
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={onNext}
                disabled={!!validateStep(step) || saving}
                className={`btn-primary ${
                  !!validateStep(step) || saving ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={saving}
                className={`btn-primary ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            )}
          </div>
        </div>
      </form>
    </main>
  )
}
