import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      // čekamo session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      const userId = session.user.id

      // povuci profil (role)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      // ako je provider, proveri ima li kompaniju
      if (profile?.role === 'provider') {
        const { data: owned } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_user_id', userId)
          .maybeSingle()

        if (!owned) {
          navigate('/provider/onboard') // registruj biznis
          return
        } else {
          navigate(`/provider/edit/${owned.id}`) // već postoji → edit
          return
        }
      }

      // regular user
      navigate('/account')
    })()
  }, [navigate])

  return <main className="p-6">Signing you in…</main>
}
