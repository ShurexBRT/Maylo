import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LogIn, LogOut, Bookmark, Settings, User, Building2, X } from 'lucide-react'
import { useUI } from '@/lib/store'
import { supabase } from '@/lib/supabase'

type SessionLite = {
  user: { id: string; email?: string | null } | null
} | null

export default function Drawer() {
  const { drawerOpen, setDrawer } = useUI()
  const [session, setSession] = useState<SessionLite>(null)
  const navigate = useNavigate()

  // ← učitamo session i pratimo promene auth stanja
  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setSession(data?.session ? { user: data.session.user } : null)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ? { user: s.user } : null)
    })

    return () => {
      isMounted = false
      sub.subscription?.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setDrawer(false)
    navigate('/')
  }

  // ----- meni: bez "Results" (po dogovoru)
  const itemsWhenLoggedIn = [
    { to: '/saved', label: 'Saved', icon: <Bookmark className="w-5 h-5" /> },
    { to: '/account', label: 'My Account', icon: <User className="w-5 h-5" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { to: '/provider/onboard', label: 'Add your business', icon: <Building2 className="w-5 h-5" /> },
  ]

  const itemsWhenAnon = [
    { to: '/saved', label: 'Saved', icon: <Bookmark className="w-5 h-5" /> },
    { to: '/provider/onboard', label: 'Add your business', icon: <Building2 className="w-5 h-5" /> },
  ]

  return (
    <aside
      className={`drawer ${drawerOpen ? 'open' : ''}`}
      aria-hidden={!drawerOpen}
    >
      {/* Header unutar drawer-a */}
      <div className="drawer-head">
        <div className="flex items-center gap-2">
          <img src="/icons/icon-192.png" alt="Maylo" className="logo" />
          <span className="brand">Maylo</span>
        </div>

        <button
          aria-label="Close menu"
          className="btn-icon"
          onClick={() => setDrawer(false)}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* User info (ako je logovan) */}
      {session?.user && (
        <div className="drawer-user">
          <div className="text-xs text-slate-500">Email</div>
          <div className="font-medium">{session.user.email}</div>
        </div>
      )}

      <nav className="mt-2">
        <ul className="space-y-1">
          {(session?.user ? itemsWhenLoggedIn : itemsWhenAnon).map((it) => (
            <li key={it.label}>
              <Link
                to={it.to}
                className="drawer-item"
                onClick={() => setDrawer(false)}
              >
                {it.icon}
                <span>{it.label}</span>
              </Link>
            </li>
          ))}

          {/* Login/Signup ili Logout */}
          {session?.user ? (
            <li>
              <button className="drawer-item w-full text-left" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" className="drawer-item" onClick={() => setDrawer(false)}>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link to="/signup" className="drawer-item" onClick={() => setDrawer(false)}>
                  <User className="w-5 h-5" />
                  <span>Sign up</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  )
}
