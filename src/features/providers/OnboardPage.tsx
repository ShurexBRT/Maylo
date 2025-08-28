// src/features/provider/OnboardPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

type FormState = {
  name: string
  category: string
  country: string
  city: string
  address?: string
  phone?: string
  email?: string
  languages: string
}

export default function OnboardPage() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  // auth + guard: dozvoli samo ulogovanom provideru bez postojećeg biznisa
  useEffect(() => {
    (async () => {
      setLoading(true)
      setError(null)
      const { data: auth } = await supabase.auth.getUser()
      const user = auth?.user
      if (!user) {
        nav('/login?next=/provider/onboard')
        return
      }

      // provera role
      const { data: profile, error: e1 } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (e1) { setError(e1.message); setLoading(false); return }

      if (!profile || (profile.role !== 'provider' && profile.role !== 'admin')) {
        setError('Only service providers can access onboarding.')
        setLoading(false)
        return
      }

      // da li već postoji kompanija
      const { data: existing, error: e2 } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_user_id', user.id)
        .maybeSingle()

      if (e2) { setError(e2.message); setLoading(false); return }

      if (existing?.id) {
        // već ima biznis → na edit profil firme (možeš promeniti rutu po želji)
        nav(`/profile/${existing.id}`)
        return
      }

      setLoading(false)
    })()
  }, [nav])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { data: auth } = await supabase.auth.getUser()
    const user = auth?.user
    if (!user) { nav('/login?next=/provider/onboard'); return }

    // minimalna validacija
    if (!form.name || !form.category || !form.country || !form.city) {
      setError('Please fill required fields.')
      return
    }

    // languages: CSV → string[]
    const langs = form.languages
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const { data, error } = await supabase.from('companies').insert({
      name: form.name,
      category: form.category,
      country: form.country,
      city: form.city,
      address: form.address || null,
      phone: form.phone || null,
      email: form.email || null,
      languages: langs,
      owner_user_id: user.id,
    }).select('id').maybeSingle()

    if (error) { setError(error.message); return }

    // nakon kreiranja → vodi na profil firme
    if (data?.id) nav(`/profile/${data.id}`)
  }

  if (loading) return <main className="max-w-xl mx-auto p-6">Loading…</main>

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add your business</h1>
      <p className="text-slate-600 mb-6">
        Unesi osnovne informacije. Polja označena * su obavezna. Detalje možeš kasnije menjati.
      </p>

      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium">Name *</label>
          <input className="field mt-1" value={form.name}
                 onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Category *</label>
          <input className="field mt-1" placeholder="frizer, elektrikар, translator…"
                 value={form.category}
                 onChange={e => setForm({ ...form, category: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Country *</label>
            <input className="field mt-1" value={form.country}
                   onChange={e => setForm({ ...form, country: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium">City *</label>
            <input className="field mt-1" value={form.city}
                   onChange={e => setForm({ ...form, city: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <input className="field mt-1" value={form.address}
                 onChange={e => setForm({ ...form, address: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input className="field mt-1" value={form.phone}
                   onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input className="field mt-1" type="email" value={form.email}
                   onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Languages (comma separated)</label>
          <input className="field mt-1" placeholder="sr, de, en"
                 value={form.languages}
                 onChange={e => setForm({ ...form, languages: e.target.value })} />
        </div>

        <div className="pt-2">
          <button type="submit" className="btn-primary w-full">Create business</button>
        </div>
      </form>
    </main>
  )
}
