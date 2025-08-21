import { Link } from 'react-router-dom'
import { useUI } from '@/lib/store'

export default function Header(){
  const { drawerOpen, setDrawer } = useUI()

  return (
    <header className="header">
      <Link to="/" aria-label="Home" className="flex items-center gap-2">
        {/* Ubaci pravu ikonu kada je dodaš u src/assets */}
        <img src="/icons/icon-192.png" alt="Maylo" className="logo" />
        <span className="font-bold text-blue-700">Maylo</span>
      </Link>

      <nav className="hidden md:flex items-center gap-4 text-sm">
        <Link to="/results" className="hover:underline">Results</Link>
        <Link to="/saved" className="hover:underline">Saved</Link>
        <Link to="/provider/onboard" className="hover:underline">Add your business</Link>
        <Link to="/login" className="btn-secondary">Login</Link>
      </nav>

      <button
        aria-label="Menu"
        className="md:hidden text-2xl"
        onClick={() => setDrawer(!drawerOpen)}
      >
        ☰
      </button>
    </header>
  )
}
