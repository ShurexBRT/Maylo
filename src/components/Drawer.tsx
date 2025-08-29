// src/components/Drawer.tsx
import { Link, useNavigate } from 'react-router-dom'
import { useUI } from '@/lib/store'
import { useSession, useProfile, useCanAddBusiness } from '@/lib/authState'
import { signOutTo } from '@/lib/auth'

export default function Drawer() {
  const navigate = useNavigate()
  const { drawerOpen, setDrawer } = useUI()
  const { userId } = useSession()
  const { profile } = useProfile(userId)
  const canAddBusiness = useCanAddBusiness(userId, profile?.role)

  const close = () => setDrawer(false)

  return (
    <aside
      className={`drawer ${drawerOpen ? 'open' : ''} fixed top-0 right-0 h-screen w-72 bg-white shadow-2xl z-[1000] transition-transform`}
      aria-hidden={!drawerOpen}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <span className="text-xl font-semibold">Maylo</span>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          <li>
            <Link to="/saved" onClick={close} className="block px-4 py-3 hover:bg-gray-50 rounded-md">
              Saved
            </Link>
          </li>

          {userId && (
            <li>
              <Link to="/account" onClick={close} className="block px-4 py-3 hover:bg-gray-50 rounded-md">
                My Account
              </Link>
            </li>
          )}

          {userId && (
            <li>
              <Link to="/settings" onClick={close} className="block px-4 py-3 hover:bg-gray-50 rounded-md">
                Settings
              </Link>
            </li>
          )}

          {/* Provider UX */}
          {userId && (profile?.role === 'provider' || profile?.role === 'admin') && (
            <li>
              {canAddBusiness ? (
                <Link to="/provider/onboard" onClick={close} className="block px-4 py-3 hover:bg-gray-50 rounded-md">
                  Add your business
                </Link>
              ) : (
                <Link to="/provider/edit" onClick={close} className="block px-4 py-3 hover:bg-gray-50 rounded-md">
                  Edit your business
                </Link>
              )}
            </li>
          )}

          {/* Auth actions */}
          {!userId ? (
            <>
              <li>
                <Link to="/login" onClick={close} className="block px-4 py-3 hover:bg-gray-50 rounded-md">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" onClick={close} className="block px-4 py-3 hover:bg-gray-50 rounded-md">
                  Sign up
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={async () => {
                  close()
                  await signOutTo('/welcome')
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-md text-red-600"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  )
}
