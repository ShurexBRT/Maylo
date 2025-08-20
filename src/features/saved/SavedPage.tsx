
import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import { useUI } from '@/lib/store'

export default function SavedPage(){
  const { drawerOpen, setDrawer } = useUI()

  const savedItems:any[] = [] // TODO: fetch from Supabase or local

  return (
    <div onClick={()=>drawerOpen && setDrawer(false)}>
      <Header/>
      <Drawer/>
      <main className="max-w-3xl mx-auto p-4">
        {savedItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-7xl mb-4">📥</div>
            <h2 className="text-xl font-semibold mb-1">No saved services</h2>
            <p className="text-slate-600 mb-4">You haven't saved any services yet.</p>
            <a href="/" className="btn-primary">Browse services</a>
          </div>
        ) : (
          <div className="space-y-4">
            {savedItems.map((c)=>(
              <article key={c.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <div className="text-sm text-slate-600">{c.category}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-blue-600">Details</button>
                    <button className="text-red-600">Remove</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
