// src/components/Drawer.tsx
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUI } from '@/lib/store'
import { useSession, useProfile, useCanAddBusiness } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-2">
      <div className="drawer-group-title">{title}</div>
      <ul className="drawer-list">{children}</ul>
    </div>
  )
}

function Item({
  label,
  onClick,
  active,
}: {
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <li>
      <button
        className={`drawer-item ${active ? 'active' : ''}`}
        onClick={onClick}
      >
        {label}
      </button>
    </li>
  )
}

export default function Drawer() {
  const { drawerOpen, setDrawer } = useUI()
  const { userId } = useSession()
  const { profile } = useProfile(userId)
  const canAddBiz = useCanAddBusiness(userId, profile?.role)
  const nav = useNavigate()
  const loc = useLocation()

  // Lock scroll kada je otvoren
  useEffect(() => {
    const root = document.documentElement
    if (drawerOpen) {
      root.classList.add('overflow-hidden')
    } else {
      root.classList.remove('overflow-hidden')
    }
    return () => root.classList.remove('overflow-hidden')
  }, [drawerOpen])

  function go(to: string) {
    setDrawer(false)
    nav(to)
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
      setDrawer(false)
      nav('/welcome', { replace: true })
    } catch (e) {
      console.error('Logout error', e)
      window.location.assign('/welcome')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawer(false)}
      />

      {/* Panel */}
      <aside
        className={`drawer-panel ${drawerOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
      >
        {/* Header unutar panela */}
        <div className="drawer-head">
          <div className="flex items-center gap-2">
            <img src="/icons/icon-192.png" alt="Maylo" className="w-8 h-8" />
            <span className="text-lg font-semibold text-slate-800">Maylo</span>
          </div>
          <button
            className="btn-icon"
            aria-label="Close"
            onClick={() => setDrawer(false)}
          >
            ✕
          </button>
        </div>

        {/* Sadržaj */}
        <nav className="py-2">
          <Group title="General">
            <Item label="Saved" onClick={() => go('/saved')} active={loc.pathname.startsWith('/saved')} />
            {userId && (
              <Item label="My Account" onClick={() => go('/account')} active={loc.pathname.startsWith('/account')} />
            )}
            <Item label="Settings" onClick={() => go('/settings')} active={loc.pathname.startsWith('/settings')} />
          </Group>

          {(userId && (profile?.role === 'provider' || profile?.role === 'admin') && canAddBiz) && (
            <Group title="Business">
              <Item label="Add your business" onClick={() => go('/provider/onboard')} active={loc.pathname.startsWith('/provider')} />
            </Group>
          )}

          <Group title="Help">
            <Item label="FAQ" onClick={() => go('/faq')} active={loc.pathname.startsWith('/faq')} />
            <Item label="Contact" onClick={() => go('/contact')} active={loc.pathname.startsWith('/contact')} />
            <Item label="Terms" onClick={() => go('/terms')} active={loc.pathname.startsWith('/terms')} />
          </Group>

          {/* Auth actions */}
          {!userId ? (
            <div className="px-3 pt-1 space-y-2">
              <button className="btn-primary w-full" onClick={() => go('/login')}>Login</button>
              <button
                className="w-full rounded-xl border border-slate-300 py-2 font-medium hover:bg-slate-50"
                onClick={() => go('/signup')}
              >
                Sign up
              </button>
            </div>
          ) : (
            <div className="px-3 pt-1">
              <button
                className="w-full rounded-xl bg-slate-100 py-2 font-medium hover:bg-slate-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </nav>

        <div className="px-5 py-4 text-xs text-slate-400 mt-auto">
          © {new Date().getFullYear()} Maylo
        </div>
      </aside>
    </>
  )
}
