
import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import { useUI } from '@/lib/store'
import { useParams } from 'react-router-dom'

export default function ProfilePage(){
  const { drawerOpen, setDrawer } = useUI()
  const { id } = useParams()
  return (
    <div onClick={()=>drawerOpen && setDrawer(false)}>
      <Header/>
      <Drawer/>
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Company #{id}</h1>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-semibold">Company name</div>
            <button className="text-red-500" aria-label="Save">♥</button>
          </div>
          <div className="text-slate-600 mb-3">Category · en, de</div>
          <div className="flex items-center gap-2 mb-4"><span>📍</span><span>Address, City</span></div>
          <div className="flex items-center gap-4 mb-6">
            <button className="text-blue-600">📞</button>
            <button className="text-blue-600">✉️</button>
            <button className="text-blue-600">🗺️</button>
          </div>
          <button className="btn-primary">Write a review</button>
        </div>
      </main>
    </div>
  )
}
