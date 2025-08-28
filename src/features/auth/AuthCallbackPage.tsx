// src/features/auth/AuthCallbackPage.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import '@/styles/globals.css'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // posle Supabase email-verifikacije sesija bi trebalo da bude kreirana
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        navigate('/set-password', { replace: true })
      } else {
        // fallback: vrati na login ako nešto fali
        navigate('/login', { replace: true })
      }
    })
  }, [navigate])

  return <main className="max-w-md mx-auto p-6">Finalizing sign-in…</main>
}
