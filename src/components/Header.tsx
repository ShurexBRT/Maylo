
import { useUI } from '@/lib/store'
import { Link } from 'react-router-dom'

export default function Header(){
  const { drawerOpen, setDrawer } = useUI()
  return (
    <header className="header">
      <Link to="/" aria-label="Home">
        <img src="/icons/icon-192.png" alt="Maylo" className="logo" />
      </Link>
      <div className="font-bold text-blue-700">Maylo</div>
      <button aria-label="Menu" onClick={()=>setDrawer(!drawerOpen)}>☰</button>
    </header>
  )
}
