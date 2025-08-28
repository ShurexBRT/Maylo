// src/features/account/AccountPage.tsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import '@/styles/globals.css'


export default function AccountPage() {
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ''))
  }, [])

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <div className="bg-white border rounded-xl p-4">
        <p className="text-sm text-gray-600">Email</p>
        <p className="font-medium">{email}</p>
      </div>
    </main>
  )
}
