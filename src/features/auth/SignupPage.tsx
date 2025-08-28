// src/features/auth/SignupPage.tsx
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import '@/styles/globals.css'


export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // ✅ passwordless tok – šalje magic link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) setError(error.message)
    else setSent(true)
  }

  if (sent) {
    return (
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
        <p>
          Poslali smo ti verifikacioni link. Otvori ga, a zatim ćeš biti prebačen
          na stranicu za postavljanje lozinke.
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sign up</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm font-medium">Email</label>
        <input
          className="w-full border rounded-lg px-3 py-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          type="submit"
        >
          Send confirmation link
        </button>
      </form>
    </main>
  )
}
