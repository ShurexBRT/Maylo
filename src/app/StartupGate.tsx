// src/app/StartupGate.tsx
import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { attachGuestAutoLogout } from '@/lib/guest'

type Props = { children: ReactNode }

export default function StartupGate({ children }: Props) {
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.auth.getUser()

      if (!data?.user) {
        // nije logovan → idi na welcome
        navigate('/welcome', { replace: true })
      } else {
        // logovan → proveri da li je guest
        attachGuestAutoLogout()
      }
    })()
  }, [navigate])

  return <>{children}</>
}
