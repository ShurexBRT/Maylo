// src/components/Protected.tsx
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthUser } from '@/features/auth/hooks'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

type Props = {
  children: ReactNode
  role?: 'user' | 'provider' | 'admin'
}

export default function Protected({ children, role }: Props) {
  const loc = useLocation()
  const { data: user, isLoading } = useAuthUser()

  // ako tražimo specifičnu rolu, povuci profil
  const prof = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!user && !!role,
  })

  if (isLoading || (role && prof.isLoading)) {
    return <div className="p-4">Loading…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />
  }

  if (role && prof.data?.role !== role && prof.data?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
