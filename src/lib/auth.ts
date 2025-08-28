import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type Profile = {
  id: string
  full_name: string | null
  role: 'user' | 'provider' | 'admin'
}

export function useSession() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setUserId(data?.user?.id ?? null)
      setLoading(false)
    })()

    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setUserId(sess?.user?.id ?? null)
    })
    return () => { sub.subscription.unsubscribe(); mounted = false }
  }, [])

  return { userId, loading }
}

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(!!userId)

  useEffect(() => {
    let mounted = true
    if (!userId) { setProfile(null); setLoading(false); return }
    setLoading(true)
    supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!mounted) return
        if (error) { setProfile(null) } else { setProfile(data as Profile) }
        setLoading(false)
      })
    return () => { mounted = false }
  }, [userId])

  return { profile, loading }
}

/** Da li korisnik treba da vidi "Add your business" */
export function useCanAddBusiness(userId: string | null, role?: Profile['role']) {
  const [can, setCan] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!userId || !(role === 'provider' || role === 'admin')) { setCan(false); return }
    ;(async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_user_id', userId)
        .maybeSingle()
      if (!mounted) return
      if (error) { setCan(false) }
      else setCan(!data?.id) // true samo ako NE postoji firma
    })()
    return () => { mounted = false }
  }, [userId, role])

  return can
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
