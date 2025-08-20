
import { useUI } from '@/lib/store'
import { Link } from 'react-router-dom'

export default function Drawer(){
  const { drawerOpen, setDrawer } = useUI()
  return (
    <aside className={`drawer ${drawerOpen ? 'open' : ''}`} onClick={(e)=>e.stopPropagation()}>
      <nav className="space-y-4">
        <Link to="/saved" onClick={()=>setDrawer(false)} className="block">Saved</Link>
        <Link to="/results" onClick={()=>setDrawer(false)} className="block">Results</Link>
      </nav>
    </aside>
  )
}
