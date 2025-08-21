import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import { useUI } from '@/lib/store'
import { useFavorites } from './useFavorites'
import { useNavigate } from 'react-router-dom'

export default function SavedPage(){
  const nav = useNavigate()
  const { drawerOpen, setDrawer } = useUI()
  const { list, toggle } = useFavorites()

  const openProfile = (id: string) => nav(`/profile/${id}`)

  const onRemove = async (id: string) => {
    try {
      await toggle(id) // toggle će izbaciti iz liste
    } catch (err) {
      const msg = (err as Error)?.message || ''
      if (msg.includes('Not authenticated')) {
        nav('/login')
      } else {
        console.error(err)
      }
    }
  }

  const items = list.data ?? []
  const isLoading = list.isLoading
  const isError   = list.isError

  return (
    <div onClick={() => drawerOpen && setDrawer(false)}>
      <Header />
      <Drawer />

      <main className="max-w-3xl mx-auto p-4">
        {isLoading && <div className="text-center py-12">Loading…</div>}
        {isError && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-slate-600">Please try again.</p>
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-7xl mb-4">📥</div>
            <h2 className="text-xl font-semibold mb-1">No saved services</h2>
            <p className="text-slate-600 mb-4">You haven't saved any services yet.</p>
            <a href="/" className="btn-primary">Browse services</a>
          </div>
        )}

        {items.length > 0 && (
          <div className="space-y-4">
            {items.map((c) => (
              <article key={c.id} className="card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{c.name}</h3>
                    <div className="text-sm text-slate-600">
                      {c.category}{Array.isArray(c.languages)&&c.languages.length>0?` · ${c.languages.join(', ')}`:''}
                    </div>
                    <div className="text-sm text-slate-700 mt-1">
                      {c.address ? `${c.address}, ` : ''}{c.city}{c.country?`, ${c.country}`:''}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => openProfile(c.id)}
                    >
                      Details
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => onRemove(c.id)}
                    >
                      Remove
                    </button>
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
