import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

/** rute koje su javne i NE treba da se preusmeravaju na /welcome */
const PUBLIC_PATHS = new Set([
  '/',            // Home može ostati javna (po želji)
  '/welcome',
  '/login',
  '/signup',
  '/auth/callback',
  '/faq',
  '/terms',
  '/contact',
])

/** Flag u localStorage kad je user izabrao “Continue as guest” */
const GUEST_KEY = 'maylo_guest'

export default function StartupGate() {
  const nav = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    let cancelled = false

    async function run() {
      // 1) dozvoli javne rute
      if (PUBLIC_PATHS.has(pathname)) return

      // 2) ako je "guest", pusti ga (ali bez supabase sesije)
      const isGuest = localStorage.getItem(GUEST_KEY) === '1'
      if (isGuest) return

      // 3) ako ima supabase sesiju – pusti ga
      const { data } = await supabase.auth.getUser()
      if (!cancelled && !data?.user) {
        // nema sesije i nije guest -> vrati na welcome
        nav('/welcome', { replace: true })
      }
    }

    run()
    return () => { cancelled = true }
  }, [pathname, nav])

  return null
}

/** util: pozovi kad korisnik klikne “Continue as guest” */
export function markGuestSession() {
  localStorage.setItem(GUEST_KEY, '1')
}

/** util: isključi guest flag (npr. posle signupa/login-a i na logout-u) */
export function clearGuestSession() {
  localStorage.removeItem(GUEST_KEY)
}
