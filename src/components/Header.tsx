import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useUI } from '@/lib/store'

export default function Header() {
  const { setDrawer } = useUI()

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* left: logo + brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/icons/icon-192.png" alt="Maylo" className="logo" />
          <span className="brand">Maylo</span>
        </Link>

        {/* right: hamburger */}
        <button
          type="button"
          aria-label="Menu"
          className="btn-icon"
          onClick={() => setDrawer(true)}
        >
          <span className="material-icons"></span>
          <Menu className="w-6 h-6 text-slate-800" />
        </button>
      </div>
    </header>
  )
}
