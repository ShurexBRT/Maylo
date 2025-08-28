// src/features/auth/SetPasswordPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import '@/styles/globals.css'

export default function SetPasswordPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else navigate('/account', { replace: true })
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Set your password</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm font-medium">New password</label>
        <input
          className="w-full border rounded-lg px-3 py-2"
          type="password"
          minLength={6}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
          Save password
        </button>
      </form>
    </main>
  )
}
