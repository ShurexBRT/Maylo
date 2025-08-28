// src/features/auth/SignupPage.tsx
import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

type ProviderModalProps = {
  open: boolean
  onClose: () => void
  onAccept: () => void
}

function ProviderNoticeModal({ open, onClose, onAccept }: ProviderModalProps) {
  const [confirmed, setConfirmed] = useState(false)
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[999]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      {/* dialog */}
      <div
        className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2
                   bg-white rounded-xl shadow-2xl ring-1 ring-slate-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5">
          <h2 className="text-lg font-semibold text-slate-900">For service providers only</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ova opcija je namenjena kompanijama i samostalnim delatnostima koje žele da
            objave svoj biznis na Maylo platformi. Ako si regularan korisnik koji traži usluge,
            <strong> ne treba</strong> da uključuješ ovu opciju.
          </p>

          <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 space-y-1">
            <li>Potrebno je da budeš ovlašćen da predstavljaš biznis.</li>
            <li>Bićeš upitan/-na da dodaš podatke o kompaniji (naziv, adresa, kontakti, kategorije).</li>
            <li>Prvi period je besplatan po promotivnim uslovima koje objavimo.</li>
          </ul>

          <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5"
            />
            <span>Potvrđujem da predstavljam legalni biznis i prihvatam da unesem tačne podatke.</span>
          </label>

          <div className="mt-5 flex justify-end gap-2">
            <button className="btn-ghost" onClick={onClose}>Nazad</button>
            <button
              className={`btn-primary ${!confirmed ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={!confirmed}
              onClick={() => {
                onAccept()
                onClose()
              }}
            >
              Razumem
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [isProvider, setIsProvider] = useState(false)
  const [providerAccepted, setProviderAccepted] = useState(false) // potvrda iz modala
  const [showProviderModal, setShowProviderModal] = useState(false)

  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canSubmit = useMemo(() => {
    if (!isProvider) return !!email
    return !!email && providerAccepted
  }, [email, isProvider, providerAccepted])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // passwordless tok – magic link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        // beležimo rolu u user_metadata
        data: { role: isProvider ? 'provider' : 'user' },
      },
    })

    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      {!sent ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Sign up</h1>
          <form className="space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field mt-1"
                placeholder="you@example.com"
              />
            </label>

            <label className="flex items-start gap-2">
  <input
    type="checkbox"
    checked={isProvider}
    onChange={(e) => {
      const checked = e.target.checked
      setIsProvider(checked)
      // otvori modal kada se prvi put uključi opcija
      if (checked && !providerAccepted) setShowProviderModal(true)
    }}
  />
  <div>
    <div className="font-medium flex items-center gap-2">
      I’m a service provider
      <a
        href="/faq#providers"
        className="text-blue-600 text-sm hover:underline"
      >
        Learn more
      </a>
    </div>
    <div className="text-sm text-slate-600">
      Ako predstavljaš kompaniju i želiš da objaviš svoj biznis na Maylo.
    </div>
  </div>
</label>


            {isProvider && !providerAccepted && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Potrebno je da potvrdiš upozorenje pre kreiranja naloga (klikom na “I’m a service provider”
                otvara se prozor sa detaljima).
              </p>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`btn-primary w-full ${!canSubmit ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              Send confirmation link
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
          <p className="text-slate-600">
            Poslali smo ti verifikacioni link. Nakon potvrde, vodićemo te da postaviš lozinku.
          </p>
        </div>
      )}

      {/* Modal upozorenje za providere */}
      <ProviderNoticeModal
        open={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        onAccept={() => setProviderAccepted(true)}
      />
    </main>
  )
}
