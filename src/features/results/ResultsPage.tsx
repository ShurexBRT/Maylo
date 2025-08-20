
import Header from '@/components/Header'
import Drawer from '@/components/Drawer'
import { useUI } from '@/lib/store'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'

export default function ResultsPage(){
  const { drawerOpen, setDrawer } = useUI()
  const [params] = useSearchParams()
  const branch  = params.get('branch') || ''
  const country = params.get('country') || ''
  const city    = params.get('city') || ''

  const query = useInfiniteQuery({
    queryKey: ['companies', { branch, country, city }],
    queryFn: async ({ pageParam = 0 }) => {
      // TODO: Supabase query; placeholder empty list
      return { items: [], nextCursor: null }
    },
    getNextPageParam: (last) => last.nextCursor,
  })

  const items = query.data?.pages.flatMap(p => p.items) ?? []

  return (
    <div onClick={()=>drawerOpen && setDrawer(false)}>
      <Header/>
      <Drawer/>
      <main className="max-w-5xl mx-auto p-4">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-7xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold mb-1">No results found</h2>
            <p className="text-slate-600 mb-4">Try changing filters</p>
            <a href="/" className="btn-primary">Reset filters</a>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((c:any) => (
              <article key={c.id} className="card overflow-hidden">
                <div className="aspect-video bg-slate-50 border-b" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{c.name}</h3>
                    <button aria-label="Save" className="text-red-500">♥</button>
                  </div>
                  <div className="text-sm text-slate-600 mb-2">{c.category} · {c.languages?.join(', ')}</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {c.languages?.map((l:string)=>(<span key={l} className="pill">{l}</span>))}
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 mb-3">
                    <span>📍</span><span>{c.address}, {c.city}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-blue-600" aria-label="Call">📞</button>
                    <button className="text-blue-600" aria-label="Email">✉️</button>
                    <button className="text-blue-600" aria-label="Open in maps">🗺️</button>
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
