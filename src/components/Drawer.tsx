import { Link } from 'react-router-dom'
import { useUI } from '@/lib/store'

export default function Drawer(){
  const { drawerOpen, setDrawer } = useUI()

  return (
    <aside
      className={`drawer z-50 ${drawerOpen ? 'open' : ''}`}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="font-bold text-blue-700 text-lg">Maylo</div>
        <button aria-label="Close menu" onClick={() => setDrawer(false)}>✕</button>
      </div>

      <nav className="space-y-3">
        <Link to="/results" onClick={() => setDrawer(false)} className="block">Results</Link>
        <Link to="/saved" onClick={() => setDrawer(false)} className="block">Saved</Link>
        <Link to="/account" onClick={() => setDrawer(false)} className="block">My Account</Link>
        <Link to="/settings" onClick={() => setDrawer(false)} className="block">Settings</Link>
        <Link to="/provider/onboard" onClick={() => setDrawer(false)} className="block">Add your business</Link>
        <hr className="my-4" />
        <Link to="/login" onClick={() => setDrawer(false)} className="block">Login</Link>
        <Link to="/signup" onClick={() => setDrawer(false)} className="block">Sign up</Link>
      </nav>
    </aside>
  )
}
